import React, { useState, useEffect, useRef } from 'react';
import { Send, ChefHat, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { trackMessageSent, trackRecipeMentioned } from '@/lib/aiChatAnalytics';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RecipeAIChatDialogProps {
  recipe: Recipe;
  open: boolean;
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  "Can I make this dairy-free?",
  "What can I substitute for ",
  "Scale this to 6 servings",
  "How do I know when it's done?"
];

export const RecipeAIChatDialog: React.FC<RecipeAIChatDialogProps> = ({ recipe, open, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      // Initialize with recipe context
      setMessages([{
        role: 'assistant',
        content: `Hi! I'm Chef Quinn, your AI sous chef. Ask me anything about "${recipe.name}" - ingredients, cooking techniques, substitutions, or tips!`
      }]);
    }
  }, [open, recipe.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;

    trackMessageSent(text.length, user?.id);

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const { data, error } = await supabase.functions.invoke('ai-recipe-chat', {
        body: {
          message: text,
          recipeContext: {
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            cookTime: recipe.cookTime,
            prepTime: recipe.prepTime,
            servings: recipe.servings,
            difficulty: recipe.difficulty
          },
          userId: user?.id
        },
        headers
      });

      if (error) {
        // Surface server error message clearly to user
        const serverMsg = (error as any)?.message || 'Chat unavailable';
        toast({ title: 'Chat limit or error', description: serverMsg, variant: 'destructive' });
        throw error;
      }

      if (data.error) {
        toast({
          title: "Chat error",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      trackRecipeMentioned(recipe.id, user?.id);

      const aiMessage: Message = {
        role: 'assistant',
        content: data.response
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error('Chat error:', error);
      // Graceful fallback message
      const fallback: Message = {
        role: 'assistant',
        content: `I'm having trouble reaching the server right now.\n\nHere are quick tips for ${recipe.name}:\n- Check doneness: follow the timer and look for visual cues.\n- Substitutions: swap similar ingredients in equal amounts.\n- Scale servings: multiply ingredient amounts accordingly.\n\nYou can try again in a moment, or continue cooking—I’ve got your back!`
      };
      setMessages(prev => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    const mainIngredient = recipe.ingredients[0]?.item || "the ingredient";
    const fullPrompt = prompt.includes("substitute") 
      ? prompt + mainIngredient + "?"
      : prompt;
    handleSend(fullPrompt);
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[80] animate-fade-in"
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-background z-[90] shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold truncate">Chef Quinn</h2>
                <p className="text-sm text-muted-foreground truncate">{recipe.name}</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Recipe Preview */}
        <div className="p-4 border-b border-border bg-card/30">
          <div className="flex gap-3">
            <img 
              src={recipe.image}
              alt={recipe.name}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{recipe.name}</h3>
              <p className="text-xs text-muted-foreground">
                {recipe.prepTime} prep • {recipe.cookTime} cook • {recipe.servings} servings
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 1 ? (
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="rounded-lg px-4 py-3 bg-card border border-border/40">
                    <p className="text-sm">{messages[0].content}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePromptClick(prompt)}
                        className="p-3 rounded-lg border border-border/40 bg-card/50 hover:bg-accent/50 transition-colors text-left text-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'assistant' 
                      ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                      : 'bg-primary'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ChefHat className="w-4 h-4 text-white" />
                    ) : (
                      <span className="text-xs font-medium text-primary-foreground">
                        {user?.email?.[0].toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className={`flex-1 ${msg.role === 'user' ? 'max-w-[80%] ml-auto' : 'max-w-[80%]'}`}>
                    <div className={`rounded-lg px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border/40'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <ChefHat className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 max-w-[80%]">
                    <div className="rounded-lg px-4 py-3 bg-card border border-border/40">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything about this recipe..."
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px] rounded-lg flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
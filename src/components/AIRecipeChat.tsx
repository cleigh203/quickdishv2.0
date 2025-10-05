import React, { useState, useEffect, useRef } from 'react';
import { Send, ChefHat, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { RecipeCard } from '@/components/RecipeCard';
import { allRecipes } from '@/data/recipes';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recipeIds?: string[];
}

const SUGGESTED_PROMPTS = [
  "What can I make with my saved recipes?",
  "Show me quick dinner ideas from my collection",
  "Which of my saved recipes are under 30 minutes?",
  "Suggest a meal plan using my saved recipes"
];

export const AIRecipeChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isPremium } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadSavedRecipes();
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSavedRecipes = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_recipes')
      .select('recipe_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading saved recipes:', error);
      return;
    }

    const recipes = data
      .map(sr => allRecipes.find(r => r.id === sr.recipe_id))
      .filter((r): r is Recipe => r !== undefined);

    setSavedRecipes(recipes);
  };

  const loadChatHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('ai_chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (error) {
      console.error('Error loading chat history:', error);
      return;
    }

    const history: Message[] = data.flatMap(msg => [
      { role: 'user' as const, content: msg.message },
      { role: 'assistant' as const, content: msg.response, recipeIds: msg.recipe_ids || [] }
    ]);

    setMessages(history);
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading || !isPremium) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-recipe-chat', {
        body: {
          message: text,
          savedRecipes: savedRecipes.map(r => ({
            id: r.id,
            name: r.name,
            description: r.description,
            cookTime: r.cookTime,
            difficulty: r.difficulty
          })),
          userId: user?.id
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Chat error",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      const aiMessage: Message = {
        role: 'assistant',
        content: data.response.replace(/\[RECIPE:[\w-]+\]/g, ''),
        recipeIds: data.recipeIds
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  if (!isPremium) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container max-w-4xl py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">AI Recipe Assistant</h2>
              <p className="text-sm text-muted-foreground">Unlimited chats this month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl py-6 px-4 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
              <div className="p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <ChefHat className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Start a conversation</h3>
                <p className="text-muted-foreground max-w-md">
                  Ask me anything about your saved recipes, meal planning, or cooking tips
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt)}
                    className="p-4 rounded-lg border border-border/40 bg-card/50 hover:bg-accent/50 transition-colors text-left text-sm"
                  >
                    {prompt}
                  </button>
                ))}
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
                  <div className={`flex-1 space-y-3 ${msg.role === 'user' ? 'max-w-[80%] ml-auto' : 'max-w-[80%]'}`}>
                    <div className={`rounded-lg px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border/40'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.recipeIds && msg.recipeIds.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.recipeIds.map(recipeId => {
                          const recipe = allRecipes.find(r => r.id === recipeId);
                          if (!recipe) return null;
                          return (
                            <RecipeCard
                              key={recipeId}
                              recipe={recipe}
                              showSaveButton={false}
                            />
                          );
                        })}
                      </div>
                    )}
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
      </div>

      {/* Input */}
      <div className="border-t border-border/40 bg-card/50 backdrop-blur-sm sticky bottom-0">
        <div className="container max-w-4xl py-4 px-4">
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
              placeholder="Ask about your recipes..."
              className="min-h-[60px] resize-none"
              disabled={isLoading || !isPremium}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading || !isPremium}
              size="icon"
              className="h-[60px] w-[60px] rounded-lg"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

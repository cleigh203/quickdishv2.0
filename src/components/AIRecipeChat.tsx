import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, ChefHat, Sparkles, Check, CheckCheck, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Recipe } from '@/types/recipe';
import { RecipeCard } from '@/components/RecipeCard';
import { useRecipes } from '@/contexts/RecipesContext';
import { trackMessageSent, trackRecipeClicked, trackRecipeMentioned, trackChatError } from '@/utils/analytics';
import { ChatErrorBoundary } from '@/components/ChatErrorBoundary';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recipeIds?: string[];
  status?: 'sending' | 'sent' | 'delivered' | 'error';
  timestamp?: number;
}

const SUGGESTED_PROMPTS = [
  "What can I make with my saved recipes?",
  "Show me quick dinner ideas from my collection",
  "Which of my saved recipes are under 30 minutes?",
  "Suggest a meal plan using my saved recipes"
];

const MAX_MESSAGE_LENGTH = 1000;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 10; // messages per minute

export const AIRecipeChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [messageQueue, setMessageQueue] = useState<string[]>([]);
  const [rateLimitCount, setRateLimitCount] = useState(0);
  const [lastRateLimitReset, setLastRateLimitReset] = useState(Date.now());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const { recipes: allRecipes } = useRecipes();

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({ title: "Back online", description: "Processing queued messages..." });
      processMessageQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({ title: "You're offline", description: "Messages will be sent when back online", variant: "destructive" });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadSavedRecipes();
      loadChatHistory();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Rate limit reset
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastRateLimitReset >= RATE_LIMIT_WINDOW) {
        setRateLimitCount(0);
        setLastRateLimitReset(now);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRateLimitReset]);

  const loadSavedRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('recipe_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const recipes = data
        .map(sr => allRecipes.find(r => r.id === sr.recipe_id))
        .filter((r): r is Recipe => r !== undefined);

      setSavedRecipes(recipes);
    } catch (error: any) {
      console.error('Error loading saved recipes:', error);
      trackChatError('Failed to load saved recipes', error.message, user.id);
      toast({
        title: "Failed to load recipes",
        description: "Please refresh the page",
        variant: "destructive"
      });
    }
  };

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      const history: Message[] = data.flatMap(msg => [
        { role: 'user' as const, content: msg.message, status: 'delivered' },
        { role: 'assistant' as const, content: msg.response, recipeIds: msg.recipe_ids || [], status: 'delivered' }
      ]);

      setMessages(history);
    } catch (error: any) {
      console.error('Error loading chat history:', error);
      trackChatError('Failed to load chat history', error.message, user.id);
    }
  };

  const processMessageQueue = useCallback(async () => {
    if (messageQueue.length === 0 || !isOnline) return;

    const message = messageQueue[0];
    setMessageQueue(prev => prev.slice(1));
    await handleSend(message);
  }, [messageQueue, isOnline]);

  const checkRateLimit = (): boolean => {
    if (rateLimitCount >= RATE_LIMIT_MAX) {
      toast({
        title: "Slow down!",
        description: `Please wait before sending more messages (max ${RATE_LIMIT_MAX} per minute)`,
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading || !isPremium) return;

    // Validation
    if (text.length > MAX_MESSAGE_LENGTH) {
      toast({
        title: "Message too long",
        description: `Please keep messages under ${MAX_MESSAGE_LENGTH} characters`,
        variant: "destructive"
      });
      return;
    }

    // Check rate limit
    if (!checkRateLimit()) return;

    // Check if recipes were deleted
    if (savedRecipes.length === 0) {
      toast({
        title: "No saved recipes",
        description: "Save some recipes first to chat with AI",
        variant: "destructive"
      });
      return;
    }

    // Handle offline mode
    if (!isOnline) {
      setMessageQueue(prev => [...prev, text]);
      toast({
        title: "Queued",
        description: "Message will be sent when back online"
      });
      return;
    }

    // Track analytics
    trackMessageSent(text.length, user?.id);
    setRateLimitCount(prev => prev + 1);

    const timestamp = Date.now();
    const userMessage: Message = { 
      role: 'user', 
      content: text,
      status: 'sending',
      timestamp
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Update to "sent"
      setMessages(prev => 
        prev.map(m => m.timestamp === timestamp ? { ...m, status: 'sent' as const } : m)
      );

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
        setMessages(prev => 
          prev.map(m => m.timestamp === timestamp ? { ...m, status: 'error' as const } : m)
        );
        trackChatError(data.error, 'AI response error', user?.id);
        toast({
          title: "Chat error",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      // Update to "delivered"
      setMessages(prev => 
        prev.map(m => m.timestamp === timestamp ? { ...m, status: 'delivered' as const } : m)
      );

      // Track recipe mentions
      data.recipeIds?.forEach((recipeId: string) => {
        trackRecipeMentioned(recipeId, user?.id);
      });

      const aiMessage: Message = {
        role: 'assistant',
        content: data.response.replace(/\[RECIPE:[\w-]+\]/g, ''),
        recipeIds: data.recipeIds,
        status: 'delivered'
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => 
        prev.map(m => m.timestamp === timestamp ? { ...m, status: 'error' as const } : m)
      );
      trackChatError(error.message, 'Network error', user?.id);
      toast({
        title: "Failed to send message",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipeId: string) => {
    trackRecipeClicked(recipeId, user?.id);
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  if (!isPremium) {
    return null;
  }

  return (
    <ChatErrorBoundary onReset={() => setMessages([])}>
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="container max-w-4xl py-4 px-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Recipe Assistant</h2>
                <p className="text-sm text-muted-foreground">Unlimited chats this month</p>
              </div>
            </div>
            {!isOnline && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <WifiOff className="w-4 h-4" />
                <span>Offline</span>
              </div>
            )}
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
                        ? msg.status === 'error'
                          ? 'bg-destructive/10 border border-destructive text-destructive'
                          : 'bg-primary text-primary-foreground'
                        : 'bg-card border border-border/40'
                    }`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm whitespace-pre-wrap flex-1">{msg.content}</p>
                        {msg.role === 'user' && msg.status && (
                          <div className="flex-shrink-0 mt-1">
                            {msg.status === 'sending' && (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            )}
                            {msg.status === 'sent' && (
                              <Check className="w-4 h-4 opacity-60" />
                            )}
                            {msg.status === 'delivered' && (
                              <CheckCheck className="w-4 h-4" />
                            )}
                            {msg.status === 'error' && (
                              <span className="text-xs">Failed</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {msg.recipeIds && msg.recipeIds.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.recipeIds.map(recipeId => {
                          const recipe = allRecipes.find(r => r.id === recipeId);
                          if (!recipe) return null;
                          return (
                            <div key={recipeId} onClick={() => handleRecipeClick(recipeId)}>
                              <RecipeCard
                                recipe={recipe}
                                showSaveButton={false}
                              />
                            </div>
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
          <div className="space-y-2">
            {input.length > MAX_MESSAGE_LENGTH * 0.8 && (
              <div className="text-xs text-muted-foreground text-right">
                {input.length}/{MAX_MESSAGE_LENGTH} characters
                {input.length > MAX_MESSAGE_LENGTH && (
                  <span className="text-destructive ml-2">
                    Message too long!
                  </span>
                )}
              </div>
            )}
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
                disabled={isLoading || !isPremium || !isOnline}
                maxLength={MAX_MESSAGE_LENGTH}
                aria-label="Chat message input"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading || !isPremium || !isOnline || input.length > MAX_MESSAGE_LENGTH}
                size="icon"
                className="h-[60px] w-[60px] rounded-lg"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ChatErrorBoundary>
  );
};

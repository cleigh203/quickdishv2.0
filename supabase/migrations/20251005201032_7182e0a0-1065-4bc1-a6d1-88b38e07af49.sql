-- Create ai_chat_messages table
CREATE TABLE public.ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  recipe_ids UUID[],
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on user_id for better query performance
CREATE INDEX idx_ai_chat_messages_user_id ON public.ai_chat_messages(user_id);

-- Enable RLS
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_chat_messages
CREATE POLICY "Users can view their own chat messages"
  ON public.ai_chat_messages
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages"
  ON public.ai_chat_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create ai_chat_usage table
CREATE TABLE public.ai_chat_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_count INTEGER DEFAULT 0,
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_chat_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_chat_usage
CREATE POLICY "Users can view their own usage"
  ON public.ai_chat_usage
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON public.ai_chat_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON public.ai_chat_usage
  FOR UPDATE
  USING (auth.uid() = user_id);
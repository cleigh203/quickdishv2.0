-- Enable realtime for saved_recipes table
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_recipes;

-- Set replica identity to full for complete row data during updates
ALTER TABLE public.saved_recipes REPLICA IDENTITY FULL;
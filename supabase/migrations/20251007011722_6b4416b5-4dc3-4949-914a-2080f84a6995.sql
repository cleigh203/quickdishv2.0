-- Fix search path for the function created in previous migration
CREATE OR REPLACE FUNCTION update_shopping_list_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql 
SET search_path = public;
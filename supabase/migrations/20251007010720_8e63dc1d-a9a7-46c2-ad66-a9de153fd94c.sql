-- Add version field to shopping_lists for conflict detection
ALTER TABLE shopping_lists ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1 NOT NULL;

-- Add updated_at trigger if not exists
CREATE OR REPLACE FUNCTION update_shopping_list_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = OLD.version + 1;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shopping_list_version_trigger ON shopping_lists;
CREATE TRIGGER shopping_list_version_trigger
  BEFORE UPDATE ON shopping_lists
  FOR EACH ROW
  EXECUTE FUNCTION update_shopping_list_version();
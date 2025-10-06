-- Increase statement timeout for the database to 15 seconds
-- This prevents the database from canceling queries before our application timeout
ALTER DATABASE postgres SET statement_timeout = '15s';

-- Also set it for the current session to take effect immediately
SET statement_timeout = '15s';
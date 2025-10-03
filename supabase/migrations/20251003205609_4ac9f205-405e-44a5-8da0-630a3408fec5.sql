-- Remove the 4 AI-generated lasagna recipes
DELETE FROM generated_recipes 
WHERE id IN (
  '59c5c805-5746-45e9-91ff-7fcd881a2ccd',
  '6e6fa4e5-edf5-43ad-8793-149836a998fe',
  'a36cb1ef-7e70-488e-b92d-8cf347bf7a30',
  '45bb6d00-c679-4ae9-8c31-74f84b1aedbe'
);
 = 'src/App.tsx'
 = Get-Content -Raw 
 = @(
  '(?m)^const Admin\b.*\r?\n',
  '(?m)^const AdminRecipes\b.*\r?\n',
  '(?m)^\s*<Route path= /admin[^\r\n]*\r?\n',
  '(?m)^\s*<Route path=/admin/recipes[^\r\n]*\r?\n',
  '(?m)^\s*<Route path=/admin/generate-dessert-images[^\r\n]*\r?\n',
  '(?m)^\s*<Route path=/admin/generate-onepot-images[^\r\n]*\r?\n',
  '(?m)^\s*<Route path=/migrate-recipes[^\r\n]*\r?\n',
  '(?m)^\s*<Route path=/regenerate-images[^\r\n]*\r?\n',
  '(?m)^\s*<Route path=/batch-regenerate-images[^\r\n]*\r?\n',
  '(?m)^\s*<Route path=/custom-regenerate-images[^\r\n]*\r?\n',
  '(?m)^\s*<Route path=/quick-image-update[^\r\n]*\r?\n',
  '(?m)^\s*<Route path=/generate-recipe-images[^\r\n]*\r?\n',
  '(?m)^\s*<Route path=/execute-image-generation[^\r\n]*\r?\n'
)
foreach ( in ) {
   = [regex]::Replace(, , '')
}
Set-Content -Path  -Value 

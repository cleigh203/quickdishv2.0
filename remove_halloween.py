import re
from pathlib import Path
p = Path('src/data/recipes.ts')
text = p.read_text(encoding='utf-8')
lines = text.splitlines()

# Remove fallback const lines first
filtered = []
for ln in lines:
    if re.search(r'^\s*const\s+halloween', ln):
        continue
    if re.search(r'^\s*const\s+poisonAppleImg\b', ln):
        continue
    filtered.append(ln)
lines = filtered

out = []
i = 0
n = len(lines)
while i < n:
    line = lines[i]
    # Detect potential start of a top-level object
    if re.match(r'^\s*\{\s*$', line):
        start = i
        brace = 0
        j = i
        # accumulate until braces balance back to zero (object end)
        while j < n:
            brace += lines[j].count('{')
            brace -= lines[j].count('}')
            if j > start and brace == 0:
                break
            j += 1
        block = lines[start:j+1]
        block_text = '\n'.join(block)
        # determine if this is a recipe object (has id:) and is Halloween-related
        is_recipe = re.search(r'\bid:\s*"', block_text) is not None
        is_halloween = (
            re.search(r'\bid:\s*"halloween-', block_text) is not None or
            re.search(r'cuisine:\s*"Halloween"', block_text) is not None or
            re.search(r'tags:\s*\[[^\]]*halloween', block_text, re.IGNORECASE) is not None
        )
        if is_recipe and is_halloween:
            # drop the whole block
            i = j + 1
            continue
        else:
            out.extend(block)
            i = j + 1
            continue
    else:
        out.append(line)
        i += 1

p.write_text('\n'.join(out) + ('\n' if out and not out[-1].endswith('\n') else ''), encoding='utf-8')
print('done')

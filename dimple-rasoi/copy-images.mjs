import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const artifactsDir = 'C:\\Users\\DEBASHISH\\.gemini\\antigravity-ide\\brain\\2780f9de-b221-4579-a4e2-cc6a8cb19b32';
const destDir = path.join(__dirname, 'public', 'images');

// Create destination directory
fs.mkdirSync(destDir, { recursive: true });

const imageKeys = [
  'hero_food',
  'about_lady',
  'delivery_illustration',
  'dish_paneer',
  'dish_dal',
  'dish_biryani',
];

for (const key of imageKeys) {
  const files = fs.readdirSync(artifactsDir).filter(f => f.startsWith(key + '_') && f.endsWith('.png'));
  if (files.length > 0) {
    // Pick the latest one
    files.sort();
    const latest = files[files.length - 1];
    const src = path.join(artifactsDir, latest);
    const dest = path.join(destDir, key + '.png');
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied: ${key}.png`);
  } else {
    console.log(`✗ Not found: ${key}`);
  }
}

console.log('Done! Images copied to public/images/');

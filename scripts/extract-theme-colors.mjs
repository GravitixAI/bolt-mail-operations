import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themesDir = path.join(__dirname, '../public/themes');

const themeColors = [];

const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.css'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(themesDir, file), 'utf8');
  const name = file.replace('.css', '');
  
  // Extract light mode colors from :root block
  const rootMatch = content.match(/:root\s*\{([^}]+)\}/s);
  if (rootMatch) {
    const rootContent = rootMatch[1];
    
    const primary = rootContent.match(/--primary:\s*([^;]+);/)?.[1]?.trim();
    const accent = rootContent.match(/--accent:\s*([^;]+);/)?.[1]?.trim();
    const secondary = rootContent.match(/--secondary:\s*([^;]+);/)?.[1]?.trim();
    const muted = rootContent.match(/--muted:\s*([^;]+);/)?.[1]?.trim();
    
    if (primary && accent && secondary && muted) {
      themeColors.push({
        value: name,
        colors: { primary, accent, secondary, muted }
      });
    }
  }
});

console.log(JSON.stringify(themeColors, null, 2));


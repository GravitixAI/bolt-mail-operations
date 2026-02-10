import fs from 'fs';

const colorsData = JSON.parse(fs.readFileSync('scripts/theme-colors.json', 'utf8'));
const colorsMap = Object.fromEntries(colorsData.map(t => [t.value, t.colors]));

const themesConfig = fs.readFileSync('lib/themes.ts', 'utf8');

// Replace each theme entry to include colors
let updated = themesConfig.replace(
  /\{ name: "([^"]+)", value: "([^"]+)", cssFile: "([^"]+)" \}/g,
  (match, name, value, cssFile) => {
    const colors = colorsMap[value];
    if (!colors) {
      console.warn(`No colors found for: ${value}`);
      return match;
    }
    return `{ name: "${name}", value: "${value}", cssFile: "${cssFile}", colors: ${JSON.stringify(colors)} }`;
  }
);

fs.writeFileSync('lib/themes.ts', updated, 'utf8');
console.log('Updated themes.ts with color data');


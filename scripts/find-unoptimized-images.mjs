import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.join(process.cwd(), 'src');

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Error: The directory ${SRC_DIR} does not exist.`);
  process.exit(1);
}

// Allowed extensions
const EXTENSIONS = ['.astro', '.tsx', '.jsx', '.md', '.mdx'];

// Function to recursively find files with specific extensions
function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      const ext = path.extname(file);
      if (EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const sourceFiles = getFiles(SRC_DIR);
console.log(`Scanning ${sourceFiles.length} source files under src/ directory...\n`);

const results = [];
let totalMatches = 0;

for (const file of sourceFiles) {
  const relativePath = path.relative(process.cwd(), file);
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Check if line contains `<img` tag (case-insensitive)
    if (line.match(/<img\b/i)) {
      // Basic check to see if it looks like a commented line in JS, Astro, or HTML
      const trimmed = line.trim();
      const isCommented = trimmed.startsWith('//') || 
                           trimmed.startsWith('/*') || 
                           trimmed.startsWith('<!--') ||
                           trimmed.startsWith('*');

      if (!isCommented) {
        results.push({
          file: relativePath,
          lineNumber: index + 1,
          lineContent: trimmed
        });
        totalMatches++;
      }
    }
  });
}

// Print Report
console.log('================ UNOPTIMIZED IMAGES REPORT ================');
console.log(`Total Files Checked: ${sourceFiles.length}`);
console.log(`Total <img> Tags Found: ${totalMatches}`);
console.log('-----------------------------------------------------------');

if (results.length > 0) {
  // Group results by file for cleaner display
  const grouped = results.reduce((acc, curr) => {
    if (!acc[curr.file]) acc[curr.file] = [];
    acc[curr.file].push(curr);
    return acc;
  }, {});

  for (const [file, matches] of Object.entries(grouped)) {
    console.log(`\n📂 File: ${file} (${matches.length} matches)`);
    matches.forEach(m => {
      console.log(`  Line ${m.lineNumber}: ${m.lineContent}`);
    });
  }
} else {
  console.log('\n🎉 Congratulations! No raw <img> tags found under src/!');
}
console.log('===========================================================\n');

import fs from 'node:fs';
import path from 'node:path';

// Directories to scan
const DIRS_TO_SCAN = [
  path.join(process.cwd(), 'src'),
  path.join(process.cwd(), 'public')
];

// File extensions to scan
const FILE_EXTENSIONS = ['.astro', '.tsx', '.ts', '.jsx', '.js', '.json', '.css'];

// Image extensions
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.svg', '.gif'];

// Third-party domains known to host assets
const THIRD_PARTY_ASSET_DOMAINS = [
  'cdn.prod.website-files.com',
  'images.unsplash.com'
];

// Domains/URLs to ignore (e.g. social links, schema schemas, w3 namespaces, local domains)
const IGNORED_DOMAINS = [
  'schema.org',
  'w3.org',
  'go2rinjani.com',
  'localhost',
  'wa.me',
  'instagram.com',
  'facebook.com',
  'twitter.com',
  'youtube.com',
  'google.com'
];

// Helper to recursively get files
function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, fileList);
    } else {
      const ext = path.extname(file);
      if (FILE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

// Check if a URL points to a third-party asset
function analyzeUrl(urlString) {
  try {
    // Basic regex check to verify if it looks like a URL
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      return null;
    }

    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();
    
    // Ignore designated domains
    if (IGNORED_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain))) {
      return null;
    }

    // Check if it's an image by path extension
    const pathnameWithoutQuery = url.pathname.split('?')[0].toLowerCase();
    const hasImageExt = IMAGE_EXTENSIONS.some(ext => pathnameWithoutQuery.endsWith(ext));
    
    // Check if it's a known third-party asset domain
    const isKnownAssetDomain = THIRD_PARTY_ASSET_DOMAINS.some(domain => hostname === domain || hostname.endsWith('.' + domain));

    if (hasImageExt || isKnownAssetDomain) {
      return {
        url: urlString,
        hostname,
        type: hasImageExt ? 'Image Asset' : 'Third-Party Asset Domain'
      };
    }

    // If it's some other external URL, classify as 'External Data/Link'
    return {
      url: urlString,
      hostname,
      type: 'External Data/Link'
    };
  } catch (e) {
    return null;
  }
}

// Gather all files to scan
let allFiles = [];
for (const scanDir of DIRS_TO_SCAN) {
  allFiles = getFiles(scanDir, allFiles);
}

console.log(`🔍 Scanning ${allFiles.length} files in /src and /public directories...\n`);

const imageAssets = [];
const otherAssets = [];

// Regular expression to find URLs
const URL_REGEX = /https?:\/\/[^\s"'`<>]+/g;

for (const file of allFiles) {
  const relativePath = path.relative(process.cwd(), file);
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Basic check to skip comments where possible (optional)
    const trimmed = line.trim();
    const isComment = trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('<!--');
    if (isComment && !relativePath.endsWith('.json')) return;

    let match;
    while ((match = URL_REGEX.exec(line)) !== null) {
      const cleanUrl = match[0].replace(/[),.;"'}]+$/, ''); // clean trailing characters
      const analysis = analyzeUrl(cleanUrl);

      if (analysis) {
        const item = {
          file: relativePath,
          lineNumber: index + 1,
          url: cleanUrl,
          hostname: analysis.hostname,
          lineContent: trimmed
        };

        if (analysis.type === 'Image Asset' || analysis.hostname === 'images.unsplash.com' || analysis.hostname === 'cdn.prod.website-files.com') {
          imageAssets.push(item);
        } else {
          otherAssets.push(item);
        }
      }
    }
  });
}

// Helper to print grouped results
function printGroupedResults(title, list) {
  console.log(`\n================ ${title} (${list.length} items) ================`);
  if (list.length === 0) {
    console.log('🎉 None found!');
    return;
  }

  // Group by domain first, then file
  const groupedByDomain = {};
  list.forEach(item => {
    if (!groupedByDomain[item.hostname]) {
      groupedByDomain[item.hostname] = [];
    }
    groupedByDomain[item.hostname].push(item);
  });

  for (const [domain, items] of Object.entries(groupedByDomain)) {
    console.log(`\n🌐 Domain: ${domain} (${items.length} occurrences)`);
    
    // Group occurrences by file for cleaner reporting
    const filesMap = {};
    items.forEach(item => {
      if (!filesMap[item.file]) filesMap[item.file] = [];
      filesMap[item.file].push(item);
    });

    for (const [file, occurrences] of Object.entries(filesMap)) {
      console.log(`  📂 File: ${file}`);
      occurrences.forEach(occ => {
        console.log(`    Line ${occ.lineNumber}: ${occ.url}`);
      });
    }
  }
}

// Print reports
printGroupedResults('THIRD-PARTY IMAGE ASSETS', imageAssets);
printGroupedResults('OTHER THIRD-PARTY LINKS/DATA', otherAssets);

console.log('\n================ SUMMARY ================');
console.log(`Total Files Checked: ${allFiles.length}`);
console.log(`Third-Party Image Assets Found: ${imageAssets.length}`);
console.log(`Other Third-Party Links Found: ${otherAssets.length}`);
console.log('=========================================\n');

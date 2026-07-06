import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

const DIST_DIR = path.join(process.cwd(), 'dist', 'client');

// Fallback to 'dist' if 'dist/client' doesn't exist (depends on adapter)
const targetDir = fs.existsSync(DIST_DIR) ? DIST_DIR : path.join(process.cwd(), 'dist');

if (!fs.existsSync(targetDir)) {
  console.error(`Error: The directory ${targetDir} does not exist.`);
  console.error('Please run "npm run build" before running this script.');
  process.exit(1);
}

// Function to recursively find all .html files
function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const htmlFiles = getHtmlFiles(targetDir);
console.log(`Found ${htmlFiles.length} HTML files to analyze...`);

const report = {
  totalChecked: htmlFiles.length,
  missingTitle: [],
  defaultTitle: [],
  missingDescription: [],
  missingKeywords: [],
  missingSchema: [],
  invalidSchema: [],
};

for (const file of htmlFiles) {
  const relativePath = path.relative(targetDir, file);
  const content = fs.readFileSync(file, 'utf-8');
  const $ = cheerio.load(content);

  const robots = $('meta[name="robots"]').attr('content');
  if (robots && robots.includes('noindex')) {
    report.totalChecked--;
    continue; // Skip pages that are not indexed (like redirects and 404s)
  }

  // Check Title
  const title = $('title').text().trim();
  if (!title) {
    report.missingTitle.push(relativePath);
  } else if (title === 'Go2Rinjani' || title === 'Go2Rinjani - Trekking to Mount Rinjani') {
    report.defaultTitle.push(relativePath);
  }

  // Check Description
  const description = $('meta[name="description"]').attr('content');
  if (!description || description.trim() === '') {
    report.missingDescription.push(relativePath);
  }

  // Check Schema
  const schemas = $('script[type="application/ld+json"]');
  if (schemas.length === 0) {
    report.missingSchema.push(relativePath);
  } else {
    schemas.each((i, el) => {
      const jsonStr = $(el).html();
      try {
        JSON.parse(jsonStr);
      } catch (err) {
        if (!report.invalidSchema.includes(relativePath)) {
          report.invalidSchema.push(relativePath);
        }
      }
    });
  }
}

// Print Report
console.log('\n================ SEO AUDIT REPORT ================');
console.log(`Total Pages Analyzed: ${report.totalChecked}`);
console.log('--------------------------------------------------');

if (report.missingTitle.length > 0) {
  console.log(`\n❌ Missing Title (${report.missingTitle.length}):`);
  report.missingTitle.forEach(p => console.log(`  - ${p}`));
} else {
  console.log('\n✅ All pages have a Title.');
}

if (report.defaultTitle.length > 0) {
  console.log(`\n⚠️ Default Title (Go2Rinjani) (${report.defaultTitle.length}):`);
  report.defaultTitle.slice(0, 10).forEach(p => console.log(`  - ${p}`));
  if (report.defaultTitle.length > 10) console.log(`  ... and ${report.defaultTitle.length - 10} more`);
}

if (report.missingDescription.length > 0) {
  console.log(`\n❌ Missing Description (${report.missingDescription.length}):`);
  report.missingDescription.forEach(p => console.log(`  - ${p}`));
} else {
  console.log('\n✅ All pages have a Description.');
}


if (report.missingSchema.length > 0) {
  console.log(`\n❌ Missing JSON-LD Schema (${report.missingSchema.length}):`);
  report.missingSchema.forEach(p => console.log(`  - ${p}`));
} else {
  console.log('\n✅ All pages have at least one JSON-LD Schema.');
}

if (report.invalidSchema.length > 0) {
  console.log(`\n❌ Invalid JSON-LD Schema Format (${report.invalidSchema.length}):`);
  report.invalidSchema.forEach(p => console.log(`  - ${p}`));
}

console.log('==================================================\n');

// Also write report to a JSON file for deeper inspection
const reportPath = path.join(process.cwd(), 'seo-audit-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`Detailed report saved to: ${reportPath}`);

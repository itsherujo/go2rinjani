import fs from 'fs';
import path from 'path';

function stripCommentsFromHtml(dir) {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️ Directory ${dir} does not exist. Skipping comment stripping.`);
    return;
  }
  
  // Use Node's native recursive readdir (available in Node 20+)
  const files = fs.readdirSync(dir, { recursive: true });
  let count = 0;
  
  for (const file of files) {
    if (typeof file === 'string' && file.endsWith('.html')) {
      const filePath = path.join(dir, file);
      
      // Safety check just in case readdir returns a directory named .html
      if (fs.statSync(filePath).isDirectory()) continue;
      
      let html = fs.readFileSync(filePath, 'utf-8');
      
      // Remove all HTML comments EXCEPT those starting with "astro:" 
      // This ensures your React islands don't break.
      html = html.replace(/<!--(?!\s*astro:)([\s\S]*?)-->/g, '');
      
      fs.writeFileSync(filePath, html);
      count++;
    }
  }
  
  console.log(`✅ Successfully stripped AI comments from ${count} HTML files.`);
}

// Astro's cloudflare adapter outputs static files to dist/client
stripCommentsFromHtml('dist');

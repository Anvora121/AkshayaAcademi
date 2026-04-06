import fs from 'fs';
import https from 'https';

const WIKI_USER_AGENT = 'AkshayaAcademi/1.0 (mugi@example.com)';

function fetchWikiImage(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&imlimit=50&format=json`;
    https.get(url, { headers: { 'User-Agent': WIKI_USER_AGENT } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (!pages) return resolve(null);
          const pageId = Object.keys(pages)[0];
          const images = pages[pageId]?.images || [];
          
          const candidates = images
            .map(img => img.title)
            .filter(t => t.toLowerCase().endsWith('.jpg') || t.toLowerCase().endsWith('.jpeg') || t.toLowerCase().endsWith('.png'))
            .filter(t => !t.toLowerCase().includes('logo') && !t.toLowerCase().includes('map') && !t.toLowerCase().includes('seal') && !t.toLowerCase().includes('flag') && !t.toLowerCase().includes('emblem'));
            
          if (candidates.length === 0) return resolve(null);
          
          const imgTitle = candidates[0];
          const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imgTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
          
          https.get(imgUrl, { headers: { 'User-Agent': WIKI_USER_AGENT } }, (res2) => {
            let data2 = '';
            res2.on('data', chunk => data2 += chunk);
            res2.on('end', () => {
              try {
                 const j2 = JSON.parse(data2);
                 const p2 = j2.query?.pages;
                 const pid2 = Object.keys(p2)[0];
                 const info = p2[pid2]?.imageinfo?.[0];
                 resolve(info?.thumburl || info?.url || null);
              } catch(e) { resolve(null); }
            });
          }).on('error', () => resolve(null));
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  console.log(`\nProcessing ${filePath}...`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find all universities blocks. We'll look for: name: "...", and nearby image: "..."
  const nameRegex = /name:\s*["']([^"']+)["']/g;
  let match;
  const updates = [];
  
  while ((match = nameRegex.exec(content)) !== null) {
      const name = match[1];
      // Find the next occurrence of image: "..." after this name
      const imgRegex = /image:\s*["']([^"']+)["']/g;
      imgRegex.lastIndex = match.index; // Start searching from the name index
      const imgMatch = imgRegex.exec(content);
      
      if (imgMatch) {
          // Verify we aren't picking an image from another university (ensure it's close by)
          if (imgMatch.index - match.index < 500) {
             updates.push({
                 name,
                 imgIndex: imgMatch.index,
                 fullMatch: imgMatch[0],
                 innerUrl: imgMatch[1]
             });
          }
      }
  }
  
  console.log(`Found ${updates.length} universities in ${filePath}`);
  
  let newContent = content;
  
  for (let i = 0; i < updates.length; i++) {
     const up = updates[i];
     console.log(`[${i+1}/${updates.length}] Fetching image for: ${up.name}`);
     const newImageUrl = await fetchWikiImage(up.name);
     
     if (newImageUrl) {
        // Replace in newContent
        // Note: we can't just use indices directly if we mutate, so we replace using the unique matched string or do standard string replace
        // Better: replace the exact previous image string with the new one. Assuming URLs are somewhat unique, or we slice
        
        console.log(`   -> Found: ${newImageUrl}`);
        up.newUrl = newImageUrl;
     } else {
        console.log(`   -> No good image found. Skipping.`);
     }
     await delay(300); // polite delay
  }
  
  // Apply updates from bottom to top to preserve indices!
  updates.sort((a, b) => b.imgIndex - a.imgIndex);
  for (const up of updates) {
      if (up.newUrl) {
          const replacement = `image: "${up.newUrl}"`;
          newContent = newContent.substring(0, up.imgIndex) + replacement + newContent.substring(up.imgIndex + up.fullMatch.length);
      }
  }
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Updated ${filePath}`);
}

async function main() {
   await processFile('src/data/universities.ts');
   await processFile('src/data/universitiesExtra.ts');
   console.log('\nAll done!');
}

main();

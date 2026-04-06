/**
 * updateLogos.js
 * Fetches real university logo image URLs from Wikipedia API and
 * updates the `logo: "..."` field in universities.ts and universitiesExtra.ts.
 *
 * Run: node updateLogos.js
 */

import fs from 'fs';
import https from 'https';

const WIKI_AGENT = 'AkshayaAcademi/1.0 (mugi@example.com)';
const delay = ms => new Promise(r => setTimeout(r, ms));

// ─── Wikipedia API helpers ────────────────────────────────────────────────────

/** Fetch JSON from any HTTPS URL, returns parsed object or null on error */
function fetchJson(url) {
  return new Promise(resolve => {
    https.get(url, { headers: { 'User-Agent': WIKI_AGENT } }, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

/**
 * Attempt to get a logo URL for a university by querying:
 * 1. Wikipedia pageimages (logo/thumbnail)
 * 2. Commons category search for SVG/PNG logos
 */
async function getLogoUrl(universityName) {
  // Strategy 1: Wikipedia pageimages API (often returns official seal/logo as thumbnail)
  const wikiSearchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(universityName)}&srlimit=1&format=json`;
  const searchResult = await fetchJson(wikiSearchUrl);
  const pageTitle = searchResult?.query?.search?.[0]?.title;

  if (pageTitle) {
    // Get the page's main image (logo/seal is typically set as the pageimage)
    const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&piprop=original&pilicense=any&format=json`;
    const imgResult = await fetchJson(imgUrl);
    const pages = imgResult?.query?.pages;
    if (pages) {
      const page = Object.values(pages)[0];
      const originalSrc = page?.original?.source;
      if (originalSrc) {
        // Only accept SVG or PNG (likely to be logos, not campus photos)
        const lower = originalSrc.toLowerCase();
        if (lower.includes('.svg') || lower.includes('.png')) {
          return originalSrc;
        }
      }
    }

    // Strategy 2: Get all images from the Wikipedia page, find the logo
    const allImgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=images&imlimit=50&format=json`;
    const allImgResult = await fetchJson(allImgUrl);
    const allPages = allImgResult?.query?.pages;
    if (allPages) {
      const allPage = Object.values(allPages)[0];
      const images = allPage?.images || [];
      // Prefer files that say "logo", "seal", or "crest" in the name (SVG or PNG)
      const logoFiles = images
        .map(i => i.title)
        .filter(t => {
          const lower = t.toLowerCase();
          return (lower.includes('.svg') || lower.includes('.png')) &&
            (lower.includes('logo') || lower.includes('seal') || lower.includes('crest') || lower.includes('coat'));
        });

      if (logoFiles.length > 0) {
        // Fetch the actual file URL from Commons
        const fileUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(logoFiles[0])}&prop=imageinfo&iiprop=url&format=json`;
        const fileResult = await fetchJson(fileUrl);
        const filePages = fileResult?.query?.pages;
        if (filePages) {
          const filePage = Object.values(filePages)[0];
          const src = filePage?.imageinfo?.[0]?.url;
          if (src) return src;
        }
      }
    }
  }

  return null;
}

// ─── File processing ──────────────────────────────────────────────────────────

/**
 * Finds all  logo: "VALUE"  patterns in a file and returns an array of
 * { name, logoIndex, fullMatch, currentValue } for each university block.
 * We pair up "name:" and the immediately following "logo:" within 800 chars.
 */
function extractLogoEntries(content) {
  const entries = [];
  const nameRegex = /name:\s*["']([^"']+)["']/g;
  let match;
  while ((match = nameRegex.exec(content)) !== null) {
    const name = match[1];
    const after = content.slice(match.index, match.index + 900);
    const logoMatch = /logo:\s*["']([^"']*?)["']/.exec(after);
    if (logoMatch) {
      const absoluteLogoIndex = match.index + logoMatch.index;
      entries.push({
        name,
        logoIndex: absoluteLogoIndex,
        fullMatch: logoMatch[0],
        currentValue: logoMatch[1],
      });
    }
  }
  return entries;
}

async function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌  File not found: ${filePath}`);
    return;
  }
  console.log(`\n📂  Processing ${filePath} …`);
  let content = fs.readFileSync(filePath, 'utf-8');
  const entries = extractLogoEntries(content);
  console.log(`   Found ${entries.length} university entries`);

  const updates = []; // { logoIndex, fullMatch, newValue }

  for (let i = 0; i < entries.length; i++) {
    const { name, logoIndex, fullMatch, currentValue } = entries[i];

    // Skip entries that already have a URL
    if (currentValue.startsWith('http')) {
      console.log(`   [${i + 1}/${entries.length}] ${name} — already has URL, skipping`);
      continue;
    }

    console.log(`   [${i + 1}/${entries.length}] Fetching logo for: ${name}`);
    const logoUrl = await getLogoUrl(name);

    if (logoUrl) {
      console.log(`      ✅  ${logoUrl.slice(0, 90)}…`);
      updates.push({ logoIndex, fullMatch, newUrl: logoUrl });
    } else {
      console.log(`      ⚠️   No logo found — keeping abbreviation`);
    }

    await delay(350); // polite rate-limiting
  }

  // Apply updates from bottom-to-top to preserve string indices
  updates.sort((a, b) => b.logoIndex - a.logoIndex);
  for (const { logoIndex, fullMatch, newUrl } of updates) {
    const replacement = `logo: "${newUrl}"`;
    content = content.slice(0, logoIndex) + replacement + content.slice(logoIndex + fullMatch.length);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`   💾  Saved ${updates.length} logo updates to ${filePath}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🎓  University Logo Updater — fetching from Wikipedia API\n');
  await processFile('src/data/universities.ts');
  await processFile('src/data/universitiesExtra.ts');
  console.log('\n✅  All done!');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

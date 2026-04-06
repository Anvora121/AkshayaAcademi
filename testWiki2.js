import https from 'https';

function fetchWikiImages(title) {
  return new Promise((resolve) => {
    // Get all images on the page
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&imlimit=50&format=json`;
    https.get(url, { headers: { 'User-Agent': 'AkshayaAcademi/1.0 (mugi@example.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', async () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (!pages) return resolve(null);
          const pageId = Object.keys(pages)[0];
          const images = pages[pageId]?.images || [];
          
          // Filter for likely photos (jpg/jpeg) and ignore typical icons/logos
          const candidates = images
            .map(img => img.title)
            .filter(t => t.toLowerCase().endsWith('.jpg') || t.toLowerCase().endsWith('.jpeg'))
            .filter(t => !t.toLowerCase().includes('logo') && !t.toLowerCase().includes('map') && !t.toLowerCase().includes('seal'));
            
          if (candidates.length === 0) return resolve(null);
          
          // Now fetch the actual URL for the first good candidate
          const imgTitle = candidates[0];
          const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(imgTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json`;
          
          https.get(imgUrl, { headers: { 'User-Agent': 'AkshayaAcademi/1.0' } }, (res2) => {
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
          });
          
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function test() {
  const img1 = await fetchWikiImages('Massachusetts Institute of Technology');
  console.log('MIT:', img1);
  const img2 = await fetchWikiImages('University of Oxford');
  console.log('Oxford:', img2);
}
test();

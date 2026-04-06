import https from 'https';

function fetchWikiImage(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1000`;
    https.get(url, { headers: { 'User-Agent': 'AkshayaAcademi/1.0 (mugi@example.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages;
          if (!pages) return resolve(null);
          const pageId = Object.keys(pages)[0];
          resolve(pages[pageId]?.thumbnail?.source || null);
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function test() {
  const img1 = await fetchWikiImage('Massachusetts Institute of Technology');
  console.log('MIT:', img1);
  const img2 = await fetchWikiImage('University of Oxford');
  console.log('Oxford:', img2);
}
test();

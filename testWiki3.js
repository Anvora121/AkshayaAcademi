import https from 'https';

const WIKI_USER_AGENT = 'AkshayaAcademi/1.0 (mugi@example.com)';

function fetchBetterWikiImage(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=images&imlimit=100&format=json`;
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
          
          let candidates = images
            .map(img => img.title)
            .filter(t => t.toLowerCase().endsWith('.jpg') || t.toLowerCase().endsWith('.jpeg'))
            .filter(t => !t.toLowerCase().includes('logo') && !t.toLowerCase().includes('map') && !t.toLowerCase().includes('seal') && !t.toLowerCase().includes('flag') && !t.toLowerCase().includes('emblem') && !t.toLowerCase().includes('coat_of_arms') && !t.toLowerCase().includes('shield'));
            
          // Prefer images with words like campus, building, library, hall, quad, university, college
          let bestCandidates = candidates.filter(t => 
             t.toLowerCase().includes('campus') || 
             t.toLowerCase().includes('building') || 
             t.toLowerCase().includes('library') || 
             t.toLowerCase().includes('hall') || 
             t.toLowerCase().includes('quad') || 
             t.toLowerCase().includes('university')
          );
          
          if (bestCandidates.length > 0) {
              candidates = bestCandidates;
          }
            
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

async function test() {
  console.log('MIT:', await fetchBetterWikiImage('Massachusetts Institute of Technology'));
  console.log('Stanford:', await fetchBetterWikiImage('Stanford University'));
  console.log('Harvard:', await fetchBetterWikiImage('Harvard University'));
}
test();

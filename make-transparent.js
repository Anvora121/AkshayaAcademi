const Jimp = require('jimp');

async function main() {
  console.log('Reading image...');
  const img = await Jimp.read('C:/Users/Mugi/.gemini/antigravity/brain/0c3a6c85-4e85-4dcc-8113-c8f44f93559a/akshaya_akademics_logo_1773381164410.png');

  console.log('Processing transparency...');
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, (x, y, idx) => {
    const r = img.bitmap.data[idx];
    const g = img.bitmap.data[idx + 1];
    const b = img.bitmap.data[idx + 2];

    // White or very near white
    if (r > 240 && g > 240 && b > 240) {
      img.bitmap.data[idx + 3] = 0; // Set alpha to 0 completely transparent
    }
  });

  const outPath = 'C:/Mugi/Projects/Project-HE/AkshayaAcademi/public/logo-transparent.png';
  console.log('Writing to', outPath);
  await img.writeAsync(outPath);
  console.log('Done!');
}

main().catch(console.error);

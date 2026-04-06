import fs from 'fs';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Find lines with: logo: "url"garbage
  // We want to capture exactly what's inside the quotes, and ignore garbage after it until the comma (or end of line)
  // Example: logo: "https://...svg"pload.wikimedia...png", 
  // becomes: logo: "https://...svg",
  
  let fixed = content.replace(/logo:\s*"([^"]+)"[^,\n]*?,/g, 'logo: "$1",');
  
  if (content !== fixed) {
    fs.writeFileSync(filePath, fixed, 'utf8');
    console.log(`Fixed logos in ${filePath}`);
  } else {
    console.log(`No fixes needed in ${filePath}`);
  }
}

fixFile('src/data/universities.ts');
fixFile('src/data/universitiesExtra.ts');
console.log('Done!');

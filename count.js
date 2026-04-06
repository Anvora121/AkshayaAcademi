import fs from 'fs';

const content = fs.readFileSync('src/data/universities.ts', 'utf-8');
const matches = content.match(/country:\s*["']([^"']+)["']/g) || [];
const counts = {};
matches.forEach(m => {
  const c = m.match(/['"]([^'"]+)['"]/)[1];
  counts[c] = (counts[c] || 0) + 1;
});
console.log("universities.ts:", counts);

if (fs.existsSync('src/data/universitiesExtra.ts')) {
   const extra = fs.readFileSync('src/data/universitiesExtra.ts', 'utf-8');
   const extraMatches = extra.match(/country:\s*["']([^"']+)["']/g) || [];
   const extraCounts = {};
   extraMatches.forEach(m => {
     const c = m.match(/['"]([^'"]+)['"]/)[1];
     extraCounts[c] = (extraCounts[c] || 0) + 1;
   });
   console.log("universitiesExtra.ts:", extraCounts);
}

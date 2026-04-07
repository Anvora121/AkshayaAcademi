import fs from 'fs';

const content = fs.readFileSync('./src/data/universities.ts', 'utf-8');
const searchStr = 'const _rawUniversitiesData: RawUniversity[] = [';
const startIndex = content.indexOf(searchStr);

if (startIndex !== -1) {
    const arrayStart = startIndex + searchStr.length - 1; // start at '['
    let bracketCount = 0;
    let endIndex = -1;
    for (let i = arrayStart; i < content.length; i++) {
        if (content[i] === '[') bracketCount++;
        else if (content[i] === ']') {
            bracketCount--;
            if (bracketCount === 0) {
                endIndex = i + 1;
                break;
            }
        }
    }

    if (endIndex !== -1) {
        const rawArrayStr = content.substring(arrayStart, endIndex);
        fs.writeFileSync('./tmp_data_raw.js', `const data = ${rawArrayStr}; console.log(JSON.stringify(data, null, 2));`);
        console.log('Successfully wrote tmp_data_raw.js');
    } else {
        console.error('Balanced brackets not found');
    }
} else {
    console.error('Data variable not found');
}

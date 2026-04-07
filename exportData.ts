import { universitiesData } from './src/data/universities';
import fs from 'fs';

try {
    fs.writeFileSync('./tmp_universities.json', JSON.stringify(universitiesData, null, 2));
    console.log('Successfully exported university data to tmp_universities.json');
    process.exit(0);
} catch (err) {
    console.error('Failed to export data:', err);
    process.exit(1);
}

import fs from 'fs/promises';
import path from 'path';

const FILE_PATH = path.join(process.cwd(), 'data', 'pitches.json');

async function getPitches() {
  const data = await fs.readFile(FILE_PATH, 'utf-8');
  return JSON.parse(data);
}

export default { getPitches };
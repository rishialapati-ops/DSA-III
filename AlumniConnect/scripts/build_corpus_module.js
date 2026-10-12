import fs from 'fs';
import path from 'path';

const dataDir = path.resolve('data');
const outputFile = path.resolve('src/kmp/corpusData.ts');

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.txt')).sort();

const docs = [];

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const rawContent = fs.readFileSync(filePath, 'utf8');
  
  const id = path.basename(file, '.txt');
  let alumniId = '';
  let name = '';
  let department = '';
  let graduationYear = 2020;
  let currentRole = '';
  let company = '';
  let skills = [];

  const lines = rawContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('Alumni ID:')) {
      alumniId = line.substring('Alumni ID:'.length).trim();
    } else if (line.startsWith('Name:')) {
      name = line.substring('Name:'.length).trim();
    } else if (line.startsWith('Department:')) {
      department = line.substring('Department:'.length).trim();
    } else if (line.startsWith('Graduation Year:')) {
      graduationYear = parseInt(line.substring('Graduation Year:'.length).trim(), 10) || 2020;
    } else if (line.startsWith('Current Role:')) {
      currentRole = line.substring('Current Role:'.length).trim();
    } else if (line.startsWith('Company:')) {
      company = line.substring('Company:'.length).trim();
    } else if (line.startsWith('Skills:')) {
      const skillsLine = lines[i + 1] ? lines[i + 1].trim() : '';
      skills = skillsLine.replace(/\.$/, '').split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  docs.push({
    id,
    filename: file,
    alumniId: alumniId || id.toUpperCase(),
    name: name || `Alumni ${id}`,
    department: department || 'Computer Science',
    graduationYear,
    currentRole: currentRole || 'Software Engineer',
    company: company || 'Tech Corporation',
    skills,
    rawContent
  });
}

const fileHeader = `/**
 * Pre-compiled corpus dataset loaded directly from the mandatory 100 individual files in /data.
 * Total files indexed: ${docs.length}
 */
import { AlumniDocument } from './types';

export const ALUMNI_CORPUS: AlumniDocument[] = ${JSON.stringify(docs, null, 2)};
`;

fs.writeFileSync(outputFile, fileHeader, 'utf8');
console.log(`Successfully generated ${outputFile} with ${docs.length} documents.`);

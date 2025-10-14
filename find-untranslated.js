/**
 * Script to find untranslated Arabic text in JSX files
 * Run: node find-untranslated.cjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Arabic text pattern (any Arabic characters)
const arabicPattern = /[\u0600-\u06FF]+/g;

// Directories to scan
const dirsToScan = [
  './src/pages',
  './src/components'
];

// Files to skip
const skipFiles = [
  'node_modules',
  '.git',
  'dist',
  'build'
];

function findArabicText(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const matches = [];

  lines.forEach((line, index) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
      return;
    }

    // Find Arabic text
    const arabicMatches = line.match(arabicPattern);
    if (arabicMatches) {
      // Check if it's already using t() or getLocalizedValue()
      if (!line.includes('t(') && !line.includes('getLocalizedValue')) {
        matches.push({
          line: index + 1,
          text: line.trim(),
          arabic: arabicMatches.join(' ')
        });
      }
    }
  });

  return matches;
}

function scanDirectory(dir) {
  const results = {};
  
  function scan(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      // Skip certain directories
      if (skipFiles.some(skip => filePath.includes(skip))) {
        return;
      }
      
      if (stat.isDirectory()) {
        scan(filePath);
      } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
        const matches = findArabicText(filePath);
        if (matches.length > 0) {
          results[filePath] = matches;
        }
      }
    });
  }
  
  scan(dir);
  return results;
}

// Main execution
console.log('🔍 Scanning for untranslated Arabic text...\n');

const allResults = {};

dirsToScan.forEach(dir => {
  if (fs.existsSync(dir)) {
    const results = scanDirectory(dir);
    Object.assign(allResults, results);
  }
});

// Print results
let totalFiles = 0;
let totalMatches = 0;

Object.keys(allResults).forEach(file => {
  const matches = allResults[file];
  totalFiles++;
  totalMatches += matches.length;
  
  console.log(`\n📄 ${file}`);
  console.log(`   Found ${matches.length} untranslated texts:\n`);
  
  matches.forEach(match => {
    console.log(`   Line ${match.line}: ${match.arabic}`);
    console.log(`   ${match.text.substring(0, 100)}${match.text.length > 100 ? '...' : ''}\n`);
  });
});

console.log(`\n📊 Summary:`);
console.log(`   Files with untranslated text: ${totalFiles}`);
console.log(`   Total untranslated texts: ${totalMatches}`);
console.log(`\n✅ Scan complete!`);

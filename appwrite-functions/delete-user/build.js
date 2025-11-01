import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Building Appwrite Function...');

const tempDir = 'temp-build';
const outputFile = 'delete-user-function.tar.gz';

// Clean temp directory
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}
fs.mkdirSync(tempDir);

// Copy files
console.log('📦 Copying files...');
const filesToCopy = [
  { src: 'src', dest: path.join(tempDir, 'src'), isDir: true },
  { src: 'package.json', dest: path.join(tempDir, 'package.json'), isDir: false }
];

filesToCopy.forEach(({ src, dest, isDir }) => {
  if (fs.existsSync(src)) {
    if (isDir) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
});

// Create tar.gz
console.log('🗜️ Creating tar.gz...');
try {
  process.chdir(tempDir);
  execSync(`tar -czf ../${outputFile} *`, { stdio: 'inherit' });
  process.chdir('..');
} catch (error) {
  console.error('❌ Error creating tar.gz:', error.message);
  process.exit(1);
}

// Cleanup
fs.rmSync(tempDir, { recursive: true, force: true });

console.log('✅ Build complete:', outputFile);
console.log('');
console.log('📤 Next steps:');
console.log('1. Go to Appwrite Console → Functions');
console.log('2. Create new Function');
console.log('3. Upload:', outputFile);
console.log('4. Set Runtime: Node.js 18+');
console.log('5. Set Execute Access: Users');

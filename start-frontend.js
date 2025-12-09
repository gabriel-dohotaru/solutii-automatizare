import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const frontendDir = join(__dirname, 'frontend');

console.log('Starting frontend server from:', frontendDir);

const child = spawn('npm', ['run', 'dev'], {
  cwd: frontendDir,
  stdio: 'inherit'
});

child.on('error', (error) => {
  console.error('Failed to start frontend:', error);
});

child.on('close', (code) => {
  console.log(`Frontend server exited with code ${code}`);
});
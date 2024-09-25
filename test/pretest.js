const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const TAG = '[pretest]';
const fixtureRoot = path.join(__dirname, 'fixture');
const caches = ['app.asar', 'node_module', 'out'];

console.log(TAG, 'remove caches', caches);
for (const name of caches) {
  fs.rmSync(path.join(fixtureRoot, name), { recursive: true, force: true });
}

console.log(TAG, 'yarn install');
cp.spawnSync('yarn', ['install'], { cwd: fixtureRoot, stdio: 'inherit' });

console.log(TAG, 'yarn package');
cp.spawnSync('yarn', ['package'], { cwd: fixtureRoot, stdio: 'inherit' });

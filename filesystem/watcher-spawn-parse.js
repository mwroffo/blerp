'use strict';

const fs = require('fs');
const spawn = require('child_process').spawn;

const filename = process.argv[2];
if (!filename) {
    throw Error('Usage: node watcher-spawn.js <filename>');
}

fs.watch(filename, () => {
    const ls = spawn('ls', ['-lSh']);
    let output = '';

    ls.stdout.on('data', chunk => output += chunk);

    ls.on('close', () => {
        const parts = output.split(/\s+/); // regexp
        console.log(parts[0], parts[4], parts[8]);
    });
});

console.log(`Listening for changes to ${filename}`);
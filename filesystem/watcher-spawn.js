'use strict';

const fs = require('fs');
const spawn = require('child_process').spawn;

const filename = process.argv[2];
if (!filename) {
    throw Error('Usage: node watcher-spawn.js <filename>');
}

fs.watch(filename, () => {
    const ls = spawn('ls', ['-lSh']);
    ls.stdout.pipe(process.stdout);
});
console.log(`Listening for changes to ${filename}`);
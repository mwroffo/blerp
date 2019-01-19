'use strict';
const fs = require('fs');
const filename = process.argv[2];
if (!filename) {
    throw Error("usage: watcher.js <file_to_watch>");
}

fs.watch(filename, () => console.log(`The file ${filename} changed!`));
console.log(`Now watching file ${filename} for changes...`);
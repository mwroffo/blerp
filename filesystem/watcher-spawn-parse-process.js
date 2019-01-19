'use strict';

const fs = require('fs');
const spawn = require('child_process').spawn;
const cmd = process.argv[2];
const args = process.argv.slice(3, process.argv.length);
const child = spawn(cmd, args);
child.stdout.pipe(process.stdout);

// Or you could... (more verbose but more demonstrative of Node.js features):
let output = '';
let errors = '';
child.stdout.on('data', chunk => process.stdout.write(chunk));
// Hmm... no errors print for an improper bash cmd such as 'ls -derp'
child.stderr.on('error', chunk => process.stdout.write(chunk));
// child.on('close', () => console.log(output, errors));
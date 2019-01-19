'use strict';
const fs = require('fs');
const net = require('net');
const filename = process.argv[2];

if (!filename) {
    throw Error(`usage: ${process.argv[1]} <filename>`);
}

net.createServer(connection => {
    console.log('client connected.'); // tell the server about the connection
    // tell the client about the connection
    connection.write(`now watching "${filename}" for changes...\n`);

    // fs.watch returns a fs.FSWatcher object
    const watcher = // when the file changes... notify the client
        fs.watch(filename, () => connection.write(`File changed: ${new Date()}\n`));

    connection.on('close', () => { // socket emits a close event... is that like EOF?
        console.log(`client disconnected`);
        watcher.close(); // stop watching (and presumably deallocate `watcher`)...?
    });
}).listen('/tmp/watcher.sock', () => console.log(`Server trinity is listening for clients...`));
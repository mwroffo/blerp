'use strict';
const fs = require('fs');
const zmq = require('zeromq');
const filename = process.argv[2];
const pub = zmq.socket('pub');

// can we report client connection to console somehow?
fs.watch(filename, () => {
    pub.send(JSON.stringify({ // writes to all connected clients
        type: 'changed',
        file: filename,
        timestamp: Date.now()
    }));
});

pub.bind('tcp://*:60400', err => {
    if (err) {
        throw err;
    }
    console.log('Listening on port 60400...');
});
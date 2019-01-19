'use strict';
const zmq = require('zeromq');
const filename = process.argv[2];
if (!filename) { // i think this returns false if filename !== undefined?
    console.log("usage: node zmq-filter-req.js <filename>");
    process.exit();
}

const requester = zmq.socket('req');

requester.on('message', data => {
    const response = JSON.parse(data);
    console.log('Received response: ', response);
});

requester.connect('tcp://localhost:60401');

console.log(`Sending a request for ${filename}`);
requester.send(JSON.stringify({path: filename}));
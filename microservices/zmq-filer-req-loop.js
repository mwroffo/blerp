'use strict';
const zmq = require('zeromq');
const filename = process.argv[2];
if (!filename) {
    console.log("usage: node zmq-filter-req.js <filename>");
    process.exit();
}

const requester = zmq.socket('req');

requester.on('message', data => {
    const response = JSON.parse(data);
    console.log('Received response: ', response);
});

requester.connect('tcp://localhost:60401');

for (let i=0; i<5; i++) {
    console.log(`Sending request ${i+1} for ${filename}`);
    requester.send(JSON.stringify({ path: filename }));
}
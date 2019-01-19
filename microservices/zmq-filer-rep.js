'use strict';
const fs = require('fs');
const zmq = require('zeromq');

const responder = zmq.socket('rep');

responder.on('message', data => {
    const request = JSON.parse(data);
    console.log(`Received request to get ${request.path}`);

    fs.readFile(request.path, (err, content) => {
        if (err) {
            responder.send(JSON.stringify({
                content: err.toString(),
                timestamp: Date.now(),
                pid: process.pid
            }));
            // send sigint to the subscriber?
            process.exit();
        }
        console.log('Sending response content');
        responder.send(JSON.stringify({
            content: content.toString(),
            timestamp: Date.now(),
            pid: process.pid
        }));
    });
});

responder.bind('tcp://127.0.0.1:60401', err => {
    console.log('Listening for zmq requester...');
});

const exitHandler = () => {
    console.log('Shutting down...');
    responder.close(); // make sure the responder closes when node does.
}
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
process.on('uncaughtException', err => {throw err;});
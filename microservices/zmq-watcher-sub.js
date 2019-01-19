'use strict';
const zmq = require('zeromq');
// define the socket
const subscriber = zmq.socket('sub');

// zmq subscriber sockets have a built-in filter apparently,
// so we define what message it will listen for:
subscriber.subscribe('');
// the empty string filters nothing such that this subscriber
// will receive all messages.

// define the message receipt behavior:
subscriber.on('message', data => {
    const message = JSON.parse(data);
    const date = new Date(message.timestamp);
    console.log(`File ${message.file} ${message.type} at ${date}`);
});

// connect to the host localhost on port 60400
subscriber.connect("tcp://localhost:60400");
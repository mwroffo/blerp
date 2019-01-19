// receieve JSON data from server, make it plain text, and print to console

'use strict';
const fs = require('fs');
const net = require('net');
// use the net object to connect this host to port 60300
// why doesn't this specify the server's internet address?
const client = net.connect({port: 60300}); // client is a Socket.

// when the server gets a conn, and createServer invokes its callback,
// it uses conn.write(data). Here we define how to handle that data.
client.on('data', data => { // data is Buffer type, NOT String. We don't send `String`s over net.
    const msg = JSON.parse(data); // converting that string data back to JSON object is apparently this easy
    if (msg.type === 'watching') {
        // watching type has a file field, we assume this.
        console.log(`Now watching: ${msg.file}`);
    } else if (msg.type === 'changed') {
        // convert to a Date object the timestamp field of the js object msg
        const date = new Date(msg.timestamp); // converts timestamp (an int repr of a date)
        console.log(`File changed: ${date}`); // to a print-friendly Date object.
    } else {
        console.log(`Unrecognized message type: ${message.type}`);
    }
}).on('end', () => { // but server can send other events to client besides data:
    console.log('server has disconnected!');
}).on('error', err => {
    console.log(`received ERROR ${err} from server.`);
});
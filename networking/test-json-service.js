'use strict';
const server = require('net').createServer(connection => {
    console.log('Client connected.');

    const firstChunk = '{"type":"changed","timesta';
    const secondChunk = 'mp":1450694370094}\n';

    connection.write(firstChunk);

    const timer = setTimeout(() => {
        connection.write(secondChunk);
        // in this server we know when to sever the connection, 
        // the other server just waits infinitely with fs.watch
        connection.end(); // sends the 'end' event to the client, i presume
    }, 100);// do the callback after 100 seconds

    connection.on('end', () => {
        clearTimeout(timer); // unschedule the callback,
                        // (in case the client disconnects before receiving the second chunk?)
                        // otherwise its standard memory cleanup, I think.
        console.log('Client disconnected.');
    });
});

server.listen(60300, () => console.log('Test server listening...'));
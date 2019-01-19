// extends event emitter to aggregate 'data' events into a single 
// 'message' event to be handled by the client
// the top-level client "require"s this helper class.
'use strict';
const EventEmitter = require('events').EventEmitter;
class LDJClient extends EventEmitter {
    constructor(stream) {
        super();
        let buffer = ''; // accumulates msg data
        stream.on('data', data => {
            buffer += data;
            let boundary = buffer.indexOf('\n');
            while (boundary !== -1) {
                // while newline isn't in buffer
                // ie we haven't accumulated a complete msg
                const input = buffer.substring(0, boundary); // extract the msg
                buffer = buffer.substring(boundary + 1); // shrink buf to buf-msg
                // emit the JS object denoted by `input` as a 'message' event
                this.emit('message', JSON.parse(input));
                boundary = buffer.indexOf('\n'); // advance the boundary, then loop again
            }
        });
    }
    static connect(stream) { // helper constructor
        return new LDJClient(stream);
    }
}
module.exports = LDJClient; // make this class available via require('ldj-client.js');
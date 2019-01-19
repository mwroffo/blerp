'use strict';
const zmq = require('zeromq');
const pusher = zmq.socket('push');
const ALPHA = 'tcp://127.0.0.1:60403'; // distribute jobs
const OMEGA = 'tcp://127.0.0.1:60404'; // backchannel
pusher.bind(ALPHA);

for (let i=0; i<30; i++) {
    pusher.send(JSON.stringify({
        jobNum: `${i+1}`
    }));
}

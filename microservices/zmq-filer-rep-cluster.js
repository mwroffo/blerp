'use strict';
const cluster = require('cluster');
const fs = require('fs');
const zmq = require('zeromq');
const IN = 'tcp://127.0.0.1:60401';
const OUT = 'tcp://127.0.0.1:60402';

// ACCORDING to the node docs, cluster requires ipc
// but ipc does not seem to be connecting here.

const numWorkers = require('os').cpus().length;

if (cluster.isMaster) {
    const router = zmq.socket('router').bind(IN);
    const dealer = zmq.socket('dealer').bind(OUT);
    router.on('message', (...frames) => dealer.send(frames));
    dealer.on('message', (...frames) => router.send(frames));

    cluster.on('online', 
                worker => console.log(`Worker ${worker.process.pid} is online.`))
            .on('exit', (worker, code, signal) => {
                console.log(`${worker.process.pid} died. Restarting...`);
                cluster.fork();
    });
    for (let i = 0; i < numWorkers; i++) {
        cluster.fork();
    }
} else {
    const responder = zmq.socket('rep').connect(OUT);
    responder.on('message', data => {
        const request = JSON.parse(data);
        console.log(`${process.pid} received request for: ${request.path}`);

        fs.readFile(request.path, (err, content) => {
            console.log(`${process.pid} sending response`);
            responder.send(JSON.stringify({
                content: content.toString(),
                timestamp: Date.now(),
                pid: process.pid
            }));
        });
    });
    const endHandler = () => {
        responder.close();
        process.exit();
    }
    process.on('SIGINT', endHandler);
    process.on('SIGTERM', endHandler);
}
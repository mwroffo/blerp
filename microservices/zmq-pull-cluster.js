// Bidirectional Messenging challenge at the end of Ch4:

'use strict';
const cluster = require('cluster');
const zmq = require('zeromq');
const numCPUs = require('os').cpus().length;
const ALPHA = 'tcp://127.0.0.1:60403'; // distribute jobs
const OMEGA = 'tcp://127.0.0.1:60404'; // backchannel

if (cluster.isMaster) {
    let numReadyWorkers = 0;

    const push_jobs = zmq.socket('push');
    push_jobs.bind(ALPHA, err => { // for pushing jobs
        if (err) {
            throw err;
        }
        console.log(`Master will send jobs to worker on ${ALPHA}`);
    });
    const pull_msgs = zmq.socket('pull'); // pull messages from workers
    pull_msgs.bind(OMEGA, err => {
        if (err) {
            throw err;
        }
        console.log(`Master is listening for msgs from workers on ${OMEGA}`);
    });
    pull_msgs.on('message', data => {
        const msg = JSON.parse(data.toString());
        if (msg.type === 'ready') {
            ++numReadyWorkers;
            console.log(`${numReadyWorkers} are ready.`);
            if (numReadyWorkers === 3) {
                for (let i = 0; i < 30; i++) {
                    const job = { // send job messages
                        type: 'job',
                        jobNum: i + 1
                    }
                    console.log(`sending job ${job.jobNum} on socket push_jobs`);
                    push_jobs.send(JSON.stringify(job));
                }
            }
        } else if (msg.type === 'result') {
            console.log(msg.memo);
        }
    });
    
    cluster.on('online', worker => {
        console.log(`worker ${worker.process.pid} is online`);
    }).on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        --numReadyWorkers;
        cluster.fork();
    });

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork(); // spin up workers
    }
} else {
    // workers can also report in over here, i believe
    const pull_jobs = zmq.socket('pull');
    pull_jobs.connect(ALPHA);
    // return data about this process:
    pull_jobs.on('message', data => { // listen for job msg
        const msg = JSON.parse(data.toString());
        if (msg.type === 'job') {
            push_reports.send(JSON.stringify({ // respond with result message
                type: 'result',
                memo: `job ${msg.jobNum} handled by process ${process.pid}`
            }));
        } else {
            console.log(`line 68 or so: pull_jobs received something besides a job message...`);
        }
    });

    const push_reports = zmq.socket('push');
    push_reports.connect(OMEGA);
    push_reports.send(JSON.stringify({
        type: 'ready'
    }));
}
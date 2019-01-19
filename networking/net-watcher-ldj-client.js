'use strict';
const netClient = require('net').connect({port: 60300}); // Socket object
const ldjClient = require('./lib/ldj-client.js').connect(netClient); // LDJClient object

ldjClient.on('message', msg => {
    if (msg.type === 'watching') {
        console.log(`Now watching: ${msg.file}`);
    } else if (msg.type === 'changed') {
        console.log(`File changed: ${new Date(msg.timestamp)}`);
    } else {
        throw Error(`Unrecognized msg type: ${msg.type}`);
    }
 });
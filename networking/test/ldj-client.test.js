'use strict';
const assert = require('assert');
const EventEmitter = require('events').EventEmitter;
const LDJClient = require('../lib/ldj-client.js');

describe('LDJClient', () => {
    let stream = null;
    let client = null;

    beforeEach(() => {
        stream = new EventEmitter();
        client = new LDJClient(stream);
    });

    it('should emit a message event from a single data event', done => {
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'bar'});
            done();
        });
        stream.emit('data', '{"foo":"bar"}\n');
    });

    it('should emit a message event from split data events', done => {
        client.on('message', message => {
            assert.deepEqual(message, {foo: 'bar'});
        });
        done();
        stream.emit('data', '{"foo":"b');
        // nextTick schedules a callback immediately after the previous line
        process.nextTick(() => stream.emit('data', 'ar"}\n'));
    });

    it('should finish within five seconds', done => {
        setTimeout(done, 4500); // call done after 4500ms
    }).timeout(5000);
});
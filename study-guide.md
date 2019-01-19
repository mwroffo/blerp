## 1 philosophy of Node.js
- Explain the statement "everything runs in parallel, except your code."
- What is an I/O bound program? What unique problems do they present? How does Node ease their development?

## 2 handling events with `EventEmitter`, `fs`, `child_process`es
1. Define "callback" in terms of events.
2. For what tasks should you block the event loop with a syncronous function?
3. Build from memory a client, a server, and a LDJClient class that receives `chunk`s and emits complete LDJ (Line-delimited JSON) `message`s to a client.

## 3 `net`working: client/server communication with Node.js builtins
- Using the `net` module, make a server say 'hello, world' to a client via TCP.
- From memory, code a skeleton of a Mocha test suite including resettable test objects with assertions for test cases. Consider edge cases.

## 4 'zeromq' smart sockets and messaging patterns
1. Explain the REQ/ROUTER/DEALER/REP pattern, and why it is useful.
2. Challege: implement it from memory. It's fine to use TCP instead of ICP (==icky).
3. Edge cases: what other events could REQ and REP be equipped to handle, besides 'message'?
4. Describe the first-joiner and limited-resource problems.
5. 
## 2
1. A callback is a function that executes in response to a particular event. A Node developer's primary job is to write the proper callbacks for the proper events.
2. If a certain subroutine's failure would doom the entire program, write that subroutine synchronously. (Ex. importing an essential module)
3. Did you remember to handle case where readFile has err?

## 4
3. REQ and REQ should both be prepared to handle 'SIGINT', 'SIGTERM', or 'uncaughtException'. If you are using any module functions that may throw errors, did you remember to handle them?
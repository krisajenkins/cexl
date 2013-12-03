/*global exports: true*/
"use strict";

var repl = require('repl');

repl.REPLServer.prototype.displayPrompt = function(preserveCursor) {};
repl.start({prompt: '', ignoreUndefined: true, terminal: false, useColors: false});

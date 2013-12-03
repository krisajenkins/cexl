/*global exports: true*/
"use strict";

var repl = require('repl');

var parse	= require('../build/reader').parser.parse;
var evaluate	= require('../src/evaluator').evaluate;
var make_root_environment = require('../src/types').make_root_environment;

// TODO We can't yet handle multiline inputs.
// Node passes the first line immediately when we press return.
repl.start({
    eval: function (command, context, filename, callback) {
	var parsed, result;

	try {
	    parsed = parse(command)[0];
	    result = evaluate(parsed, context.env);
	    callback(null, result);
	} catch (e) {
	    callback(null, e);
	}
    }
}).context.env = make_root_environment();

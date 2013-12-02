/*global exports: true*/
"use strict";

var assert = require('assert');

var Symbol = function (name) {
    this.type = "Symbol";
    this.name = name;
    return this;
};

Symbol.prototype.toString = function () {
    return this.name;
};

Symbol.prototype.equal = function (other) {
    return ((this.type === other.type) && (this.name === other.name));
};

exports.Symbol = Symbol;

var Lambda = function (signature, body, env) {
    this.type = "Lambda";
    this.signature = signature;
    this.body = body;
    this.env = env;
    return this;
};

exports.Lambda = Lambda;

var Environment = function () {
    this.type = "Environment";
    this.contents = {};
    return this;
};

Environment.prototype.set = function (symbol, value) {
    assert.ok(symbol instanceof Symbol, "First argument is not a Symbol!");
    this.contents[symbol.name] = value;
};

Environment.prototype.get = function (symbol) {
    assert.ok(symbol instanceof Symbol, "First argument is not a Symbol!");

    var value = this.contents[symbol.name];
    if (typeof value !== 'undefined') {
	return value;
    }

    if (typeof this.parent !== 'undefined') {
	return this.parent.get(symbol);
    }

    throw new Error("Symbol is not defined.");
};

Environment.prototype.extend = function () {
    var subenv = new Environment();
    subenv.parent = this;
    return subenv;
};

exports.Environment = Environment;

var make_root_environment = function () {
    var root = new Environment();

    root.set(new Symbol('nil'),		 new Symbol('nil'));
    root.set(new Symbol('true'),	 new Symbol('true'));
    root.set(new Symbol('false'),	 new Symbol('false'));

    root.set(new Symbol('+'), function () {
	var args = Array.prototype.slice.call(arguments, 0);
	return args.reduce(
	    function (previous_value, current_value){
		return previous_value + current_value;
	    },
	    0
	);
    });

    root.set(new Symbol('*'), function () {
	var args = Array.prototype.slice.call(arguments, 0);
	return args.reduce(
	    function (previous_value, current_value){
		return previous_value * current_value;
	    },
	    1
	);
    });

    return root;
};
exports.make_root_environment = make_root_environment;

// Q. How do you *reliably* tell if something is a JavaScript array?
// A. Ha, ha, ha, ha, ha! Are you kidding?
var is_array = function (object) {
    return Object.prototype.toString.call(object) === "[object Array]";
};
exports.is_array = is_array;

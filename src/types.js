/*global exports: true*/
"use strict";

var assert = require('assert');

// Q. How do you *reliably* tell if something is a JavaScript array?
// A. Ha, ha, ha, ha, ha! Are you kidding?
var is_list = function (object) {
	return Object.prototype.toString.call(object) === "[object Array]";
};
exports.is_list = is_list;

var first = function (list) {
	return list[0];
};
exports.first = first;

var second = function (list) {
	return list[1];
};
exports.second = second;

var rest = function (list) {
	return list.slice(1);
};
exports.rest = rest;

var Symbol = function (name) {
	this.name = name;
	return this;
};

Symbol.prototype.toString = function () {
	return "[Symbol { name: " + this.name + " }]";
};

Symbol.prototype.equal = function (other) {
	return (other instanceof Symbol && (this.name === other.name));
};

exports.Symbol = Symbol;

var Lambda = function (signature, body, env) {
	this.signature = signature;
	this.body = body;
	this.env = env;
	return this;
};

Lambda.prototype.toString = function () {
	return "[Lambda]";
};

exports.Lambda = Lambda;

var Environment = function () {
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

	throw new Error(symbol.toString() + " is not defined.");
};

Environment.prototype.extend = function () {
	var subenv = new Environment();
	subenv.parent = this;
	return subenv;
};

Environment.prototype.toString = function () {
	return "[Environment { contents: " + this.contents + " }]";
};

exports.Environment = Environment;

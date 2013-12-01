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

var Environment = function () {
    this.type = "Environment";
    this.contents = {};
    return this;
};

Environment.prototype.set = function (symbol, value) {
    assert.ok(symbol instanceof Symbol, "First argument is not a Symbol!");
    this[symbol.name] = value;
};

Environment.prototype.get = function (symbol) {
    assert.ok(symbol instanceof Symbol, "First argument is not a Symbol!");

    var value = this[symbol.name];
    assert.notEqual(typeof value, "undefined", "Symbol is not defined.");
    return value;
};

exports.Environment = Environment;

// Q. How do you *reliably* tell if something is a JavaScript array?
// A. Ha, ha, ha, ha, ha! Are you kidding?
var is_array = function (object) {
    return Object.prototype.toString.call(object) === "[object Array]";
};
exports.is_array = is_array;

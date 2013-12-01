/*global exports: true*/
"use strict";

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

// Q. How do you *reliably* tell if something is a JavaScript array?
// A. Ha, ha, ha, ha, ha! Are you kidding?
var is_array = function (object) {
    return Object.prototype.toString.call(object) === "[object Array]";
};
exports.is_array = is_array;

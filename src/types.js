/*global exports: true*/
"use strict";

var Symbol = function (name) {
    this.type = "Symbol";
    this.name = name;
    return this;
};

Symbol.prototype.equal = function (other) {
    return ((this.type === other.type) && (this.name === other.name));
};

exports.Symbol = Symbol;

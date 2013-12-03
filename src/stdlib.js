/*global exports: true*/
"use strict";

var deep_equal = require('deep-equal');

var Environment = require('./types').Environment;
var Symbol = require('./types').Symbol;

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

    root.set(new Symbol('first'), function (list) {
	return list[0];
    });

    root.set(new Symbol('rest'), function (list) {
	if (list.length === 1) {
	    return new Symbol("nil");
	}

	return list.slice(1);
    });

    root.set(new Symbol('cons'), function (item, list) {
	if (new Symbol("nil").equal(list)) {
	    return [item];
	}

	var new_list = list.slice(0);
	new_list.unshift(item);
	return new_list;
    });

    root.set(new Symbol('='), function equal (other) {
	var args = Array.prototype.slice.call(arguments, 0);
	if (args.length <= 1) {
	    return new Symbol("true");
	}
	if (!deep_equal(args[0], args[1])) {
	    return new Symbol("false");
	}

	return equal(args.slice(0));
    });

    return root;
};
exports.make_root_environment = make_root_environment;

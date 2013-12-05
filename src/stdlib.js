/*global exports: true*/
"use strict";

var deep_equal = require('deep-equal');

var types		= require('./types');
var Environment = types.Environment;
var Symbol		= types.Symbol;
var first		= types.first;
var second		= types.second;
var rest		= types.rest;

var make_root_environment = function () {
	var root = new Environment();

	root.set(new Symbol('nil'),		 new Symbol('nil'));
	root.set(new Symbol('true'),	 new Symbol('true'));
	root.set(new Symbol('false'),	 new Symbol('false'));

	root.set(new Symbol('+'), function () {
		var i,
			total = 0;

		for (i = 0; i < arguments.length; i++) {
			total += arguments[i];
		}

		return total;
	});

	root.set(new Symbol('*'), function () {
		var i,
			total = 1;

		for (i = 0; i < arguments.length; i++) {
			total *= arguments[i];
		}

		return total;
	});

	root.set(new Symbol('first'), function (list) {
		return first(list);
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
		if (!deep_equal(first(args), second(args))) {
			return new Symbol("false");
		}

		return equal(rest(args));
	});

	return root;
};
exports.make_root_environment = make_root_environment;

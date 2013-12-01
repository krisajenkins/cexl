/*global describe: true, it: true */
"use strict";

var assert	= require('assert');
var parse	= require('../build/reader').parser.parse;
var evaluate	= require('../src/evaluator').evaluate;

var Symbol	= require('../src/types').Symbol;
var Environment = require('../src/types').Environment;

describe('self-evaluating', function () {
    it('Evaluates numbers', function () {
	assert.deepEqual(evaluate(5, undefined), 5);
	assert.deepEqual(evaluate(-9, undefined), -9);
    });
    it('Evaluates strings', function () {
	assert.deepEqual(evaluate("test", undefined), "test");
    });
    it('Evaluates booleans', function () {
	assert.deepEqual(evaluate(true, undefined), true);
	assert.deepEqual(evaluate(false, undefined), false);
    });
    it('Evaluates nil', function () {
	assert.deepEqual(evaluate(parse("nil"), undefined), undefined);
    });
});

describe('def', function () {
    it('Handles a simple def', function () {
	var env = new Environment();
	evaluate(parse("(def a 5)"), env);
	assert.deepEqual(evaluate(parse("a"), env), 5);
    });

describe('Function invocation.', function () {
    it('Throws a function-not-found.', function () {
	assert.throws(
	    function () {
		var env = new Environment();
		evaluate(parse("(foo 1 2)"), env);
	    },
		/not.*defined/
	);
    });

    it('Throws not-a-function', function () {
	assert.throws(
	    function () {
		var env = new Environment();
		evaluate(parse("(def foo 1)"), env);
		evaluate(parse("(foo 1 2)"), env);
	    },
		/not.*function/i
	);
    });

    it('Handles simple addition.', function () {
	var env = new Environment();
	assert.deepEqual(evaluate(parse("(+ 1 2)"), env), 3);
    });
});

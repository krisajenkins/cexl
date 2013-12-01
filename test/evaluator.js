/*global describe: true, it: true */
"use strict";

var assert	= require('assert');
var parse	= require('../build/reader').parser.parse;
var evaluate	= require('../src/evaluator').evaluate;

var Symbol	= require('../src/types').Symbol;
var Environment = require('../src/types').Environment;

describe('self-evaluating', function () {
    it('Numbers', function () {
	assert.deepEqual(evaluate(5, undefined), 5);
    });
    it('Strings', function () {
	assert.deepEqual(evaluate("test", undefined), "test");
    });
    it('Boolean', function () {
	assert.deepEqual(evaluate(true, undefined), true);
	assert.deepEqual(evaluate(false, undefined), false);
    });
});

describe('def', function () {
    it('Simple def', function () {
	var env = new Environment();
	evaluate(parse("(def a 5)"), env);
	assert.deepEqual(evaluate(parse("a"), env), 5);
    });
});

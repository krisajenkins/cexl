/*global describe: true, it: true */
"use strict";

var assert = require('assert');
var parse = require('../build/reader').parser.parse;
var evaluate = require('../src/evaluator').evaluate;

var Symbol = require('../src/types').Symbol;

describe('self-evaluating', function () {
    it('Numbers', function () {
	assert.deepEqual(evaluate(5), 5);
    });
    it('Strings', function () {
	assert.deepEqual(evaluate("test"), "test");
    });
    it('Boolean', function () {
	assert.deepEqual(evaluate(true), true);
	assert.deepEqual(evaluate(false), false);
    });
});

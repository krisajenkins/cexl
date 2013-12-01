/*global describe: true, it: true */
"use strict";

var assert = require('assert');
var parse = require('../build/reader').parser.parse;

describe('reader', function () {
	it('Numbers', function () {
		assert.deepEqual(parse("2"), 2);
		assert.deepEqual(parse("-9"), -9);
	});
	it('Boolean', function () {
		assert.deepEqual(parse("true"), true);
		assert.deepEqual(parse("false"), false);
	});
	it('Strings', function () {
		assert.deepEqual(parse('""'), "");
		assert.deepEqual(parse('"test"'), "test");
		assert.deepEqual(parse('"test(some)thing"'), 'test(some)thing');
		assert.deepEqual(parse('"test[some]thing"'), 'test[some]thing');
	});
});

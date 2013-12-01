/*global describe: true, it: true */
"use strict";

var assert = require('assert');
var parse = require('../build/reader').parser.parse;

describe('reader', function () {
	it('Numbers', function () {
		assert.deepEqual(parse("2"), 2);
		assert.deepEqual(parse("-9"), -9);
	});
});

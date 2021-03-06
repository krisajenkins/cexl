/*global describe: true, it: true */
"use strict";

var assert	= require('assert');
var parse	= require('../lib/reader').parser.parse;
var Symbol	= require('../lib/types').Symbol;

describe('reader', function () {
	it('Numbers', function () {
		assert.deepEqual(parse("2"), 2);
		assert.deepEqual(parse("-19"), -19);
	});
	it('Boolean', function () {
		assert.deepEqual(parse("true"), new Symbol('true'));
		assert.deepEqual(parse("false"), new Symbol('false'));
	});
	it('Nil', function () {
		assert.deepEqual(parse("nil"), new Symbol('nil'));
	});
	it('Strings', function () {
		assert.deepEqual(parse('""'), "");
		assert.deepEqual(parse('"test"'), "test");
		assert.deepEqual(parse('"test(some)thing"'), 'test(some)thing');
		assert.deepEqual(parse('"test[some]thing"'), 'test[some]thing');
	});
	it('Symbols', function () {
		assert.deepEqual(parse("somevar"), new Symbol("somevar"));
		assert.deepEqual(parse("+"), new Symbol("+"));
		assert.deepEqual(parse("list?"), new Symbol("list?"));
		assert.deepEqual(parse("<tom.dick_&-harry>"), new Symbol("<tom.dick_&-harry>"));
	});
	it('Lists', function () {
		assert.deepEqual(parse("()"), []);
		assert.deepEqual(parse("(1)"), [1]);
		assert.deepEqual(
			parse("(a)"),
			[new Symbol("a")]
		);
		assert.deepEqual(
			parse("(1 a 20 b)"),
			[1, new Symbol("a"), 20, new Symbol("b")]
		);
		assert.deepEqual(
			parse("(1 (a 2 b) 3 c)"),
			[1, [new Symbol("a"), 2, new Symbol("b")], 3, new Symbol("c")]
		);
	});
	it('Whitespace', function () {
		assert.deepEqual(parse(" ( 1	 \n2 ) "), [1, 2]);
		assert.deepEqual(parse("5\n"), 5);
		assert.deepEqual(
			parse("(fn (x)\n\t(+ 1 x)) "),
			[new Symbol("fn"), [new Symbol("x")], [new Symbol("+"), 1, new Symbol("x")]]
		);
	});
});

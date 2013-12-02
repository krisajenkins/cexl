/*global describe: true, it: true */
"use strict";

var assert	= require('assert');
var parse	= require('../build/reader').parser.parse;
var evaluate	= require('../src/evaluator').evaluate;

var Symbol	= require('../src/types').Symbol;
var Environment = require('../src/types').Environment;
var make_root_environment = require('../src/types').make_root_environment;

describe('self-evaluating', function () {
    it('Evaluates numbers', function () {
	var env = make_root_environment();
	assert.deepEqual(evaluate(5, env), 5);
	assert.deepEqual(evaluate(-9, env), -9);
    });
    it('Evaluates strings', function () {
	var env = make_root_environment();
	assert.deepEqual(evaluate("test", env), "test");
    });
    it('Evaluates booleans', function () {
	var env = make_root_environment();
	assert.deepEqual(evaluate(parse("true"), env), new Symbol('true'));
	assert.deepEqual(evaluate(parse("false"), env), new Symbol('false'));
    });
    it('Evaluates nil', function () {
	var env = make_root_environment();
	assert.deepEqual(evaluate(parse("nil"), env), new Symbol('nil'));
    });
});

describe('def', function () {
    it('Handles a simple def', function () {
	var env = make_root_environment();
	evaluate(parse("(def a 5)"), env);
	assert.deepEqual(evaluate(parse("a"), env), 5);
    });
    it('Handles an expression def', function () {
	var env = make_root_environment();
	evaluate(parse("(def a (+ 1 2))"), env);
	assert.deepEqual(evaluate(parse("a"), env), 3);
    });
});

describe('If statements.', function () {
    it('Handles a simple if.', function () {
	var env = make_root_environment();
	assert.deepEqual(evaluate(parse("(if true 1 2)"), env), 1);
	assert.deepEqual(evaluate(parse("(if 3 1 2)"), env), 1);
	assert.deepEqual(evaluate(parse("(if false 1 2)"), env), 2);
	assert.deepEqual(evaluate(parse("(if nil 1 2)"), env), 2);
    });

    it('Handles an expression if.', function () {
	var env = make_root_environment();
	assert.deepEqual(evaluate(parse("(if (+ 1 2) (* 3 4) (* 5 6))"), env), 12);
	assert.deepEqual(evaluate(parse("(if false (* 3 4) (* 5 6))"), env), 30);
    });
});

describe('Function invocation.', function () {
    it('Throws a function-not-found.', function () {
	assert.throws(
	    function () {
		var env = make_root_environment();
		evaluate(parse("(foo 1 2)"), env);
	    },
		/not.*defined/
	);
    });

    it('Throws not-a-function', function () {
	assert.throws(
	    function () {
		var env = make_root_environment();
		evaluate(parse("(def foo 1)"), env);
		evaluate(parse("(foo 1 2)"), env);
	    },
		/not.*function/i
	);
    });

    it('Throws incorrect number of arguments.', function () {
	assert.throws(
	    function () {
		var env = make_root_environment();
		evaluate(parse("((fn (x) (+ 1 x)))"), env);
	    },
		/incorrect.*arg/i
	);
	assert.throws(
	    function () {
		var env = make_root_environment();
		evaluate(parse("((fn (x y) (+ 1 x y)) 5 6 9)"), env);
	    },
		/incorrect.*arg/i
	);
    });

    it('Handles simple primitives.', function () {
	var env = make_root_environment();
	assert.deepEqual(evaluate(parse("(+ 1 2)"), env), 3);
	assert.deepEqual(evaluate(parse("(* 1 2)"), env), 2);
    });

    it('Handles nested primitives.', function () {
	var env = make_root_environment();
	assert.deepEqual(evaluate(parse("(+ 1 (* 2 3))"), env), 7);
    });

    it('Handles user-defined functions.', function () {
	var env = make_root_environment();
	evaluate(parse("(def double (fn (x) (* 2 x)))"), env);
	assert.deepEqual(evaluate(parse("(double 4)"), env), 8);

	evaluate(parse("(def sum (fn (x y) (+ x y)))"), env);
	assert.deepEqual(evaluate(parse("(sum 4 10)"), env), 14);
    });

    it('Handles higher-order function inputs', function () {
	var env = make_root_environment();
	assert.deepEqual(evaluate(parse("((fn (f) (f 1)) (fn (x) (+ 5 x)))"), env), 6);
    });

    it('Handles lexically-scoped higher-order functions', function () {
	var env = make_root_environment();
	evaluate(parse("(def closure (fn (x) (fn (y) (+ x y))))"), env);
	evaluate(parse("(def inc (closure 1))"), env);
	assert.deepEqual(evaluate(parse("(inc 4)"), env), 5);
    });
});


describe('nil handling', function () {
    it('Allows us to alias nil', function () {
	var env = make_root_environment();
	evaluate(parse("(def nothing nil)"), env);
	assert.deepEqual(
	    evaluate(parse("nothing"), env),
	    evaluate(parse("nil"), env)
	);
    });
});

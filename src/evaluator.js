/*global exports: true*/
"use strict";

var is_array	= require('./types').is_array;
var Symbol	= require('./types').Symbol;

var evaluate;

var evaluate_self_evaluating = function (expr, env) {
    return expr;
};

var evaluate_symbol = function (expr, env) {
    return env.get(expr);
};

var evaluate_def = function (expr, env) {
    if (expr.length !== 3) {
	throw new Error("Wrong number of args to def.");
    }

    var name = expr[1],
	value = evaluate(expr[2], env);

    env.set(name, value);
    return expr;
};

var evaluate_if = function (expr, env) {
    var test_expr, then_expr, else_expr, test_value;

    if (
	expr.length !== 3
	    &&
	    expr.length !== 4
    ) {
	throw new Error("Wrong number of args to if.");
    }

    test_expr = expr[1];
    then_expr = expr[2];
    else_expr = expr[3] || new Symbol("nil");

    test_value = evaluate(test_expr, env);

    if (
	test_value !== false
	    &&
	    typeof test_value !== 'undefined'
    ) {
	return evaluate(then_expr, env);
    }

    return evaluate(else_expr, env);
};

var apply_function = function (expr, env) {
    var evaluated_subexprs, f, args;

    evaluated_subexprs = expr.map(
	function (subexpr) {
	    return evaluate(subexpr, env);
	}
    );

    f = evaluated_subexprs[0];
    args = evaluated_subexprs.slice(1);

    if (typeof f !== 'function') {
	throw new Error("Not a function.");
    }

    return f.apply(undefined, args);
};

evaluate = function (expr, env) {
    if (
	typeof expr === "number"
	    ||
	    typeof expr === "boolean"
	    ||
	    typeof expr === "string"
	    ||
	    typeof expr === "undefined"
    ) {
	return evaluate_self_evaluating(expr, env);
    }

    if (expr instanceof Symbol) {
	return evaluate_symbol(expr, env);
    }

    if (is_array(expr)) {
	if (new Symbol("def").equal(expr[0])) {
	    return evaluate_def(expr, env);
	}

	if (new Symbol("if").equal(expr[0])) {
	    return evaluate_if(expr, env);
	}

	return apply_function(expr, env);
    }

    throw new Error("Cannot evaluate expression: '" + expr + "'");
};

exports.evaluate = evaluate;



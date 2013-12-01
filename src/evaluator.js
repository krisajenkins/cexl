/*global exports: true*/
"use strict";

var is_array	= require('./types').is_array;
var Symbol	= require('./types').Symbol;

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
	value = expr[2];
    env.set(name, value);
    return expr;
};

var evaluate_function = function (expr, env) {
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

var evaluate = function (expr, env) {
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

	return evaluate_function(expr, env);
    }

    throw new Error("Cannot evaluate expression: '" + expr + "'");
};

exports.evaluate = evaluate;



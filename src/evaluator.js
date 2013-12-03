/*global exports: true*/
"use strict";

var types	= require('./types');
var is_array	= types.is_array;
var Symbol	= types.Symbol;
var Lambda	= types.Lambda;

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
	! new Symbol('false').equal(test_value)
	    &&
	    ! new Symbol('nil').equal(test_value)
    ) {
	return evaluate(then_expr, env);
    }

    return evaluate(else_expr, env);
};

var evaluate_fn = function (expr, env) {
    var signature, body, local_env;

    if (expr.length !== 3) {
	throw new Error("Wrong number of args to fn.");
    }

    signature = expr[1];
    body = expr[2];
    local_env = env.extend();

    return new Lambda(signature, body, local_env);
};

var apply_function = function (expr, env) {
    var evaluated_subexprs, f, args, subenv, i;

    evaluated_subexprs = expr.map(
	function (subexpr) {
	    return evaluate(subexpr, env);
	}
    );

    f = evaluated_subexprs[0];
    args = evaluated_subexprs.slice(1);

    if (f instanceof Lambda) {
	if (f.signature.length !== args.length) {
	    throw new Error("Incorrect number of arguments.");
	}

	subenv = f.env.extend();
	for (i = 0; i < f.signature.length; i++ ) {
	    subenv.set(
		f.signature[i],
		args[i]
	    );
	}

	return evaluate(f.body, subenv);
    }

    if (typeof f === 'function') {
	return f.apply(undefined, args);
    }

    throw new Error("Not a function.");
};

evaluate = function (expr, env) {
    if (
	typeof expr === "number"
	    ||
	    typeof expr === "boolean"
	    ||
	    typeof expr === "string"
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

	if (new Symbol("fn").equal(expr[0])) {
	    return evaluate_fn(expr, env);
	}

	return apply_function(expr, env);
    }

    throw new Error("Cannot evaluate expression: '" + expr + "'");
};

exports.evaluate = evaluate;

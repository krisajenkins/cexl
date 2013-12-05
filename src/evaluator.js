/*global exports: true*/
"use strict";

var types		= require('./types');
var is_list		= types.is_list;
var Symbol		= types.Symbol;
var Lambda		= types.Lambda;

var evaluate = function (expr, env) {
	if (typeof expr === "number") { return expr; }
	if (typeof expr === "string") { return expr; }

	if (expr instanceof Symbol) {
		return env.get(expr);
	}

	if (is_list(expr)) {
		var head = expr[0];

		if (
			head instanceof Symbol
				&&
				evaluate.hasOwnProperty(head.name)
		) {
			return evaluate[head.name](expr, env);
		}

		return apply_function(expr, env);
	}

	throw new Error("Cannot evaluate expression: '" + expr + "'");
};

evaluate.def = function (expr, env) {
	if (expr.length !== 3) {
		throw new Error("Wrong number of args to def.");
	}

	var name	= expr[1],
		value	= evaluate(expr[2], env);

	env.set(name, value);

	return name;
};

evaluate.if = function (expr, env) {
	if (expr.length < 3 || expr.length > 4) {
		throw new Error("Wrong number of args to if.");
	}

	var test_expr		= expr[1],
		then_expr		= expr[2],
		else_expr		= expr[3] || new Symbol("nil"),
		test_value		= evaluate(test_expr, env);

	if (
		new Symbol('false').equal(test_value)
			||
			new Symbol('nil').equal(test_value)
	) {
		return evaluate(else_expr, env);
	}

	return evaluate(then_expr, env);
};

evaluate.fn = function (expr, env) {
	if (expr.length !== 3) {
		throw new Error("Wrong number of args to fn.");
	}

	var signature		= expr[1],
		body			= expr[2],
		local_env		= env.extend();

	return new Lambda(signature, body, local_env);
};

evaluate.quote = function (expr, env) {
	if (expr.length !== 2) {
		throw new Error("Wrong number of args to quote.");
	}

	return expr[1];
};

var apply_function = function (expr, env) {
	var evaluated_subexprs, f, args, subenv, i;

	evaluated_subexprs = [];
	for (i = 0; i < expr.length; i++) {
		evaluated_subexprs[i] = evaluate(expr[i], env);
	}

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

exports.evaluate = evaluate;

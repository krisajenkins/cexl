/*global exports: true*/
"use strict";

var evaluate_self_evaluating = function (expr) {
    return expr;
};

var evaluate = function (expr) {
    if (
	typeof expr === "number"
	||
	typeof expr === "boolean"
	||
	typeof expr === "string"
    ) {
	return evaluate_self_evaluating(expr);
    }

    throw new Error("Cannot evaluate expression: " + expr);
};

exports.evaluate = evaluate;



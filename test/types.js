/*global describe: true, it: true */
"use strict";

var assert	= require('assert');

var types	= require('../lib/types');
var Symbol	= types.Symbol;
var Environment = types.Environment;

describe('Environment', function () {
    it('Ensures subenv writes shadow correctly', function () {
	var env = new Environment(),
	    subenv = env.extend(),
	    id = new Symbol('name');

	env.set(id, 1);
	subenv.set(id, 2);

	assert.deepEqual(env.get(id), 1);
	assert.deepEqual(subenv.get(id), 2);
    });
    it("Ensures subenv writes don't affect the root", function () {
	var env = new Environment(),
	    subenv = env.extend(),
	    id = new Symbol('name');

	subenv.set(id, 1);

	assert.deepEqual(subenv.get(id), 1);
	assert.throws(
	    function () {
		env.get(id);
	    },
		/not.*defined/i
	);

    });
});

"use strict";

module.exports = function (grunt) {
    // Project configuration.
    grunt.option('stack', true);
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	peg: {
	    build: {
		src: "src/reader.peg",
		dest: "build/reader.js",
		options: { exportVar: "exports.parser" }
	    }
	},
	cafemocha: {
	    options: {
		reporter: "dot"
	    },
	    tests: {
		src: ['test/**/*.js'],
	    }
	},
    });

    // Load plugins.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cafe-mocha');
    grunt.loadNpmTasks('grunt-peg');

    // Default task(s).
    grunt.registerTask('test', ['peg', 'cafemocha']);
    grunt.registerTask('default', ['test']);
};

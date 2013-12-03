"use strict";

module.exports = function (grunt) {
    // Project configuration.
    grunt.option('stack', true);
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	peg: {
	    build: {
		src: "src/reader.peg",
		dest: "lib/reader.js",
		options: {
		    exportVar: "exports.parser",
		    trackLineAndColumn: true
		}
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
	copy: {
	    build: {
		files: [{
		    expand: true,
		    cwd: 'src/',
		    src: '**/*.js',
		    dest: 'lib/'
		}]
	    }
	}
    });

    // Load plugins.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cafe-mocha');
    grunt.loadNpmTasks('grunt-peg');

    // Default task(s).
    grunt.registerTask('build', ['peg', 'copy', 'cafemocha']);
    grunt.registerTask('default', ['build']);
};

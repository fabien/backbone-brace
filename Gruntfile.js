/*global module:false*/

var path = require('path');

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        lint: {
            files: ['grunt.js', 'backbone.brace.js', 'test/*.js']
        },

        // Required for qunit
        connect: {
            test: {
                options: {
                    port: 8000,
                    base: '.'
                }
            }
        },
        qunit: {
            all: {
                options: {
                    urls: [
                        'http://localhost:8000/test/test.html'
                    ]
                }
            }
        },

        concat: {
            options: {
                stripBanners: false,
                banner: '/*! \n' +
                        ' *  Backbone Brace - <%= grunt.template.today("yyyy-mm-dd") %> \n' +
                        ' *  Copyright <%= grunt.template.today("yyyy") %> Atlassian Software Systems Pty Ltd\n' +
                        ' *  Licensed under the Apache License, Version 2.0\n' +
                        ' */ \n'
            },
            dist: {
                src: ['backbone.brace.js'],
                dest: 'dist/backbone.brace.js'
            }
        },

        uglify: {
            dist: {
                options: {
                    preserveComments: 'some'
                },
                files: {
                    'dist/backbone.brace.min.js': ['dist/backbone.brace.js']
                }
            }
        },

        watch: {
            files: ['test/*.js', 'backbone.brace.js'],
            tasks: ['qunit', 'lintconcat', 'docco']
        },

        jshint: {
            beforeconcat: ['Gruntfile.js', 'backbone.brace.js', 'test/*.js'],
            afterconcat: ['dist/backbone.brace.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: false,
                boss: true,
                eqnull: true
            },
            globals: {}
        },

        docco: {
            src: ['dist/backbone.brace.js'],
            options: {
                output: 'docs/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Lint and Concat task
    grunt.registerTask('lintconcat', ['jshint:beforeconcat', 'concat', 'jshint:afterconcat']);

    // Default task.
    grunt.registerTask('default', ['connect', 'qunit', 'lintconcat', 'uglify', 'docco']);

    // Docco custom task in lieu of a good docco grunt task being available.
    grunt.registerTask('docco', 'Generate docco doc', function(){
        var done = this.async();
        var opts = {
            cmd: './node_modules/docco/bin/docco',
            args: [path.join('dist', 'backbone.brace.js')]
        };
        setTimeout(function() {
            grunt.util.spawn(opts, function(err, rslt, code) {
                if (err) {
                    grunt.log.writeln(err);
                } else {
                    grunt.log.writeln(rslt);
                    done(true);
                }
            });
        }, 100);
    });
};

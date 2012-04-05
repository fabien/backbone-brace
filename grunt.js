/*global module:false*/
module.exports = function(grunt) {

  function strDate(){
    var now = new Date();
    return now.getFullYear() + '/' + now.getMonth() + "/" + now.getDate();
  }

  // Project configuration.
  grunt.initConfig({
    meta: {
      banner: '//     Backbone Brace - ' + strDate() + '\n' +
        '//     Copyright 2012 Atlassian Software Systems Pty Ltd\n' +
        '//     Licensed under the Apache License, Version 2.0'
    },
    lint: {
      files: ['grunt.js', 'backbone.brace.js', 'test/*.js']
    },
    qunit: {
      files: ['test/test.html']
    },
    concat: {
      dist: {
        src: ['<banner>', '<file_strip_banner:backbone.brace.js>'],
        dest: 'dist/backbone.brace.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', '<config:concat.dist.dest>'],
        dest: 'dist/backbone.brace.min.js'
      }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit concat docco'
    },
    jshint: {
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
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min docco');

  grunt.registerTask('docco', 'Generate docco doc', function(){
    var done = this.async();
    var opts = {
      cmd: 'docco',
      args: ['dist/backbone.brace.js']
    };
    setTimeout(function(){
      grunt.utils.spawn(opts, function(err, rslt, code){
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

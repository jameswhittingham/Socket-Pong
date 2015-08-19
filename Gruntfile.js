var path = require('path');

module.exports = function (grunt) {
  "use strict";

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    paths : {
      app : 'app',
      dist: 'dist'
    },

    less: {
      main: {
        files: {
          '<%= paths.app %>/common/styles/main.css': [
            '<%= paths.app %>/common/styles/main.less'
          ]/*
          '<%= paths.app %>/common/styles/top.css': [
            '<%= paths.app %>/common/styles/top.less'
          ],
          '<%= paths.app %>/common/styles/bottom.css': [
            '<%= paths.app %>/common/styles/bottom.less'
          ]*/
        },
        options: {
          compress: true,
        }
      }
    },

    watch: {
      styles: {
        files: ['**/*.less'],
        tasks: ['less'],
        options: {
          nospawn: false,
          livereload: true
        }
      },
    },

    express: {
      options: {
        port: 9001,
        hostname: '*'
      },
      livereload: {
        options: {
          server: path.resolve('./app'),
          livereload: true,
          serverreload: true
        }
      },
    },

    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },

    concurrent: {
      server: [
        'less:main'
      ],
    },
  });

  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'concurrent:server',
      'express:livereload',
      'open',
      'watch'
    ]);
  });
};

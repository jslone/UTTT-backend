/**
 * Run other gruntfiles
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Run the gruntfile for the frontend, producing a build of the frontend
 *
 * For usage docs see:
 * 		https://github.com/Bartvds/grunt-run-grunt
 */
module.exports = function(grunt) {

  grunt.config.set('run_grunt', {
    dev: {
      src: 'frontend/Gruntfile.js',
      task: 'build'
    }
  });

  grunt.loadNpmTasks('grunt-run-grunt');
};

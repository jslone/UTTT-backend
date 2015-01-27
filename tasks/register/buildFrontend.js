module.exports = function (grunt) {
  grunt.registerTask('buildFrontend', [
    'run_grunt:dev',
    'copy:frontend'
  ]);
};

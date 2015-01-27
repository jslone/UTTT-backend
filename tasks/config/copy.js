/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, except coffescript and less files, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories and files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-copy
 *
 * # frontend task config
 * Copies all directories and files from the frontend/build directory into the
 * .tmp/public directory
 */
module.exports = function(grunt) {

	grunt.config.set('copy', {
		dev: {
			files: [{
				expand: true,
				cwd: './assets',
				src: ['**/*.!(coffee|less)'],
				dest: '.tmp/public'
			}]
		},
		build: {
			files: [{
				expand: true,
				cwd: '.tmp/public',
				src: ['**/*'],
				dest: 'www'
			}]
		},
		frontend: {
			files: [{
				expand: true,
				cwd: './frontend/dist',
				src: ['**/*'],
				dest: 'assets'
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};

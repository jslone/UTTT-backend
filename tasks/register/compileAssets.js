module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
		'less:dev',
		'run_grunt:dev',
		'copy:dev',
		'copy:frontend',
		'coffee:dev',
	]);
};

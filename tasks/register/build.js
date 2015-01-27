module.exports = function (grunt) {
	grunt.registerTask('build', [
		'compileAssets',
		'run_grunt:dev',
		'linkAssetsBuild',
		'clean:build',
		'copy:build'
	]);
};

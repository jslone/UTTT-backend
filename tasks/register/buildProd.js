module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
		'compileAssets',
		'run_grunt:dev',
		'concat',
		'uglify',
		'cssmin',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};

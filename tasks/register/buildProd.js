module.exports = function (grunt) {
	grunt.registerTask('buildProd', [
		'buildFrontend',
		'compileAssets',
		'concat',
		'uglify',
		'cssmin',
		'linkAssetsBuildProd',
		'clean:build',
		'copy:build'
	]);
};

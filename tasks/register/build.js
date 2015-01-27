module.exports = function (grunt) {
	grunt.registerTask('build', [
		'buildFrontend',
		'compileAssets',
		'linkAssetsBuild',
		'clean:build',
		'copy:build'
	]);
};

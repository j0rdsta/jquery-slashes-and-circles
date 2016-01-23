module.exports = function(config) {
  config.set({
  	basePath: '.',
    files: [
			'node_modules/jquery/dist/jquery.js',
			'node_modules/gsap/src/uncompressed/TweenLite.js',
			'node_modules/gsap/src/uncompressed/easing/EasePack.js',
			'node_modules/gsap/src/uncompressed/plugins/CSSPlugin.js',
      'dist/jquery.slashes-and-circles.js',
			'test/setup.js',
      'test/spec/*'
    ],
    frameworks: ['qunit'],
		autoWatch: true
  });
};

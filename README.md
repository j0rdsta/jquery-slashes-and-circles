# jQuery slashesAndCircles [![Build Status](https://secure.travis-ci.org/j0rdsta/jquery-slashes-and-circles.svg?branch=master)](https://travis-ci.org/j0rdsta/jquery-slashes-and-circles) ![Bower Version](https://badge.fury.io/bo/jquery-slashes-and-circles.svg)

### Animate random slashes and circles in a clipPath area of an SVG, avoiding certain areas.

This is a tremendously basic plugin leveraging jQuery and TweenLite for a cool, swish opening animation. The only purpose I have for this plugin is for [Jordsta.com](http://jordsta.com) and related materials, but I'm reusing it enough that I felt that it needed a plugin.

The animation on Jordsta.com comprises of an `<svg>` with a linear gradient, clipped by a few simple shape paths (slashes and circles). When the page is loaded, this plugin manipulates the `<svg>`, grabs each of the shape paths and animates it into a random position in the available space. The random position prevents any overlaps, and takes into account any absolute positioned elements on top of the `<svg>` (specified with the `avoid` parameter on plugin initialization).

Feel free to use and fork this plugin, but at the moment it's one-purpose, and heavily tied to the example HTML and TweenLite.

This is yet another jQuery plugin made with help from [jQuery Boilerplate](https://jqueryboilerplate.com/).

## Usage

1. Include jQuery if you haven't already:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
	```

2. Include TweenLite and required plugins:

	```html
	<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.2/TweenLite.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.2/easing/EasePack.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.2/plugins/CSSPlugin.min.js"></script>
	```

3. Slap in some SVG:

```html
	<svg width="100%">
		<!-- Rectangle, what the gradient sits on -->
		<rect x="0" y="0" width="100%" height="100%" clip-path="url(#theSVGPath)" fill="url(#gradient)" />
		<defs>
			<!-- Gradient, to be clipped by the clipPath -->
			<linearGradient id="gradient" x1="384" y1="1284" x2="2051" y2="-384" gradientUnits="userSpaceOnUse">
				<stop offset="0.1" stop-color="#ff5722" />
				<stop offset="0.18" stop-color="#f65729" />
				<stop offset="0.32" stop-color="#dc563d" />
				<stop offset="0.5" stop-color="#b3555c" />
				<stop offset="0.71" stop-color="#7a5388" />
				<stop offset="0.9" stop-color="#3f51b5" />
			</linearGradient>
			<!-- And here's the clipPath, containing some basic SVG paths -->
			<clipPath id="theSVGPath">

				<!-- Slashes and Circles (you can swap these out for anything, really) -->
				<path d="M1 144a2 2 0 0 1-1-3L80 1a2 2 0 0 1 3-1 2 2 0 0 1 1 3L4 143A2 2 0 0 1 1 144Z" transform="translate(-250,240)" fill="#396c93" data-width="85" data-height="145" class="slashes" id="slash1"/>

				<path d="M35 11c5 12-3 26-17 26C5 37-4 23 2 11 4 5 10 0 18 0S33 5 35 11ZM18 5c-7 0-11 4-13 8C2 22 8 32 18 32s16-10 13-19C29 8 25 5 18 5Z" transform="translate(-250,240)" fill="#396c93" data-width="37" data-height="37" class="circles" id="circle1"/>

				<!-- ...snip -->
			</clipPath>
		</defs>
	</svg>
```

4. Include `jquery.slashes-and-circles.min.js`:

	```html
	<script src="dist/jquery.slashes-and-circles.min.js"></script>
	```

5. Call the plugin:

	```javascript
	$("svg#element").slashesAndCircles({
		elements: $('.slashes, .circles'), 	// elements to animate
		avoid: [],							// what elements the plugin should avoid
		allowAnimation: true				// allow or deny animation
	});
	```

And you're done!

## Structure

The basic structure of the project is given in the following way:

```
├── demo/
│   └── index.html
├── dist/
│   ├── jquery.slashes-and-circles.js
│   └── jquery.slashes-and-circles.min.js
├── src/
│   └── jquery.slashes-and-circles.js
├── .editorconfig
├── .gitignore
├── .jshintrc
├── .travis.yml
├── Gruntfile.js
└── package.json
```

#### [demo/](https://github.com/j0rdsta/jquery-slashes-and-circles/tree/master/demo)

Contains a simple HTML file to demonstrate your plugin. A better example should be viewable on the [Jordsta.com](http://jordsta.com) website in the near future.

#### [dist/](https://github.com/j0rdsta/jquery-slashes-and-circles/tree/master/dist)

This is where the generated files are stored once Grunt runs.

#### [src/](https://github.com/j0rdsta/jquery-slashes-and-circles/tree/master/src)

Contains the files responsible for your plugin, you can choose between JavaScript or CoffeeScript.

#### [.editorconfig](https://github.com/j0rdsta/jquery-slashes-and-circles/tree/master/.editorconfig)

This file is for unifying the coding style for different editors and IDEs.

> Check [editorconfig.org](http://editorconfig.org) if you haven't heard about this project yet.

#### [.gitignore](https://github.com/j0rdsta/jquery-slashes-and-circles/tree/master/.gitignore)

List of files that we don't want Git to track.

> Check this [Git Ignoring Files Guide](https://help.github.com/articles/ignoring-files) for more details.

#### [.jshintrc](https://github.com/j0rdsta/jquery-slashes-and-circles/tree/master/.jshintrc)

List of rules used by JSHint to detect errors and potential problems in JavaScript.

> Check [jshint.com](http://jshint.com/about/) if you haven't heard about this project yet.

#### [.travis.yml](https://github.com/j0rdsta/jquery-slashes-and-circles/tree/master/.travis.yml)

Definitions for continuous integration using Travis.

> Check [travis-ci.org](http://about.travis-ci.org/) if you haven't heard about this project yet.

#### [Gruntfile.js](https://github.com/j0rdsta/jquery-slashes-and-circles/tree/master/Gruntfile.js)

Contains all automated tasks using Grunt.

> Check [gruntjs.com](http://gruntjs.com) if you haven't heard about this project yet.

#### [package.json](https://github.com/j0rdsta/jquery-slashes-and-circles/tree/master/package.json)

Specify all dependencies loaded via Node.JS. This includes jQuery and GSAP.

> Check [NPM](https://npmjs.org/doc/json.html) for more details.

## Contributing

Check [CONTRIBUTING.md](https://github.com/j0rdsta/jquery-slashes-and-circles/blob/master/CONTRIBUTING.md) for more information.

## History

Check [Releases](https://github.com/jquery-boilerplate/jquery-boilerplate/releases) for detailed changelog.

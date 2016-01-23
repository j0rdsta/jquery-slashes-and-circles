(function ($, QUnit) {
	"use strict";

	var $testCanvas = $("#testCanvas");
	var $fixture = null;

	QUnit.module("jQuery slashesAndCircles", {
		beforeEach: function () {
			// fixture is the element where your jQuery plugin will act
			$fixture = $("<svg/>");

			$testCanvas.append($fixture);
		},
		afterEach: function () {
			// we remove the element to reset our plugin job :)
			$fixture.remove();
		}
	});

	QUnit.test("is inside jQuery library", function ( assert ) {
		assert.equal(typeof $.fn.slashesAndCircles, "function", "has function inside jquery.fn");
		assert.equal(typeof $fixture.slashesAndCircles, "function", "another way to test it");
	});

	QUnit.test("returns jQuery functions after called (chaining)", function ( assert ) {
		assert.equal(typeof $fixture.slashesAndCircles().on, "function", "'on' function must exist after plugin call");
	});

	QUnit.test("caches plugin instance", function ( assert ) {
		$fixture.slashesAndCircles();
		assert.ok($fixture.data("plugin_slashesAndCircles"), "has cached it into a jQuery data");
	});

	QUnit.test("enable custom config", function ( assert ) {
		$fixture.slashesAndCircles({
			elements: $(".slashes, .circles"),
			avoid: [],
			allowAnimation: true
		});

		var pluginData = $fixture.data("plugin_slashesAndCircles");

		assert.deepEqual(pluginData.settings, {
			elements: $(".slashes, .circles"),
			avoid: [],
			allowAnimation: true
		}, "extend plugin settings");

	});

	// @TODO: More tests - ensure TweenLite event has fired, handling empty DOM elements

}(jQuery, QUnit));

;(function ($, window, document, undefined) {

  "use strict";

  // Create the defaults once
  var pluginName = "slashesAndCircles";
  var defaults = {
    elements: $(".slashes, .circles"),
    avoid: [],
    allowAnimation: true
  };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    initSlashKeypress: function (){
      var self = this;
      $(document).keypress(function (e) {
        if (e.which === 47) {
          self.randomizePositions(true);
        }
      });
    }, initResizeReflow: function () {
      var resizeTimer;
      var self = this;
      $(window).on("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          // need to recalculate avoidCoords since the screen size has changed
          self.avoidCoords = self.addAvoidCoords();
          self.randomizePositions(false);
        }, 250);
      });
    }, init: function () {
      // check if TweenLite (a dependency) is defined
      if (typeof TweenLite !== "function") {
        console.error("TweenLite is not initialized. Quitting...");
        return;
      }

      this.avoidCoords = this.addAvoidCoords();

      this.randomizePositions(true);

      // Randomize elements with /
      this.initSlashKeypress();

      // Finished resizing? Randomize elements
      this.initResizeReflow();
    },
    addAvoidCoords: function (){
      return $(this.settings.avoid).map(function (i, el) {
        var offset = $(el).offset();
        return {
          w: $(el).width(),
          h: $(el).height(),
          x: offset.left,
          y: offset.top
        };
      });
    }, randomizePositions: function (animatePositions) {
      var numberLimit;
      var limitElements;
      var percentageMedium;
      var positions;
      var svg;
      var self;

      self = this;

      // Get width and height of SVG
      svg = {
        w: this.element.getBBox().width,
        h: this.element.getBBox().height
      };

      // Add elements to avoid to positions array
      positions = jQuery.extend(true, {}, this.avoidCoords);

      // 0 -> 21 elements (reach 21 by medium-up size)
      percentageMedium = ($(window).width() / 640);
      limitElements = (percentageMedium <= 1);
      numberLimit = Math.floor(percentageMedium * this.settings.elements.length) - 8;

      this.settings.elements.css({visibility: "hidden"}).each(function (i) {
        var tweenTo;
        var tweenFrom;
        var coords;

        if (limitElements && numberLimit === 0) {
          // console.log("limited");
          return;
        }

        coords = {
          w: $(this).data("width"),
          h: $(this).data("height")
        };

        var success = false;
        var maxTries = 50;

        // while we haven't found a spot that has no collisions, and max tries aren't exceeded
        while (!success && maxTries >= 0) {
          // randomize coordinates
          coords.x = parseInt(Math.random() * (svg.w - coords.w));
          coords.y = parseInt(Math.random() * (svg.h - coords.h));
          success = true;
          // make sure we haven't collided with anything previously placed
          for (var j = 0; j < positions.length; j++) {
            // if there's a collision
            if (
              coords.x <= (positions[j].x + positions[j].w) &&
              (coords.x + coords.w) >= positions[j].x &&
              coords.y <= (positions[j].y + positions[j].h) &&
              (coords.y + coords.h) >= positions[j].y
            ) {
              // we haven't succeeded, try again
              success = false;
            }
          }
          maxTries--;
        }

        // if we've reached the maximum amount of tries, hide and quit
        if (maxTries <= 0) {
          $(this).css({opacity: 0});
          // console.log("max tries exceeded", $(this));
          return;
        }

        positions.push(coords);

        // Animation time!
        // properties to tween from
        tweenFrom = {
          x: (coords.x - 663), // ~57.9% height to width ratio = 663/1145
          y: (coords.y + 1000),
          opacity: 0,
          visibility: "visible"
        };

        // properties to tween to
        tweenTo = {
          x: coords.x,
          y: coords.y,
          opacity: 1,
          visibility: "visible"
        };

        // if we want things to animate
        if (animatePositions === true && self.settings.allowAnimation === true) {
          tweenTo.ease = Expo.easeOut;
          tweenTo.delay = i * 0.05;
          TweenLite.fromTo($(this), 1, tweenFrom, tweenTo);
        } else {
          TweenLite.set($(this), tweenTo);
        }

        numberLimit--;
      });
    }
  });

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);

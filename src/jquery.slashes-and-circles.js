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
    init: function () {
      // check if TweenLite (a dependency) is defined
      if (typeof TweenLite !== "function") {
        console.error("TweenLite is not initialized. Quitting...");
        return;
      }

      this.avoidCoords = this.addAvoidCoords();
      this.svgDimensions = this.calculateSvgDimensions();

      this.randomizePositions(true, false);

      // Randomize elements with /
      this.initSlashKeypress();

      // Finished resizing? Randomize elements
      this.initResizeReflow();
    },
    initSlashKeypress: function () {
      var self = this;
      $(document).keypress(function (e) {
        if (e.which === 47) {
          self.randomPositionAlongLine();
        }
      });
    },
    initResizeReflow: function () {
      var resizeTimer;
      var self = this;
      $(window).on("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          // need to recalculate avoidCoords and svgDimensions since the screen size has changed
          self.avoidCoords = self.addAvoidCoords();
          self.svgDimensions = self.calculateSvgDimensions();
          self.randomizePositions(false, true);
        }, 250);
      });
    },
    addAvoidCoords: function () {
      return $(this.settings.avoid).map(function (i, el) {
        var offset = $(el).offset();
        return {
          w: $(el).width(),
          h: $(el).height(),
          x: offset.left,
          y: offset.top
        };
      });
    },
    calculateSvgDimensions: function () {
      return {
        w: this.element.getBBox().width,
        h: this.element.getBBox().height
      };
    },
    checkForCollisions: function (positions, coords) {
      for (var j = 0; j < positions.length; j++) {
        // if there's a collision
        if (
          coords.x && coords.y && positions[j] && ("x" in positions[j]) &&
          ("w" in positions[j]) && ("y" in positions[j]) && ("h" in positions[j]) &&
          coords.x <= (positions[j].x + positions[j].w) &&
          (coords.x + coords.w) >= positions[j].x &&
          coords.y <= (positions[j].y + positions[j].h) &&
          (coords.y + coords.h) >= positions[j].y
        ) {
          // we haven't succeeded, try again
          return false;
        }
      }
      // only gets here if there haven't been any collisions
      return true;
    },
    calculateAngledCoords: function (coords, yAdditional) {
      return {
        x: Math.floor(coords.x - (yAdditional * 0.60)), // ~60 deg height to width ratio
        y: Math.floor(coords.y + yAdditional)
      };
    },
    generateRandomCoords: function (self, elem, svg, positions) {
      var gap = 10;
      var coords;

      coords = {
        w: $(elem).data("width") + gap,
        h: $(elem).data("height") + gap
      };

      var success = false;
      var maxTries = 50;

      // while we haven't found a spot that has no collisions, and max tries aren't exceeded
      while (!success && maxTries >= 0) {

        // randomize coordinates
        coords.x = parseInt(Math.random() * (svg.w - coords.w));
        coords.y = parseInt(Math.random() * (svg.h - coords.h));
        // make sure we haven't collided with anything previously placed
        success = self.checkForCollisions(positions, coords);
        //console.log("success", success);
        //console.log("coords.x", coords.x);
        //console.log("coords.y", coords.y);
        maxTries--;
      }

      // if we've reached the maximum amount of tries, hide and quit
      if (maxTries <= 0) {
        $(this).css({visibility: "hidden"});
        //console.log("max tries exceeded", $(this));
        return;
      }
      return coords;
    },
    randomizePositions: function (animatePositions, reflow) {
      var numberLimit;
      var limitElements;
      var percentageMedium;
      var positions;
      var svg;
      var self;

      self = this;

      // Get width and height of SVG
      svg = jQuery.extend(true, {}, this.svgDimensions);

      // Add elements to avoid to positions array
      positions = jQuery.extend(true, {}, this.avoidCoords);

      // 0 -> 21 elements (reach 21 by medium-up size)
      percentageMedium = ($(window).width() / 640);
      limitElements = (percentageMedium <= 1);
      numberLimit = Math.floor(percentageMedium * this.settings.elements.length) - 8;

      this.settings.elements.each(function (i, elem) {
        var coords;
        var tweenTo;
        var tweenFrom;

        if (limitElements && numberLimit === 0) {
          //console.log("limited");
          return;
        }

        coords = self.generateRandomCoords(self, elem, svg, positions);
        positions.push(coords);

        if (!coords) {
          //console.log("generateRandomCoords limited, returning...");
          $(elem).css({visibility: "hidden"});
          return;
        }

        $(elem).data("x", coords.x);
        $(elem).data("y", coords.y);

        var from = self.calculateAngledCoords(coords, 1000);

        // Animation time!
        // properties to tween from
        tweenFrom = {
          x: from.x,
          y: from.y,
          opacity: 0,
          visibility: "visible"
        };

        // properties to tween to
        tweenTo = {
          x: coords.x,
          y: coords.y,
          opacity: 1,
          visibility: "visible",
          ease: Expo.easeOut,
          delay: i * 0.05
        };

        if (self.settings.allowAnimation === false) {
          TweenLite.set($(this), tweenTo);
        } else if (reflow === true) {
          TweenLite.to($(this), 1, tweenTo);
        } else if (animatePositions === true) {
          TweenLite.fromTo($(this), 1, tweenFrom, tweenTo);
        }

        numberLimit--;
      });
    },
    randomPositionAlongLine: function () {
      var self = this;

      // Get width and height of SVG
      var svg = jQuery.extend(true, {}, this.svgDimensions);

      // Add elements to avoid to positions array
      var positions = jQuery.extend(true, {}, this.avoidCoords);

      this.settings.elements.each(function (i, elem) {

        var coords = {
          w: $(elem).data("width"),
          h: $(elem).data("height"),
          x: $(elem).data("x"),
          y: $(elem).data("y")
        };
        //console.log("old coords", coords);

        var success = false;
        var maxTries = 50;

        // while we haven't found a spot that hasn't gone outside of bounds, and max tries aren't exceeded
        while (!success && maxTries > 0) {
          //var animationAmount = Math.floor((Math.random() * (svg.h - coords.h)) + 1 );
          var animationAmount = Math.floor(Math.random() * ((svg.h - coords.h) - -500 + 1) + -500);
          var animateTo = self.calculateAngledCoords(coords, animationAmount);

          //var animateTo = {
          //  x: coords.x + 30,
          //  y: coords.y
          //};

          console.log("animateTo.y > 0", (animateTo.y >= 0), animateTo.y);
          console.log("animateTo.x > 0", (animateTo.x >= 0), animateTo.x);

          if (
            (animateTo.y > 0) &&
            (animateTo.x > 0) &&
            (animateTo.y <= (svg.h - coords.h)) &&
            (animateTo.x <= (svg.w - coords.w))
          ) {
            success = true;
            console.log("success!");
            //console.log("new coords:", animateTo);
            //console.log("svg.h:", svg.h);
            //console.log("svg.w:", svg.w);
          }
          maxTries--;
        }

        if (maxTries <= 0) {
          $(elem).css({opacity: 0});
          console.log("max tries exceeded", $(elem));
        } else {
          // Animation time!
          // properties to tween from
          var tweenTo = {
            x: animateTo.x,
            y: animateTo.y,
            ease: Expo.easeOut
            //delay: i * 0.05
          };

          if (self.settings.allowAnimation === false) {
            TweenLite.set($(this), tweenTo);
          } else {
            TweenLite.to($(elem), 1, tweenTo);
          }

          $(elem).data("x", animateTo.x);
          $(elem).data("y", animateTo.y);
        }

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

;(function ( $, window, document, undefined ) {

  "use strict";

  // Create the defaults once
  var pluginName = "slashesAndCircles",
    defaults = {
      elements: $(".slashes, .circles"),
      avoid: [],
      allowAnimation: true
    };

  // The actual plugin constructor
  function Plugin ( element, options ) {
    this.element = element;
    this.settings = $.extend( {}, defaults, options );
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function () {
      // Place initialization logic here
      // You already have access to the DOM element and
      // the options via the instance, e.g. this.element
      // and this.settings
      // you can add more functions like the one below and
      // call them like the example below
      this.randomizePositions(true);

      self = this;

      // Randomize elements with /
      $(document).keypress(function(e) {
        if(e.which === 47) {
          self.randomizePositions(true);
        }
      });

      // Finished resizing? Randomize elements
      var resizeTimer;
      $(window).on("resize", function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          // Run code here, resizing has "stopped"
          self.randomizePositions(false);
        }, 250);
      });
    },
    randomizePositions: function(animatePositions) {
      // check if TweenLite (a dependency) is defined
      if (typeof TweenLite !== "function") {
        console.error("TweenLite is not initialized. Quitting...");
        return;
      }

      self = this;

      // Get width and height of SVG
      var svg = {
        w: this.element.getBBox().width,
        h: this.element.getBBox().height
      };

      // Add elements to avoid to positions array
      var positions = $(this.settings.avoid).map(function(i, el){
        var offset = $(el).offset();
        return {
          w: $(el).width(),
          h: $(el).height(),
          x: offset.left,
          y: offset.top
        };
      });

      // 0 -> 21 elements (reach 21 by medium-up size)
      var percentageMedium = ($(window).width() / 640),
        limitElements = (percentageMedium <= 1), // if true, don't show as many slashes/circles
        numberLimit = Math.floor(percentageMedium * this.settings.elements.length) - 8;

      this.settings.elements.css({ visibility: "hidden" }).each(function(i) {
        if (limitElements && numberLimit === 0) {
          // console.log("limited");
          return;
        }

        var coords = {
          w: $(this).data("width"),
          h: $(this).data("height")
        };

        var success = false,
          maxTries = 50;

        // while we haven't found a spot that has no collisions, and max tries aren't exceeded
        while (!success && maxTries >= 0)
        {
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
            ){
              // we haven't succeeded, try again
              success = false;
            }
          }
          maxTries--;
        }

        // if we've reached the maximum amount of tries, hide and quit
        if (maxTries <= 0) {
          $(this).css({ opacity: 0 });
          // console.log("max tries exceeded", $(this));
          return;
        }

        positions.push(coords);

        // Animation time!
        // properties to tween from
        var tweenFrom = {
          x: (coords.x - 663), // ~57.9% height to width ratio = 663/1145
          y: (coords.y + 1000),
          opacity: 0,
          visibility: "visible"
        };

        // properties to tween to
        var tweenTo = {
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
  $.fn[ pluginName ] = function ( options ) {
    return this.each(function() {
      if ( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
      }
    });
  };

})( jQuery, window, document );

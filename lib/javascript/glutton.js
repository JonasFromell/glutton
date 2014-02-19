(function($) {
  var Glutton;
  Glutton = {};
  Glutton.Variations = {
    "default": {
      onCreating: function(element) {
        var content, progress;
        content = $("<span />");
        content.html(element.html());
        content.addClass("content");
        progress = $("<span />");
        progress.addClass("progress");
        element.html("");
        element.append(content);
        return element.append(progress);
      },
      onCreated: function() {},
      onStart: function(element) {
        return element.addClass('progressing');
      },
      onSucceeded: function(element) {
        element.addClass('succeeded');
        element.bind('animationend webkitAnimationEnd', function() {
          return element.removeClass('succeeded');
        });
        return element.removeClass('progressing');
      },
      onFailed: function(element) {
        element.addClass('failed');
        element.bind('animationend webkitAnimationEnd', function() {
          return element.removeClass('failed');
        });
        return element.removeClass('progressing');
      },
      onProgressed: function(element, progression) {
        var progressBar;
        progressBar = element.find('.progress');
        return progressBar.width((progression * 700) + "%");
      },
      onResetting: function(element) {
        var progressBar;
        progressBar = element.find('.progress');
        return progressBar.width(0);
      },
      onReset: function() {}
    }
  };
  Glutton.Core = (function() {
    function Core(element, variation) {
      this.settings = $.extend({}, Glutton.Variations["default"], Glutton.Variations[variation]);
      this.$element = $(element);
      this.$element.on('creating.glutton', (function(_this) {
        return function(evt) {
          return _this.settings.onCreating(_this.$element);
        };
      })(this));
      this.$element.on('created.glutton', (function(_this) {
        return function(evt) {
          return _this.settings.onCreated(_this.$element);
        };
      })(this));
      this.$element.on('resetting.glutton', (function(_this) {
        return function(evt) {
          return _this.settings.onResetting(_this.$element);
        };
      })(this));
      this.$element.on('reset.glutton', (function(_this) {
        return function(evt) {
          return _this.settings.onReset(_this.$element);
        };
      })(this));
      this.$element.on('start.glutton', (function(_this) {
        return function(evt) {
          return _this.settings.onStart(_this.$element);
        };
      })(this));
      this.$element.on('succeeded.glutton', (function(_this) {
        return function(evt, res) {
          return _this.settings.onSucceeded(_this.$element);
        };
      })(this));
      this.$element.on('failed.glutton', (function(_this) {
        return function(evt, res) {
          return _this.settings.onFailed(_this.$element);
        };
      })(this));
      this.$element.on('progressed.glutton', (function(_this) {
        return function(evt, res) {
          return _this.settings.onProgressed(_this.$element, res);
        };
      })(this));
      this.create();
    }

    Core.prototype.create = function() {
      this.$element.trigger('creating.glutton', [this.$element]);
      return this.$element.trigger('created.glutton', [this.$element]);
    };

    Core.prototype.start = function(callback) {
      var promise;
      this.$element.trigger('start.glutton');
      this.$element.prop('disabled', true);
      promise = callback();
      promise.done((function(_this) {
        return function(res) {
          _this.$element.prop('disabled', false);
          _this.$element.trigger("succeeded.glutton", [res]);
          return _this.reset();
        };
      })(this));
      promise.fail((function(_this) {
        return function(res) {
          _this.$element.prop('disabled', false);
          _this.$element.trigger("failed.glutton", [res]);
          return _this.reset();
        };
      })(this));
      return promise.progress((function(_this) {
        return function(res, total) {
          res = res / total;
          return _this.$element.trigger("progressed.glutton", [res]);
        };
      })(this));
    };

    Core.prototype.reset = function() {
      this.$element.trigger("resetting.glutton");
      return this.$element.trigger("reset.glutton");
    };

    return Core;

  })();
  $.fn.glutton = function(option, callback) {
    return this.each(function() {
      var $this, data;
      $this = $(this);
      data = $this.data('glutton');
      if (!data) {
        $this.data('glutton', (data = new Glutton.Core(this)));
      }
      if (typeof option === "string") {
        return data[option](callback);
      }
    });
  };
  return $.fn.glutton.Constructor = Glutton.Core;
})($);

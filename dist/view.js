(function() {
  var Mixable, Template, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixable = require('./mixable');

  Template = require('./template');

  View = (function(_super) {
    __extends(View, _super);

    function View() {
      return View.__super__.constructor.apply(this, arguments);
    }

    _.extend(View, Mixable);

    View.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      if (this.template.constructor === String) {
        this.template = Template.get(this.template);
      }
      this.template.bind(this).then((function(_this) {
        return function($el) {
          _this.setElement($el);
          return _this.render();
        };
      })(this));
      return View.__super__.initialize.call(this, options);
    };

    View.prototype.render = function() {
      return this.delegateEvents();
    };

    View.prototype.setView = function(view) {
      this.view = view;
      return this.view.render();
    };

    return View;

  })(Backbone.View);

  module.exports = View;

}).call(this);

//# sourceMappingURL=view.js.map

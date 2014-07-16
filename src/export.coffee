Tails.factory = ( exports ) ->
  exports._ = Tails

  exports.Mixable    = Tails.Mixable
  exports.Model      = Tails.Model
  exports.Collection = Tails.Collection
  exports.View       = Tails.View
  exports.Template   = Tails.Template
  exports.Mixins     = Tails.Mixins
  exports.Utils      = Tails.Utils

  exports.Models     = Tails.Models
  exports.Views      = Tails.Views

  exports.config     = Tails.config

  exports.configure = ( options={} ) ->
    for property, value of options
      Tails.config[property] = value
    return

# Exports Tails for CommonJS, AMD and the browser.
if typeof exports == 'object'
  Tails.factory(exports)
else if typeof define == 'function' && define.amd
  define ['exports'], (exports) ->
    Tails.factory(@Tails = exports)
    return exports
else
  Tails.factory(@Tails = {})

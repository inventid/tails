Tails.factory = ( exports ) ->
  exports._ = Rivets

  exports.Mixable  = Tails.Mixable
  exports.Model    = Tails.Model
  exports.Collection = Tails.Collection
  exports.View     = Tails.View
  exports.Template   = Tails.Template

  exports.configure = ( options = {} ) ->
    for property, value of options
      Tails.config[property] = value
    return

if typeof exports == 'object'
  Tails.factory(exports)
else if typeof define == 'function' && define.amd
  define ['exports'], ( exports ) ->
    Tails.factory(@tails = exports)
    return exports
else Tails.factory(@tails = {})

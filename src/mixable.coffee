Tails.Mixable =

  MixableKeywords : ['included', 'extended', 'constructor']

  include: ( mixins... ) ->
    unless @_includedMixins?.klass is @
      @_includedMixins = _(@_includedMixins).clone() or []
      @_includedMixins.klass = @

    for mixin in mixins
      mixin = mixin.InstanceMethods if mixin.InstanceMethods?
      continue if mixin in @_includedMixins
      for key, value of mixin when key not in Tails.Mixable.MixableKeywords
        @::[key] = value

      @_includedMixins.push mixin
      mixin.included?.apply @

    return @

  extend: ( mixins... ) ->
    unless @_extendedMixins?.klass is @
      @_extendedMixins = _(@_extendedMixins).clone() or []
      @_extendedMixins.klass = @

    for mixin in mixins
      mixin = mixin.ClassMethods if mixin.ClassMethods?
      continue if mixin in @_extendedMixins
      for key, value of mixin when key not in Tails.Mixable.MixableKeywords
        @[key] = value

      @_extendedMixins.push mixin
      mixin.extended?.apply @

    return @

  concern: ( mixins... ) ->
    for mixin in mixins
      @include mixin.InstanceMethods if mixin.InstanceMethods?
      @extend mixin.ClassMethods if mixin.ClassMethods?
    return @

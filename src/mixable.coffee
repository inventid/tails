Tails.Mixable =

  include: ( mixins... ) ->
    unless @_includedMixins?.klass is @
      @_includedMixins = _(@_includedMixins).clone() or []
      @_includedMixins.klass = @

    for mixin in mixins when mixin not in @_includedMixins
      for key, value of mixin.InstanceMethods
        @::[key] = value

      @_includedMixins.push mixin
      mixin.included?.apply @

    return @

  extend: ( mixins... ) ->
    unless @_extendedMixins?.klass is @
      @_extendedMixins = _(@_extendedMixins).clone() or []
      @_extendedMixins.klass = @

    for mixin in mixins when mixin not in @_extendedMixins
      for key, value of mixin.ClassMethods
        @[key] = value

      @_extendedMixins.push mixin
      mixin.extended?.apply @

    return @

  concern: ( mixins... ) ->
    @include.apply @, mixins
    @extend.apply  @, mixins
    return @

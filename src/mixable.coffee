Mixable =

  MixableKeywords : ['included', 'extended', 'constructor', 'Interactions', 'InstanceMethods', 'ClassMethods']

  _include : ( mixin ) ->
    if mixin.InstanceMethods?
      funcs = mixin.InstanceMethods
    else if mixin.ClassMethods? # Long style mixin, with no InstanceMethods for us to include
      return
    else # Short style mixin
      funcs = mixin

    for key, value of funcs when key not in @MixableKeywords
      @::[key] = value if value? # Only keys with defined values

    funcs.included?.apply @

  _extend : ( mixin ) ->
    if mixin.ClassMethods?
      funcs = mixin.ClassMethods
    else if mixin.InstanceMethods? # Long style mixin, with no ClassMethods for us to extend
      return
    else # Short style mixin
      funcs = mixin

    for key, value of funcs when key not in @MixableKeywords
      @[key] = value  if value? # Only keys with defined values

    funcs.extended?.apply @

  include: ( mixins... ) ->
    unless @_includedMixins?.klass is @
      @_includedMixins = _(@_includedMixins).clone() or []
      @_includedMixins.klass = @

    for mixin in mixins
      continue if mixin in @_includedMixins
      @_includedMixins.push mixin if mixin?

      @_include(mixin)

      # Apply our interactions with other mixins, if any
      if mixin.Interactions?
        interactions = mixin.Interactions.apply(@)

        # Using _include in stead of include allows the interactions to be overridden dynamically
        @_include interactions if interactions?

    # Apply any interactions of already included mixins
    for mixin in @_includedMixins
      if mixin.Interactions?
        interactions = mixin.Interactions.apply(@)
        if interactions?
          @_include interactions

    return @

  extend: ( mixins... ) ->
    unless @_extendedMixins?.klass is @
      @_extendedMixins = _(@_extendedMixins).clone() or []
      @_extendedMixins.klass = @

    for mixin in mixins
      continue if mixin in @_extendedMixins
      @_extendedMixins.push mixin if mixin?

      @_extend(mixin)

      # Apply our interactions with other mixins, if any
      if mixin.Interactions?
        interactions = mixin.Interactions.apply(@)

        # Using _extend in stead of extend allows the interactions to be overridden dynamically
        @_extend interactions if interactions?

    # Apply any interactions of already extended mixins
    for mixin in @_extendedMixins
      if mixin.Interactions?
        interactions = mixin.Interactions.apply(@)
        if interactions?
          @_extend interactions

    return @

  # extend: ( mixins... ) ->
  #   unless @_extendedMixins?.klass is @
  #     @_extendedMixins = _(@_extendedMixins).clone() or []
  #     @_extendedMixins.klass = @

  #   for mixin in mixins
  #     mixin = mixin.ClassMethods if mixin.ClassMethods?
  #     continue if mixin in @_extendedMixins or mixin.ClassMethods?
  #     for key, value of mixin when key not in Tails.Mixable.MixableKeywords
  #       @[key] = value

  #     @_extendedMixins.push mixin if mixin?
  #     mixin.extended?.apply @

  #   return @

  with: (mixin, funcs = {}) ->
    if @_includedMixins? and mixin in @_includedMixins
      return funcs
    else if @_extendedMixins? and mixin in @_extendedMixins
      return funcs
    else return null


  concern: ( mixins... ) ->
    for mixin in mixins
      @include mixin
      @extend mixin
    return @

module.exports = Mixable

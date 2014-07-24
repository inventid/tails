Tails.Mixable =

  MixableKeywords : ['included', 'extended', 'constructor']

  include: ( mixins... ) ->
    unless @_includedMixins?.klass is @
      @_includedMixins = _(@_includedMixins).clone() or []
      @_includedMixins.klass = @

    for mixin in mixins
      mixin = mixin.InstanceMethods if mixin.InstanceMethods?
      continue if mixin in @_includedMixins or mixin.ClassMethods?
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
      continue if mixin in @_extendedMixins or mixin.ClassMethods?
      for key, value of mixin when key not in Tails.Mixable.MixableKeywords
        @[key] = value

      @_extendedMixins.push mixin
      mixin.extended?.apply @

    return @

  with: (mixin, funcs) ->
    unless @_instanceInteractions?.klass is @
      @_instanceInteractions = _(@_instanceInteractions).clone() or []
      @_instanceInteractions.klass = @

    unless @_classInteractions?.klass is @
      @_classInteractions = _(@_classInteractions).clone() or []
      @_classInteractions.klass = @

    if mixin.InstanceMethods in @_includedMixins and mixin.InstanceMethods not in @_instanceInteractions
      @_instanceInteractions.push mixin.InstanceMethods
      @include mixin.Interactions?.apply @ if mixin.Interactions?
      return funcs

    if mixin.ClassMethods in @_extendedMixins and mixin.ClassMethods not in @_classInteractions
      @_classInteractions.push mixin.ClassMethods
      @extend mixin.Interactions?.apply @ if mixin.Interactions?
      return funcs


    return {}


  concern: ( mixins... ) ->
    for mixin in mixins
      @include mixin.InstanceMethods if mixin.InstanceMethods?
      @extend mixin.ClassMethods if mixin.ClassMethods?
      @concern mixin.Interactions.apply @ if mixin.Interactions?
    return @


# This mixin aids in adding getters and setters onto a class
# Javascript can do this natively, but CoffeeScript lacks the
# syntax for this.
#
Tails.Mixins.DynamicAttributes =

  InstanceMethods:
    getter: ( getters, fn = null ) ->
      if typeof getters is 'string' and fn?
        name = getters
        (getters = {})[name] = fn
      @defineAttribute getter: getters

    setter: ( setters, fn = null ) ->
      if typeof setters is 'string' and fn?
        name = setters
        (setters = {})[name] = fn
      @defineAttribute setter: setters

    lazy: ( attributes, fn = null ) ->
      if typeof attributes is 'string' and fn?
        name = attributes
        (attributes = {})[name] = fn
      for key, fn of attributes
        do ( key, fn ) =>
          @getter key, => @attributes[key] = (@[fn] or fn).call @
          @setter key, ( value ) => delete @attributes[key]; @attributes[key] = value


    defineAttribute: ( params ) ->
      for type, attributes of params when type in ['getter', 'setter']
        for key, fn of attributes
          do ( key, fn ) =>
            map = Object.getOwnPropertyDescriptor(@attributes, key) or configurable: true
            delete @attributes[key]
            delete map.value
            delete map.writable
            if type is 'getter'      then map.get =   ( )       => (@[fn] or fn).call @
            else if type is 'setter' then map.set =   ( value ) => result = (@[fn] or fn).call @, value
            Object.defineProperty @attributes, key, map

  ClassMethods:
    getter: ( getters, fn = null ) ->
      if typeof getters is 'string' and fn?
        name = getters
        (getters = {})[name] = fn
      @before initialize: ( ) -> @getter getters

    setter: ( setters, fn = null ) ->
      if typeof setters is 'string' and fn?
        name = setters
        (setters = {})[name] = fn
      @before initialize: ( ) -> @setter setters

    lazy: ( attributes, fn = null ) ->
      if typeof attributes is 'string' and fn?
        name = attributes
        (attributes = {})[name] = fn
      @before initialize: ( ) -> @lazy attributes

    extended: ( ) ->
      @concern Tails.Mixins.Interceptable

# This mixin aids in adding getters and setters onto a class
# Javascript can do this natively, but CoffeeScript lacks the
# syntax for this.
#
Tails.Mixins.DynamicAttributes =

  InstanceMethods:
    getter: ( getters ) ->
       @defineProperty getter: getters

    setter: ( setters ) ->
      @defineProperty setter: setters

    lazy: ( attributes ) ->
      for key, fn of attributes
        do ( key, fn ) =>
          (getter = {})[key] = ( )       -> return @[key] = fn()
          (setter = {})[key] = ( value ) -> delete @[key]; @[key] = value

          @getter getter
          @setter setter

    defineProperty: ( params ) ->
      for type, attributes of params when type in ['getter', 'setter']
        for key, fn of attributes
          do ( key, fn ) =>
            map = Object.getOwnPropertyDescriptor(@attributes, key) or configurable: true
            if      type is 'getter' then map.get = ( )       => fn.call @
            else if type is 'setter' then map.set = ( value ) => fn.call @, value
            Object.defineProperty @attributes, key, map

  ClassMethods:
    getter: ( getters ) ->
      @before initialize: ( ) -> @getter getters?() or getters

    setter: ( setters ) ->
      @before initialize: ( ) -> @setter setters?() or setters

    lazy: ( attributes ) ->
      @before initialize: ( ) -> @lazy attributes?() or attributes

    extended: ( ) ->
      @concern Tails.Mixins.Interceptable

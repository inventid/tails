#= require core/app

Tails.Mixins.DynamicProperties =

  ObjectMethods:
    getter: ( getters, fn = null ) ->
      @defineProperty('getter', getters, fn)

    setter: ( setters, fn = null ) ->
      @defineProperty('setter', setters, fn)

    defineProperty: ( type, attributes, fn = null ) ->
      if typeof attributes is 'string'
        throw new Error('Function expected but none was given.') unless typeof fn is 'function'
        key = attributes
        attributes = {}
        attributes[key] = fn

      for key, fn of attributes
        do ( key, fn ) =>
          map = Object.getOwnPropertyDescriptor(@, key) or configurable: true
          if    type is 'getter' then map.get = ( )     => fn.call @
          else if type is 'setter' then map.set = ( value ) => fn.call @, value
          Object.defineProperty @, key, map

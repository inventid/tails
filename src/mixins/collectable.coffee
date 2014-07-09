# Creates a collection in which every member of the mixable model
# is stored. Individual models can be retreived via the get class
# method, which also create the model when it's not yet present.
#
Tails.Mixins.Collectable =

  ClassMethods:
    collection: ( ) ->
      unless @_collection?.klass is @
        @_collection = new Tails.Collection null, model: @
        @_collection.klass = @
      return @_collection

    extended: ( ) ->
      @concern Tails.Mixins.Interceptable

      methods = [
        'forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
        'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
        'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
        'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
        'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
        'lastIndexOf', 'isEmpty', 'chain', 'sample', 'add', 'remove','set', 'get',
        'at', 'push', 'pop', 'unshift', 'shift', 'slice', 'sort', 'pluck', 'where',
        'findWhere', 'clone', 'create', 'fetch',
        'on', 'off', 'once', 'trigger', 'listenTo', 'stopListening', 'listenOnce'
      ]

      for key in methods
        do ( key ) =>
          @[key] = ( args... ) ->
            @collection()[key].apply @collection(), args

      @after initialize: ->
        if @id? and @constructor.get(@id)?
          throw new Error("Duplicate #{@constructor.name} for id #{@id}.")
        @constructor.add(@)


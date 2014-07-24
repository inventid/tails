# Creates a collection in which every member of the mixable model
# is stored. Individual models can be retreived via the get class
# method, which also create the model when it's not yet present.
#
Tails.Mixins.Collectable =

  InstanceMethods:
    included: ( ) ->
      @concern Tails.Mixins.Interceptable

      @after initialize: ->
        if @id? and @constructor.collection().get(@id)?
          throw new Error("Duplicate #{@constructor.name} for id #{@id}.")
        @constructor.add(@)

  ClassMethods:
    collection: ( ) ->
      unless @_collection?.klass is @
        @_collection = new Tails.Collection null, model: @
        @_collection.klass = @
      return @_collection

    get: ( id ) ->
      @collection().get(id) or new @ id: id

    extended: ( ) ->
      methods = [
        'forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
        'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
        'reject', 'every', 'all', 'some', 'any', 'contains', 'invoke',
        'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
        'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
        'lastIndexOf', 'isEmpty', 'chain', 'sample', 'add', 'remove','set',
        'at', 'push', 'pop', 'unshift', 'shift', 'slice', 'sort', 'pluck', 'where',
        'findWhere', 'clone', 'create', 'fetch', 'reset', 'urlRoot', 'urlRootRoot',
        'on', 'off', 'once', 'trigger', 'listenTo', 'stopListening', 'listenOnce'
      ]

      for key in methods
        do ( key ) =>
          @[key] = ( args... ) ->
            @collection()[key].apply @collection(), args


  # Interactions: () ->
  #   ClassMethods:
  #     @with Tails.Mixins.History,
  #       extended: () ->
  #         # @collection().on 'add remove', ( model ) => @store() if model.id?

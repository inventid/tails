# Creates a collection in which every member of the mixable model
# is stored. Individual models can be retreived via the get class
# method, which also create the model when it's not yet present.
#
Tails.Mixins.Collectable =

  ClassMethods:
    all: ( ) ->
      unless @_all?.klass is @
        @_all = new Tails.Collection null, model: @
        @_all.klass = @
      return @_all

    get: ( id ) ->
      return @all().get(id) or new @(id: id)

  extended: ( ) ->
    @concern Tails.Mixins.Interceptable
    @after initialize: ->
      if @id? and @constructor.all().get(@id)?
        throw new Error("Duplicate #{@constructor.name} for id #{@id}.")
      @constructor.all().add(@)

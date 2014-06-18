#= require core/app
#= require core/collection
#= require mixins/interceptable

# Creates a collection in which every member of the mixable model
# is stored. Individual models can be retreived via the get class
# method, which also create the model when it's not yet present.
#
Tails.Mixins.Collectable =

    ClassMethods:
        all: ( ) ->
            unless @_all?.klass is @
                @_all = new App.Collection null, model: @
                @_all.klass = @
            return @_all

        get: ( id ) ->
            return @all().get(id) or new @(id: id)

        create: ( args... ) ->
            all().create.apply @, args

    extended: ( ) ->
        @extend App.Mixins.Interceptable

        @after initialize: ->
            throw new Error("Duplicate #{@constructor.name} for id #{@id}.") if @constructor.all().get(@id)?
            @constructor.all().add(@)

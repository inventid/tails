# Creates a collection in which every member of the mixable instance
# is stored. Individual instances can be retreived via the get class
# method, which also create the instance when it's not yet present.
#

Interceptable = require('./interceptable')
Collection    = require('../collection')
Storage       = require('./storage')

Collectable =

  InstanceMethods:
    included: ( ) ->
      @concern Interceptable

      @after initialize: ->
        if @id? and @constructor.all().get(@id)?
          throw new Error("Duplicate #{@constructor.name} for id #{@id}.")
        @constructor.all().add(@)

  ClassMethods:
    all: ( ) ->
      unless @_all?.klass is @
        @_all = new Collection null, model: @
        @_all.klass = @
      return @_all

    get: ( id ) ->
      @all().get(id) or new @ id: id

    scope: ( name, options ) ->
      @[name] = @all().where(options.where)

  Interactions: () ->
    ClassMethods:
      @with Storage,
        extended: () ->
          @all().on 'add remove', ( instance ) =>
            @store() if instance.id?

module.exports = Collectable

# Gives classes and instances the ability to store data in a
# storage. By default all data will be stored in localStorage.
#
Tails.Mixins.Storage =

  InstanceMethods:
    storage: ( ) ->
        return @constructor.storage()

    indexRoot: ( ) ->
      @constructor.indexRoot()

    store: ( data ) ->
      @constructor.store @, data

    retrieve: ( hash ) ->
      _.defaults @attributes, @constructor.retrieve @id, hash

    included: ( ) ->
      @concern Tails.Mixins.Interceptable

      @after initialize: ->
        @on "sync", @store
        @retrieve() # To retrieve any previous attribute values
        @store() # To save any new attribute values that were passed to initialize


  ClassMethods:
    storage: ( ) ->
        return localStorage

    toJSON: ( obj ) ->
      if obj.has?("$el")
        obj.get("$el").toJSON = () ->
          @clone().wrap('<div/>').parent().html()

      JSON.stringify obj

    indexRoot: ( ) ->
      return inflection.transform(@name, ['underscore', 'pluralize'])

    store: ( instance, data ) ->
      return unless instance? and instance.id?
      indexRoot = @indexRoot?() ? @indexRoot
      key = "#{indexRoot}/#{instance.id}"
      if data?
        key += "/"+Tails.Utils.Hash @toJSON data
        json = @toJSON
          "instance" : instance
          "data" : data
      else
        json = @toJSON instance
      @storage().setItem key, json
      return key

    retrieve: ( id, hash ) ->
      indexRoot = @indexRoot?() ? @indexRoot
      if id?
        key = "#{indexRoot}/#{id}"
        key += "/#{hash}" if hash?
        json = @storage().getItem key
        JSON.parse json if json?
      else
        json = @storage().getItem Tails.Utils.Hash indexRoot
        ids = JSON.parse json
        @retrieve id for id in ids if json?
        return ids

  Interactions: () ->
    InstanceMethods: @with Tails.Mixins.Debug,
      included : () =>
        @after initialize: () ->
          console.log @toJSON @name
          @after store: () ->
            @log "Stored instances", @constructor.all().pluck("id")

    ClassMethods:
      @with Tails.Mixins.Collectable,
        indexRoot: ( ) ->
          return @urlRoot?() ? @urlRoot
        extended: () ->
          @after store: () ->
            key = @indexRoot?() ? @indexRoot
            json = @toJSON @constructor.all().pluck("id")
            @constructor.storage().setItem key, json

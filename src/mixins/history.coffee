# Gives a class the ability to easily retrieve and restore the
# history of instances and gives each instance the abitlity to
# easily track it's own changes.
#
Tails.Mixins.History =

  InstanceMethods:
    diff: ( ) ->
      diff = {}
      prevAttrs = @constructor.retrieve(@id) or {}
      for key, value of @attributes
        if prevAttrs[key] isnt @get key
          if prevAttrs[key]?
            diff[key] = "update":
              "old" : prevAttrs[key]
              "new" : @get key
          else
            diff[key] = "create":
              "value" : @get key

      for key, value of prevAttrs
        if not @has key
            diff[key] = "delete":
              "value" : value

      func = () ->
        # console.log "Applying diff to instance #{@id} of", @constructor.name, JSON.stringify diff
        for key, change of diff
          for type, values of change
            switch type
              when "create"
                @set key, values["value"]
              when "update"
                @set key, values["new"]
              when "delete"
                @unset key
        return @

      return func

    storage: ( ) ->
        return @constructor.storage()

    indexRoot: ( ) ->
      @constructor.indexRoot()


    store: ( ) ->
      @constructor.store @

    retrieve: ( ) ->
      _.defaults @attributes, @constructor.retrieve @id

    included: ( ) ->
      @concern Tails.Mixins.Interceptable

      @after initialize: ->
        @on "sync", @store
        @retrieve()
        @store()
        # @on "change", @store

  ClassMethods:
    storage: ( ) ->
        return localStorage

    indexRoot: ( ) ->
      return "test"
      return inflection.transform(@name, ['underscore', 'pluralize'])

    store: ( instance ) ->
      return unless instance?
      indexRoot = @indexRoot?() ? @indexRoot
      key = "#{indexRoot}/#{instance.id}"
      json = JSON.stringify instance
      @storage().setItem key, json

    retrieve: ( id ) ->
      indexRoot = @indexRoot?() ? @indexRoot
      if id?
        key = "#{indexRoot}/#{id}"
        json = localStorage.getItem key
        JSON.parse json if json?
      else
        json = @storage().getItem indexRoot
        ids = JSON.parse json
        @retrieve id for id in ids if json?
        return ids


  Interactions: () ->
    ClassMethods:
      @with Tails.Mixins.Collectable,
        indexRoot: ( ) ->
          return @urlRoot?() ? @urlRoot
        extended: () ->
          @after store: () ->
            key = @indexRoot?() ? @indexRoot
            json = JSON.stringify @constructor.pluck("id")
            @constructor.storage().setItem key, json

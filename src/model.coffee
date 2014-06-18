class Tails.Model extends Backbone.Deferred.Model
    _.extend @, Tails.Mixable
    @concern Tails.Mixins.DynamicProperties

    syncing: false
    dataType: 'json'

    initialize: ( attrs = {}, options = {} ) ->
        @parent = options.parent or @parent
        @synced = options.synced or false

        # Create getters and setters for each attribute
        # of the model, by listening to change events
        # and calling the appropriate methods.
        @on 'change', ( model ) =>
            @synced = false
            for key, prop of model.changed when not @hasOwnProperty(key.camelize(true))
                do ( key ) =>
                    @getter key.camelize(true), ( ) => @get(key)
                    @setter key.camelize(true), ( value ) => @set(key, value)

        # Store when the model has been synced. Future fetches
        # will immediatly resolve.
        @on 'sync', -> @synced = true

        super

    urlRoot: ( ) ->
        return '/' + @constructor.name.pluralize().underscore()

    url: ( ) ->
        base = @parent?.url?() or @parent?.url or Tails.url
        root = @urlRoot?() or @urlRoot
        id = if @id then "/#{@id}" else ''
        format = if @format? then '.' + (@format?() or @format) else ''

        url = "#{base}#{root}#{id}#{format}"
        return url

    # Fetch the model from the server. Overrides
    # Backbone.Deferred.Model.prototype.fetch for two reasons:
    # we want to be able to skip fetches when the model was already
    # synced, and we want to specify the dataType.
    fetch: ( options = {} ) ->
        if @synced and not options.force
            return @_fetchPromise

        _.defaults options, dataType: @format
        fetchPromise = super options

        @synced = false
        @syncing = true

        deferred = Q.defer()

        resolve = ( args... ) =>
            @syncing = false
            deferred.resolve.apply deferred, args

        fetchPromise.then ( args... ) =>
            if @synced then resolve.apply @, args
            else @once 'sync', -> resolve.apply @, args
        fetchPromise.fail ( args... ) =>
            deferred.reject.apply deferred, args

        return @_fetchPromise = deferred.promise

    save: ( options = {} ) ->
        if @synced and not options.force
            return @_fetchPromise

        _.defaults options, dataType: @format
        fetchPromise = super options

        @synced = false
        @syncing = true

        deferred = Q.defer()

        resolve = ( args... ) =>
            @syncing = false
            deferred.resolve.apply deferred, args

        fetchPromise.then ( args... ) =>
            if @synced then resolve.apply @, args
            else @once 'sync', -> resolve.apply @, args
        fetchPromise.fail ( args... ) =>
            deferred.reject.apply deferred, args

        return @_fetchPromise = deferred.promise

    toJSON: ( ) ->
        return _.omit @attributes, @_blacklistedAttributes

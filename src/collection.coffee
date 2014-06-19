 class Tails.Collection extends Backbone.Deferred.Collection
  _.extend(@, Tails.Mixable)

  model: null
  syncing: false
  dataType: 'json'

  initialize: ( models = null, options = {} ) ->
    @model = options.model or @model or Tails.Models[@constructor.name.singularize()] or Tails.Model
    @parent = options.parent or @parent
    @synced = options.synced or false

    # Store when the model has been synced. Future fetches
    # will immediatly resolve.
    @on 'sync', -> @synced = true

    super

  urlRoot: ( ) ->
    return '/' + @model.name.pluralize().underscore()

  url: ( ) ->
    base = @parent?.url?() or @parent?.url or Tails.url
    root = @urlRoot?() or @urlRoot
    format = if @format? then '.' + (@format?() or @format) else ''

    url = "#{base}#{root}#{format}"
    return url

  # Fetch the collection from the server. Overrides
  # Backbone.Deferred.Collection.prototype.fetch for two reasons:
  # we want to be able to skip fetches when the model was already
  # synced, and we want to specify the dataType.
  fetch: ( options = {} ) ->
    if @synced and not options.force
      return @_fetchPromise

    @syncing = true
    @synced = false

    _.defaults options, dataType: @format
    fetchPromise = super options

    deferred = Q.defer()
    resolve = =>
      @syncing = false
      deferred.resolve(@)

    fetchPromise.then =>
      if @synced then resolve()
      else @once 'sync', -> resolve()

    return @_fetchPromise = deferred.promise

  # Parse the response sent by the server to generate the models.
  # This will be called by Backbone when it processes the results
  # retreived from the server.
  parse: ( response, options ) ->
    models = []
    for attrs in response
      if attrs instanceof Backbone.Model
        models.push(attrs)
        break

      model = @model.get attrs.id
      model.set attrs
      model.synced = true

      models.push(model)
    return models

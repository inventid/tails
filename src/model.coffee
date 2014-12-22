class Tails.Model extends Backbone.Deferred.Model
  _.extend @, Tails.Mixable
  @concern Tails.Mixins.Associable

  syncedAt: 0

  initialize: ( attrs = {}, options = {} ) ->
    @parent = options.parent or @parent or @collection?.parent
    @synced = options.synced or false

    @on 'change', ( model ) =>
      @synced = false

    @on 'sync', =>
      @synced   = true
      @syncedAt = Date.now()

    super

  urlRoot: ( ) ->
    return inflection.transform(@constructor.name, ['underscore', 'pluralize'])

  url: ( ) ->
    base = @parent?.url?() or @parent?.url or Tails.config.url
    root = @urlRoot?() or @urlRoot
    id = if @id then "/#{@id}" else ''
    format = if @format? then '.' + (@format?() or @format) else ''

    url = "#{base}/#{root}#{id}#{format}"
    return url

  fetch: ( options = {} ) ->
    unless options.force
      if @syncing
        return @_fetchPromise
      else if @synced
        deferred = Q.defer()
        deferred.resolve()
        return deferred.promise

    options.dataType ||= @format
    fetchPromise = super options

    @synced  = false
    @syncing = true
    deferred = Q.defer()

    resolve = ( args... ) =>
      @syncing = false
      deferred.resolve.apply deferred, args

    reject = ( args... ) =>
      @syncing = false
      deferred.reject.apply deferred, args

    fetchPromise.then ( args... ) =>
      if   @synced then     resolve args...
      else @once 'sync', -> resolve args...

    fetchPromise.fail ( args... ) =>
      reject args...

    return @_fetchPromise = deferred.promise

  save: ( options = {} ) ->
    super _.defaults options, dataType: @format

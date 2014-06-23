class Tails.Collection extends Backbone.Deferred.Collection
  _.extend @, Tails.Mixable

  format: 'json'

  initialize: ( models = null, options = {} ) ->
    @model = options.model or @model or Tails.Model
    @parent = options.parent or @parent
    super

  urlRoot: ( ) ->
    return inflection.transform(@model.name, ['underscore', 'pluralize'])

  url: ( ) ->
    base = @parent?.url?() or @parent?.url or Tails.url
    root = @urlRoot?() or @urlRoot
    format = if @format? then '.' + (@format?() or @format) else ''

    url = "#{base}/#{root}#{format}"
    return url

  fetch: ( options = {} ) ->
    super _.defaults options, dataType: @format

  parse: ( response, options ) ->
    models = []
    for attrs in response
      if attrs instanceof Backbone.Model
        models.push(attrs)
        break

      # To avoid creating duplicate models, we check
      # if the model we're trying to create already
      # exists. If it does, we merge its attributes
      # with the ones we received from the server.
      model = @model.get attrs.id
      model.set attrs
      models.push(model)
    return models

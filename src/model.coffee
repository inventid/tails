class Tails.Model extends Backbone.Deferred.Model
  _.extend @, Tails.Mixable
  @concern Tails.Mixins.Associable

  format: 'json'

  initialize: ( attrs = {}, options = {} ) ->
    @parent = options.parent or @parent or @collection?.parent
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
    super _.defaults options, dataType: @format

  save: ( options = {} ) ->
    super _.defaults options, dataType: @format

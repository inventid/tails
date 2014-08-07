class Tails.Collection extends Backbone.Deferred.Collection
  _.extend @, Tails.Mixable

  format: 'json'

  constructor: ( models = [], options = {} ) ->
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

  filter: ( filter ) ->
    return new Tails.Collection.Filtered(@, filter: filter)

  where: ( attrs, first ) ->
    return super attrs, first if first?
    if typeof attrs is 'object'
      filter = ( model ) ->
        for key, value of attrs
          return false if model.get(key) isnt value
        return true

      assimilate = ( model ) ->
        for key, value of attrs
          model.set(key, value)

      distantiate = ( model ) ->
        for key, value of attrs
          model.unset(key)

      return new Tails.Collection.Filtered(@, { filter: filter, assimilate: assimilate, distantiate: distantiate })

    else if typeof attrs is 'string'
      key = attrs
      query =
        is: ( value ) =>
          (selector = {})[key] = value
          return (((@_where ||= {})[key] ||= {}).is ||= {})[value] ||= @where selector

        in: ( values ) =>
          return @filter ( model ) -> model.get(key) in values

        atLeast: ( value ) =>
          return @filter ( model ) -> model.get(key) >= value

        atMost: ( value ) =>
          return @filter ( model ) -> model.get(key) <= value

        greaterThan: ( value ) =>
          return @filter ( model ) -> model.get(key) > value

        lessThan: ( value ) =>
          return @filter ( model ) -> model.get(key) < value

      return query

  pluck: ( attribute ) ->
    return new Tails.Collection.Plucked(@, attribute: attribute)

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



# TODO: I think this isn't a pretty way to do it. Maybe we should
# create collections that can contain other things than models.
class Tails.Collection.Plucked extends Tails.Collection

  constructor: ( collection, options = {} ) ->
    @collection = collection
    @attribute = options.attribute
    @length = 0

    super [], options

    @collection.each ( model ) =>
      @trigger 'add', model.get @attribute

    @listenTo collection, "change:#{@attribute}", ( model ) =>
      value = model.get @attribute
      previousValue = model.previous @attribute

      @trigger('remove', previousValue) if previousValue?
      @trigger('add', value) if value?

    @listenTo collection, 'add', ( model ) =>
      value = model.get @attribute
      @trigger('add', value) if value?
      @length++

    @listenTo collection, 'remove', ( model ) =>
      value = model.get @attribute
      @trigger('remove', value) if value?
      @length--

  contains: ( value ) ->
    return value in @toArray()

  include: ( args... ) ->
    @contains.apply @, args

  each: ( fn ) ->
    @collection.each ( model ) =>
      fn(model.get @attribute)

  forEach: ( args... ) ->
    @each.apply @, args

  toArray: ( ) ->
    return (model.get(@attribute) for model in @collection.toArray())



class Tails.Collection.Filtered extends Tails.Collection

  constructor: ( collection, options = {} ) ->
    @collection = collection
    @model = @collection.model

    @filter = options.filter
    @assimilate = options.assimilate
    @distantiate = options.distantiate

    super([], options)

    @collection.each ( model ) =>
      @add(model) if @filter(model)

    @listenTo @collection, 'add', ( model ) =>
      @add(model) if @filter(model)

    @listenTo @collection, 'remove', ( model ) =>
      @remove(model)

    @listenTo @collection, 'change', ( model ) =>
      if @filter(model) then @add(model)
      else @remove(model)

    @on 'add', ( model ) =>
      return if @filter(model)
      unless @assimilate?
        @remove(model)
        throw Error("Cannot assimilate model.")
      @assimilate(model)
      @collection.add(model)

    @on 'remove', ( model ) =>
      return if not @collection.contains(model)
      return if not @filter(model)
      unless @distantiate?
        @add(model)
        throw Error("Cannot distantiate model.")
      @distantiate(model)



class Tails.Collection.Mirror extends Tails.Collection.Filtered
  constructor: ( collection, options = {} ) ->
    options.filter = -> true
    super collection, options



class Tails.Collection.Multi extends Tails.Collection

  constructor: ( collections = [], options = {} ) ->
    @collections = []
    @modelCounts = {}

    super([], options)

    # if collections instanceof Tails.Collection.Plucked
    #   @collections = collections
    #   collections = @collections.toArray()

    #   @collections.on 'add',    @addCollection
    #   @collections.on 'remove', @removeCollection

    @addCollection(collection) for collection in collections

  increment: ( model ) ->
    @modelCounts[model.cid] ||= 0
    return ++@modelCounts[model.cid]

  decrement: ( model ) ->
    @modelCounts[model.cid] ||= 0
    return --@modelCounts[model.cid]

  addCollection: ( collection ) ->
    return unless collection instanceof Backbone.Collection

    @model ||= collection.model

    @collections.push(collection)
    collection.each ( model ) =>
      @increment model

    @listenTo collection, 'add', @increment
    @listenTo collection, 'remove', @decrement
    @trigger 'addCollection', collection

  removeCollection: ( collection ) ->
    return unless collection instanceof Backbone.Collection

    index = @collections.indexOf(collection)
    return unless index >= 0
    @collections = @collections.slice(0, index).concat(@collections.slice(index + 1, @collections.length))

    collection.each ( model ) =>
      @decrement model

    @stopListening collection
    @trigger 'removeCollection', collection



class Tails.Collection.Union extends Tails.Collection.Multi

  increment: ( model ) ->
    @add model if super is 1

  decrement: ( model ) ->
    @remove model if super is 0



# class Tails.Collection.Intersection extends Tails.Collection.Multi

#   constructor: ( ) ->
#     super
#     @on 'addCollection removeCollection', ( ) =>
#       for cid, count of @modelCounts
#         @add @model.all().get(cid) if count is @collections.length
#         @remove @get(cid) if count isnt @collections.length

#   increment: ( model ) ->
#     @add model if super is @collections.length
#     @remove model if super isnt @collections.length

#   decrement: ( model ) ->
#     @add model if super is @collections.length
#     @remove model if super isnt @collections.length



# class Tails.Collection.Difference extends Tails.Collection.Multi

#   increment: ( model ) ->
#     @add model if super is 1
#     @remove model if super is 2

#   decrement: ( model ) ->
#     @add model if super is 1
#     @remove model if super is 0


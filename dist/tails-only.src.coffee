Tails =
  Mixins: {}
  Utils: {}
  Associations: {}

  Models: {}
  Views:  {}

  config:
    url: 'http://localhost'

Tails.Utils.Hash = ( string ) ->
  # Taken from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  hash = 0;
  return hash if string.length is 0

  for i in [0...string.length]
    char = string.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash # Convert to 32bit integer

  return hash


# This mixin mainly serves as a helper to other mixins. It allows
# them to execute code before or after a method is invoked. The bulk
# of this mixin's complexity is due to the fact that one might want
# to set an interceptor before the interceptable method is defined, or
# that it might not be defined at all! This is why we strategically
# place setters and getters on the @ect, so that when the class gets
# to the point where it defines the interceptable method, the setter
# will replace itself with the interceptable method wrapped by the
# interceptors. Chaining of interceptors also proved to be a challenge
# in this scenario.
#
Tails.Mixins.Interceptable =

  InstanceMethods:
    before: ( interceptors ) ->
      @intercept before: interceptors

    after: ( interceptors ) ->
      @intercept after: interceptors

    intercept: ( params ) ->
      klass = @constructor
      for placement, interceptors of params when placement in ['before', 'after']

        # Map functions in interceptors.these to the
        # functions in interceptors.do
        if interceptors.these?
          for key in interceptors.these

            # Find the key of functions passed as
            # actual function, instead of string.
            (key = k; break) for k, v of @ when key is v if typeof key is 'function'
            interceptors[key] = interceptors.do

        # Exclude previously processed these and do
        # keywords from interceptors.
        interceptors = _(interceptors).omit('these', 'do')
        for key, fns of interceptors

          # Fns might or might not be an array. Convert it
          # into one when it's not.
          fns = [fns] unless _(fns).isArray()
          for fn in fns
            do ( key, fn ) =>

              # The ideal case: the method we want to intercept
              # already exists. In this case, we wrap the method
              # with the before or after interceptor function.
              if (@hasOwnProperty(key) or klass::hasOwnProperty(key)) and
                  not (@[key].before? or @[key].after?)
                interceptable = @[key]
                @[key] = ( args... ) ->
                  (@[fn] or fn).apply @, args if placement is 'before'
                  ret = interceptable.apply @, args
                  (@[fn] or fn).apply @, args if placement is 'after'
                  return ret

              # If the interceptable method isn't yet defined, things
              # are a bit more difficult. By creating a setter and
              # a getter on the key of that method, we are able to
              # intercept when the method eventually gets defined, and
              # wrap it at that point.
              else
                # This might not be the first time we define an interceptor
                # on this yet-to-be defined method. So we need to chain these
                # too.
                before = if @[key]?.klass is klass then @[key]?.before
                after  = if @[key]?.klass is klass then @[key]?.after

                if placement is 'before'
                  prev = before
                  before = ( args... ) ->
                    prev?.apply @, args
                    (@[fn] or fn).apply @, args

                else if placement is 'after'
                  prev = after
                  after = ( args... ) ->
                    (@[fn] or fn).apply @, args
                    prev?.apply @, args

                Object.defineProperty @, key,
                  configurable: true

                  # Wrap the interceptable that is defined
                  # by when calling the following setter.
                  set: ( interceptable ) ->
                    # TODO: Look into this. This seems to be
                    # the only way to avoid call stack size
                    # exceptions.
                    Object.defineProperty @, key,
                      writable: true
                      value: ( args... ) ->
                        before?.apply @, args
                        ret = interceptable.apply @, args
                        after?.apply @, args
                        return ret

                  # In case the method won't get defined at
                  # all, we wrap our super's method by the
                  # interceptors.
                  get: ( ) ->
                    interceptor = ( args... ) ->
                      before?.apply @, args
                      superFn = @constructor.__super__?[key]
                      ret = superFn?.apply @, args unless superFn?.klass is klass
                      after?.apply @, args
                      return ret

                    interceptor.before = before
                    interceptor.after = after
                    interceptor.klass = klass
                    return interceptor

  ClassMethods:
    before: ( interceptors ) ->
      if interceptors?()?
        @before initialize: -> @before interceptors.call @
      else @::before interceptors

    after: ( interceptors ) ->
      if interceptors?()?
        @before initialize: -> @after interceptors.call @
      else @::after interceptors


# Makes classes print a log message after instantiation of a new
# instance and instances print a log message after an attribute changes.
#
Tails.Mixins.Debug =

  InstanceMethods:
    LOG_LEVELS :
      "ERROR"   : on
      "WARNING" : on
      "INFO"    : off

    _excludedMethods : _.union Object.keys(Tails.Mixins.Interceptable.InstanceMethods), [
      "constructor", "log", "message", "warn", "error", "info"
    ]

    debug: () ->
      @LOG_LEVELS.INFO = on

    message: (things...) ->
      line = "#{new Date()} - "
      for thing in things
        if thing.constructor.name is "String"
          line += thing + " "
        else
          line += JSON.stringify(thing) + " "

      line+= "in #{@constructor.name}(#{@id})"
      return line

    error: ( things... ) ->
      return unless @LOG_LEVELS.ERROR
      line = @message things...
      console.error line

    warn: ( things... ) ->
      return unless @LOG_LEVELS.WARNING
      line = @message things...
      console.warn line

    log: ( things... ) ->
      line = @message things...
      console.log line

    info: ( things... ) ->
      return unless @LOG_LEVELS.INFO
      line = @message things...
      console.log line


    included: ( ) ->
      @concern Tails.Mixins.Interceptable

      @after initialize: (args...) ->
        @info "Called function 'initialize' of #{@constructor.name} with arguments:", args

        @on "change", (event) =>
          @info "Change of attributes:", event.changedAttributes()

        funcs = for key, value of @
          if value instanceof Function and key not in @_excludedMethods
            key
          else continue

        for key in funcs
          do (key) =>
            @after "these": [key], "do" : (args...) ->
              @info "Called function '#{key}' of #{@constructor.name} with arguments:", args

Tails.Mixable =

  MixableKeywords : ['included', 'extended', 'constructor', 'Interactions', 'InstanceMethods', 'ClassMethods']

  _include : ( mixin ) ->
    if mixin.InstanceMethods?
      funcs = mixin.InstanceMethods
    else if mixin.ClassMethods? # Long style mixin, with no InstanceMethods for us to include
      return
    else # Short style mixin
      funcs = mixin

    for key, value of funcs when key not in Tails.Mixable.MixableKeywords
      @::[key] = value if value? # Only keys with defined values

    funcs.included?.apply @

  _extend : ( mixin ) ->
    if mixin.ClassMethods?
      funcs = mixin.ClassMethods
    else if mixin.InstanceMethods? # Long style mixin, with no ClassMethods for us to extend
      return
    else # Short style mixin
      funcs = mixin

    for key, value of funcs when key not in Tails.Mixable.MixableKeywords
      @[key] = value  if value? # Only keys with defined values

    funcs.extended?.apply @

  include: ( mixins... ) ->
    unless @_includedMixins?.klass is @
      @_includedMixins = _(@_includedMixins).clone() or []
      @_includedMixins.klass = @

    for mixin in mixins
      continue if mixin in @_includedMixins
      @_includedMixins.push mixin if mixin?

      @_include(mixin)

      # Apply our interactions with other mixins, if any
      if mixin.Interactions?
        interactions = mixin.Interactions.apply(@)

        # Using _include in stead of include allows the interactions to be overridden dynamically
        @_include interactions if interactions?

    # Apply any interactions of already included mixins
    for mixin in @_includedMixins
      if mixin.Interactions?
        interactions = mixin.Interactions.apply(@)
        if interactions?
          @_include interactions 

    return @

  extend: ( mixins... ) ->
    unless @_extendedMixins?.klass is @
      @_extendedMixins = _(@_extendedMixins).clone() or []
      @_extendedMixins.klass = @

    for mixin in mixins
      continue if mixin in @_extendedMixins
      @_extendedMixins.push mixin if mixin?
      
      @_extend(mixin)

      # Apply our interactions with other mixins, if any
      if mixin.Interactions?
        interactions = mixin.Interactions.apply(@)

        # Using _extend in stead of extend allows the interactions to be overridden dynamically
        @_extend interactions if interactions?

    # Apply any interactions of already extended mixins
    for mixin in @_extendedMixins
      if mixin.Interactions?
        interactions = mixin.Interactions.apply(@)
        if interactions?
          @_extend interactions 

    return @

  # extend: ( mixins... ) ->
  #   unless @_extendedMixins?.klass is @
  #     @_extendedMixins = _(@_extendedMixins).clone() or []
  #     @_extendedMixins.klass = @

  #   for mixin in mixins
  #     mixin = mixin.ClassMethods if mixin.ClassMethods?
  #     continue if mixin in @_extendedMixins or mixin.ClassMethods?
  #     for key, value of mixin when key not in Tails.Mixable.MixableKeywords
  #       @[key] = value

  #     @_extendedMixins.push mixin if mixin?
  #     mixin.extended?.apply @

  #   return @

  with: (mixin, funcs = {}) ->
    if mixin in @_includedMixins or mixin in @_extendedMixins
      return funcs 
    else
      return null


  concern: ( mixins... ) ->
    for mixin in mixins
      @include mixin
      @extend mixin
    return @


# This mixin aids in adding getters and setters onto a class
# Javascript can do this natively, but CoffeeScript lacks the
# syntax for this.
#
Tails.Mixins.DynamicAttributes =

  InstanceMethods:
    getter: ( getters, fn = null ) ->
      if typeof getters is 'string' and fn?
        name = getters
        (getters = {})[name] = fn
      @defineAttribute getter: getters

    setter: ( setters, fn = null ) ->
      if typeof setters is 'string' and fn?
        name = setters
        (setters = {})[name] = fn
      @defineAttribute setter: setters

    lazy: ( attributes, fn = null ) ->
      if typeof attributes is 'string' and fn?
        name = attributes
        (attributes = {})[name] = fn
      for key, fn of attributes
        do ( key, fn ) =>
          @getter key, => @attributes[key] = (@[fn] or fn).call @
          @setter key, ( value ) => delete @attributes[key]; @attributes[key] = value


    defineAttribute: ( params ) ->
      for type, attributes of params when type in ['getter', 'setter']
        for key, fn of attributes
          do ( key, fn ) =>
            map = Object.getOwnPropertyDescriptor(@attributes, key) or configurable: true
            delete @attributes[key]
            delete map.value
            delete map.writable
            if type is 'getter'      then map.get =   ( )       => (@[fn] or fn).call @
            else if type is 'setter' then map.set =   ( value ) => result = (@[fn] or fn).call @, value
            Object.defineProperty @attributes, key, map

  ClassMethods:
    getter: ( getters, fn = null ) ->
      if typeof getters is 'string' and fn?
        name = getters
        (getters = {})[name] = fn
      @before initialize: ( ) -> @getter getters

    setter: ( setters, fn = null ) ->
      if typeof setters is 'string' and fn?
        name = setters
        (setters = {})[name] = fn
      @before initialize: ( ) -> @setter setters

    lazy: ( attributes, fn = null ) ->
      if typeof attributes is 'string' and fn?
        name = attributes
        (attributes = {})[name] = fn
      @before initialize: ( ) -> @lazy attributes

    extended: ( ) ->
      @concern Tails.Mixins.Interceptable

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


# Creates a collection in which every member of the mixable instance
# is stored. Individual instances can be retreived via the get class
# method, which also create the instance when it's not yet present.
#
Tails.Mixins.Collectable =

  InstanceMethods:
    included: ( ) ->
      @concern Tails.Mixins.Interceptable

      @after initialize: ->
        if @id? and @constructor.all().get(@id)?
          throw new Error("Duplicate #{@constructor.name} for id #{@id}.")
        @constructor.all().add(@)

  ClassMethods:
    all: ( ) ->
      unless @_all?.klass is @
        @_all = new Tails.Collection null, model: @
        @_all.klass = @
      return @_all

    get: ( id ) ->
      @all().get(id) or new @ id: id

    scope: ( name, options ) ->
      @[name] = @all().where(options.where)

  Interactions: () ->
    ClassMethods:
      @with Tails.Mixins.Storage,
        extended: () ->
          @all().on 'add remove', ( instance ) =>
            @store() if instance.id?

class Tails.Associations.Relation extends Backbone.Model
  _.extend @, Tails.Mixable
  @concern Tails.Mixins.DynamicAttributes
  @concern Tails.Mixins.Collectable

  initialize: ( ) ->
    # destroyer = ( ) =>
    #   @stopListening @get('owner')
    #   @stopListening @get('target')
    #   @trigger 'destroy'

    # @listenTo @get('owner'), 'destroy', destroyer
    # unless @get('target') instanceof Backbone.Collection
    #   @listenTo @get('target'), 'destroy', destroyer





class Tails.Associations.BelongsToRelation extends Tails.Associations.Relation

  initialize: ( ) ->
    association = @get 'association'
    to          = association.get 'to'
    foreignKey  = @get 'foreignKey'
    owner       = @get 'owner'

    # Create setters and getters for the property specified
    # by name. These will return the model with
    # our foreignKey, or set our foreignKey respectively.
    @getter target: ( ) -> to.all().get(owner.get(foreignKey))
    @setter target: ( model ) ->
      unless model?
        @set foreignKey, null
        return
      unless to.all().get(model.id)?
        to.all().create(model)
      owner.set foreignKey, model.id

    super

class Tails.Associations.HasOneRelation extends Tails.Associations.Relation

  initialize: ( ) ->
    owner       = @get 'owner'
    association = @get 'association'
    to          = association.get 'to'

    foreignKey  = @get 'foreignKey'
    through     = @get 'through'
    source      = @get 'source'

    if not through?
      @getter target: ( ) => to.all().where(foreignKey).is(owner.id).first()
      @setter target: ( model ) =>
        to.all().where(foreignKey).is(owner.id).first()?.unset foreignKey
        model.set foreignKey, owner.id

     else
      @getter target: ( ) => owner.get(through).get source
      @setter target: ( model ) => owner.get(through).set source, model

    super


class Tails.Associations.HasManyRelation extends Tails.Associations.Relation

  initialize: ( ) ->
    association = @get('association')
    to          = association.get('to')
    owner       = @get('owner')

    name        = @get('name')
    foreignKey  = @get('foreignKey')
    through     = @get('through')
    source      = @get('source')

    if not through? then @lazy target: => to.all().where(foreignKey).is(owner.id)

    # We're dealing with a through association. We have three kinds of hasMany through associations:
    # 1. The through association is a singular association (belongsTo, hasOne). In this case
    #    we create a getter on the owner that points to the source on the through association.
    # 2. It's a plural association (hasMany) and the source association is singular. We then pluck
    #    the sources from the colleciton of through associations.
    # 3. It's a plural association and the source association is plural as well. We create a union
    #    and add or remove the individual collections.
    # TODO: Write this a bit clearer. The code could maybe be written a bit nicer as well.
    else
      throughAssociation = owner.constructor.associations().findWhere(name: through)
      if throughAssociation.get('type') isnt 'hasMany'
        @getter target: => owner.get(through).get(source or name)

      else
        sourceAssociation = (source and throughAssociation.get('to').associations().findWhere(name: source)) or
                         throughAssociation.get('to').associations().findWhere(name: name, type: 'hasMany') or
                         throughAssociation.get('to').associations().findWhere(name: inflection.singularize(name))
        if sourceAssociation.get('type') is 'hasMany'
          source = sourceAssociation.get('name')
          @lazy target: ->
            union = new Tails.Collection.Union()
            owner.get(through).each         ( model ) => union.addCollection model.get(source)
            owner.get(through).on 'add',    ( model ) => union.addCollection model.get(source)
            owner.get(through).on 'remove', ( model ) => union.removeCollection model.get(source)
            return union
        else
          source = sourceAssociation.get('name')
          @lazy target: -> owner.get(through).pluck(source)

class Tails.Associations.Association extends Backbone.Model
  _.extend @, Tails.Mixable
  @concern Tails.Mixins.Debug
  @concern Tails.Mixins.DynamicAttributes
  @concern Tails.Mixins.Collectable

  relations: ( ) ->
    unless @_relations?
      @_relations = new Tails.Collection [], model: Tails.Associations.Relation
    return @_relations

  apply: ( owner ) ->
    attrs =
      association: @
      from: @get('from')
      to: @get('to')
      name: @get('name')
      owner: owner

    switch @get 'type'
      when 'belongsTo'
        model = owner.get(attrs.name)
        relation = new Tails.Associations.BelongsToRelation _.extend attrs,
          foreignKey: @get('foreignKey') or inflection.foreign_key(attrs.to.name)
        relation.set("target", model) if model?

      when 'hasOne'
        model = owner.get(attrs.name)
        relation = new Tails.Associations.HasOneRelation _.extend attrs,
          foreignKey: @get('foreignKey') or inflection.foreign_key(attrs.from.name)
          through: @get('through')
          source: @get('source') or @get('name')
        relation.set("target", model) if model?

      when 'hasMany'
        relation = new Tails.Associations.HasManyRelation _.extend attrs,
          foreignKey: @get('foreignKey') or inflection.foreign_key(attrs.from.name)
          through: @get('through')
          source: @get('source') or @get('name')

    @relations().add(relation)
    owner.relations().add(relation)
    owner.getter attrs.name, -> relation.get('target')
    owner.setter attrs.name, (value)-> relation.set('target', value)


# Because classes aren't always loaded yet when these associational
# functions are called (which is at class definition), and because
# manually defining the load order causes circular dependencies, we
# pass a function that will evaluate to the correct class when called.
# This seemed to be our best option.
#
Tails.Mixins.Associable =

  InstanceMethods:
    relations: ( ) ->
      unless @_relations?
        @_relations = new Tails.Collection [], model: Tails.Associations.Relation
      return @_relations

  ClassMethods:
    belongsTo: ( options ) ->
      @associate 'belongsTo', options

    hasOne: ( options ) ->
      @associate 'hasOne', options

    hasMany: ( options ) ->
      @associate 'hasMany', options

    associate: ( type, options ) ->
      name   = _(options).keys()[0]
      to     = options[name]

      attrs =
        type: type
        from: @
        name:  name
        foreignKey: options.foreignKey
        through:    options.through
        source:     options.source

      association = new Tails.Associations.Association attrs
      if to.prototype instanceof Backbone.Model
        association.set to: to
      else association.getter to: to

    associations: ( ) ->
      unless @_associations?.klass = @
        @_associations = Tails.Associations.Association.all().where(from: @)
        @_associations.klass = @
      return @_associations

    extended: ( ) ->
      @concern Tails.Mixins.DynamicAttributes
      @concern Tails.Mixins.Collectable
      @concern Tails.Mixins.Interceptable

      @before initialize: ( ) ->
        @constructor.associations().each ( association ) => association.apply @

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

#
Tails.Mixins.History =

  Interactions: () ->
    InstanceMethods:
      @with Tails.Mixins.Storage,
        diff: ( ) ->
          diff = {}
          # The apply function
          diff.apply = (context = @) =>
            # console.log "Applying diff to instance #{@id} of", @constructor.name, JSON.stringify diff
            for key, change of diff
              for type, values of change
                switch type
                  when "create"
                    context.set key, values["value"]
                  when "update"
                    context.set key, values["new"]
                  when "delete"
                    context.unset key
            return context

          # Generate the changeset
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

          return diff

        commit: () ->
          key = @store @diff()
          return key

        included: ( ) ->
          @after initialize: () ->
            @on "change", @commit

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

# The basic template model. Will use rivets.js for binding
# objects to the template.
#
class Tails.Template extends Tails.Model
  @concern Tails.Mixins.Collectable

  urlRoot: 'assets'
  format:  'html'

  # Binds an object to the template using rivets.js.
  bind: ( view ) ->
    return @fetch(parse: true).then ( ) =>
      $el = $(@get('$el')).clone()
      rivets.bind $el, view
      return $el

  parse: ( response, options ) ->
    return $el: $(response)

# We assume that views always have one template. This template's
# element will be made available through @$el. As not every view
# will necessarily have a model, the model has to be manually
# bound.
#
class Tails.View extends Backbone.View
    _.extend @, Tails.Mixable

    initialize: ( options = {} ) ->
        @template = Tails.Template.get(@template) if @template.constructor is String

        @template.bind(@)
            .then ( $el ) =>
                @setElement($el)
                @render()
        super options

    render: ( ) ->
        # Make sure events are set properly. When
        # the view is removed and re-added to the
        # DOM, we need to re-set the events.
        @delegateEvents()

    setView: ( view ) ->
        @view = view
        @view.render()

Tails.factory = ( exports ) ->
  exports._ = Tails

  exports.Mixable      = Tails.Mixable
  exports.Model        = Tails.Model
  exports.Collection   = Tails.Collection
  exports.View         = Tails.View
  exports.Template     = Tails.Template
  exports.Mixins       = Tails.Mixins
  exports.Utils        = Tails.Utils

  exports.Association  = Tails.Association
  exports.Associations = Tails.Associations

  exports.Models       = Tails.Models
  exports.Views        = Tails.Views

  exports.config       = Tails.config

  exports.configure = ( options={} ) ->
    for property, value of options
      Tails.config[property] = value
    return

# Exports Tails for CommonJS, AMD and the browser.
if typeof exports == 'object'
  Tails.factory(exports)
else if typeof define == 'function' && define.amd
  define ['exports'], (exports) ->
    Tails.factory(@Tails = exports)
    return exports
else
  Tails.factory(@Tails = {})

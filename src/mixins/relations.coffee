# Because classes aren't always loaded yet when these relational
# functions are called (which is at class definition), and because
# manually defining the load order causes circular dependencies, we
# pass a function that will evaluate to the correct class when called.
# This seemed to be our best option.
#
Tails.Mixins.Relations =

  InstanceMethods:
    belongsTo: ( target, options = {} ) ->

      attribute  = options.attribute  or inflection.camelize(target.name, true)
      foreignKey = options.foreignKey or inflection.foreign_key(target.name)

      # Store the foreignId and relation we were defined with.
      # We will overwrite these.
      foreignId    = @get foreignKey
      foreignModel = @get attribute
      @unset foreignKey, silent: true
      @unset attribute,  silent: true

      # Create setters and getters for the property specified
      # by attribute. These will return the model with
      # our foreignKey, or set our foreignKey respectively.
      @getter attribute, ( ) => target.get(@get foreignKey) or new target({id: @get foreignKey})
      @setter attribute, ( model ) =>
          return @unset foreignKey unless model?
          unless target.get(model.id)?
            target.create(model)
          @set foreignKey, model.id

      # When the relation is changed to a raw object, we parse it into
      # an actual model.
      @on "change:#{foreignKey}", ( we, id ) =>
        model = @get attribute
        previousModel = target.get(@previous foreignKey)

        if model? and model isnt previousModel
          @stopListening previousModel if previousModel
          @trigger "change:#{attribute}", @, model
          @listenTo model, "change:id", ( model, id ) =>
            @set foreignKey, id

      # Make sure to re-set the properties we were defined with.
      if foreignModel?   then @set attribute, foreignModel
      else if foreignId? then @set foreignKey,  foreignId

    hasOne: ( target, options = {} ) ->
      attribute  = options.attribute  or inflection.camelize(target.name, true)
      foreignKey = options.foreignKey or inflection.foreign_key(@constructor.name)

      attrs = {}
      attrs[foreignKey] = @id

      @getter attribute, ( ) => target.findWhere(attrs) or new target(attrs)
      @setter attribute, ( model ) =>
          @attributes(attribute)[foreignKey] = undefined
          model[foreignKey] = @id

    hasMany: ( target, options = {} ) ->
      attribute  = options.attribute  or inflection.camelize(target.name)
      foreignKey = options.foreignKey or inflection.foreign_key(@constructor.name)

      (selector = {})[foreignKey] = @id
      @lazy attribute, -> target.scope where: selector

    addRelation: ( target, type, options = {} ) ->
      switch type
        when 'belongsTo' then @belongsTo target, options
        when 'hasOne'    then @hasOne    target, options
        when 'hasMany'   then @hasMany   target, options

  ClassMethods:
    belongsTo: ( options ) ->
      @addRelation 'belongsTo', options

    hasOne: ( options ) ->
      @addRelation 'hasOne', options

    hasMany: ( options ) ->
      @addRelation 'hasMany', options

    addRelation: ( type, options ) ->
      attribute = _(options).keys()[0]
      target    = options[attribute]
      options   = _(options).pick('foreignKey', 'through', 'source')
      options.attribute = attribute

      relation = new Relation owner: @, type: type, options: options
      if target.prototype instanceof Backbone.Model
        relation.set target: target
      # Wrapped target
      else relation.getter target: target

    relations: ( ) ->
      Relation.collection().where owner: @


    extended: ( ) ->
      @concern Tails.Mixins.DynamicAttributes
      @concern Tails.Mixins.Collectable
      @concern Tails.Mixins.Interceptable

      @before initialize: ( ) ->
        for relation in @constructor.relations()
          target  = relation.get 'target'
          type    = relation.get 'type'
          options = relation.get 'options'
          @addRelation target, type, options


class Relation extends Backbone.Model
  _.extend @, Tails.Mixable
  @concern Tails.Mixins.DynamicAttributes
  @concern Tails.Mixins.Collectable

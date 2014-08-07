# Because classes aren't always loaded yet when these relational
# functions are called (which is at class definition), and because
# manually defining the load order causes circular dependencies, we
# pass a function that will evaluate to the correct class when called.
# This seemed to be our best option.
#
Tails.Mixins.Relations =

  InstanceMethods:
    belongsTo: ( relation ) ->
      target     = relation.get('target')
      attribute  = relation.get('attribute')  or inflection.camelize(target.name, true)
      foreignKey = relation.get('foreignKey') or inflection.foreign_key(target.name)

      # Store the foreignId and relation we were defined with.
      # We will overwrite these.
      foreignId    = @get foreignKey
      foreignModel = @get attribute
      @unset foreignKey, silent: true
      @unset attribute,  silent: true

      # Create setters and getters for the property specified
      # by attribute. These will return the model with
      # our foreignKey, or set our foreignKey respectively.
      @getter attribute, ( ) => target.all().get(@get foreignKey)
      @setter attribute, ( model ) =>
          return @unset foreignKey unless model?
          unless target.all().get(model.id)?
            target.create(model)
          @set foreignKey, model.id

      # When the relation is changed to a raw object, we parse it into
      # an actual model.
      @on "change:#{foreignKey}", ( we, id ) =>
        model = @get attribute
        previousModel = target.all().get(@previous foreignKey)

        if model? and model isnt previousModel
          @stopListening previousModel if previousModel
          @trigger "change:#{attribute}", @, model
          @listenTo model, "change:id", ( model, id ) =>
            @set foreignKey, id

      # Make sure to re-set the properties we were defined with.
      if foreignModel?   then @set attribute, foreignModel
      else if foreignId? then @set foreignKey,  foreignId

    hasOne: ( relation ) ->
      target     = relation.get('target')
      attribute  = relation.get('attribute')  or inflection.camelize(target.name, true)
      foreignKey = relation.get('foreignKey') or inflection.foreign_key(@constructor.name)
      through    = relation.get('through')
      source     = relation.get('source')     or attribute

      foreignModel = @get attribute
      @unset attribute,  silent: true

      if not through?
        @getter attribute, ( ) => target.all().where(foreignKey).is(@id).first()
        @setter attribute, ( model ) =>
          target.all().where(foreignKey).is(@id).first()?.unset foreignKey
          model.set foreignKey, @id
        @set attribute, foreignModel if foreignModel?

      else
        @getter attribute, ( ) => @get(through).get source
        @setter attribute, ( model ) => @get(through).set source, model

    hasMany: ( relation ) ->
      target     = relation.get('target')
      attribute  = relation.get('attribute')  or inflection.transform(target.name, ['camelize', 'pluralize'])
      foreignKey = relation.get('foreignKey') or inflection.foreign_key(@constructor.name)
      through    = relation.get('through')
      source     = relation.get('source')

      if not through? then @lazy attribute, => target.all().where(foreignKey).is(@id)

      # We're dealing with a through relation. We have three kinds of hasMany through relations:
      # 1. The through relation is a singular relation (belongsTo, hasOne). In this case
      #    we create a getter on the owner that points to the source on the through relation.
      # 2. It's a plural relation (hasMany) and the source relation is singular. We then pluck
      #    the sources from the colleciton of through relations.
      # 3. It's a plural relation and the source relation is plural as well. We create a union
      #    and add or remove the individual collections.
      # TODO: Write this a bit clearer. The code could maybe be written a bit nicer as well.
      else
        throughRelation = @constructor.relations().findWhere(attribute: through)
        if throughRelation.get('type') isnt 'hasMany'
          @getter attribute, => @get(through).get(source or attribute)

        else
          sourceRelation = (source and throughRelation.get('target').relations().findWhere(attribute: source)) or
                           throughRelation.get('target').relations().findWhere(attribute: attribute, type: 'hasMany') or
                           throughRelation.get('target').relations().findWhere(attribute: inflection.singularize(attribute))
          if sourceRelation.get('type') is 'hasMany'
            source = sourceRelation.get('attribute')
            @lazy attribute, =>
              union = new Tails.Collection.Union()
              @get(through).each         ( model ) => union.addCollection model.get(source)
              @get(through).on 'add',    ( model ) => union.addCollection model.get(source)
              @get(through).on 'remove', ( model ) => union.removeCollection model.get(source)
              return union
          else
            source = sourceRelation.get('attribute')
            @lazy attribute, => @get(through).pluck(source)

    addRelation: ( relation ) ->
      switch relation.get('type')
        when 'belongsTo' then @belongsTo relation
        when 'hasOne'    then @hasOne    relation
        when 'hasMany'   then @hasMany   relation

  ClassMethods:
    belongsTo: ( options ) ->
      @addRelation 'belongsTo', options

    hasOne: ( options ) ->
      @addRelation 'hasOne', options

    hasMany: ( options ) ->
      @addRelation 'hasMany', options

    addRelation: ( type, options ) ->
      attribute  = _(options).keys()[0]
      target     = options[attribute]

      relation = new Relation
        owner:      @
        type:       type
        attribute:  attribute
        foreignKey: options.foreignKey
        through:    options.through
        source:     options.source

      if target.prototype instanceof Backbone.Model
        relation.set target: target
      else relation.getter target: target

    relations: ( ) ->
      Relation.all().where owner: @

    extended: ( ) ->
      @concern Tails.Mixins.DynamicAttributes
      @concern Tails.Mixins.Collectable
      @concern Tails.Mixins.Interceptable

      @before initialize: ( ) ->
        @constructor.relations().each ( relation ) => @addRelation relation

class Relation extends Backbone.Model
  _.extend @, Tails.Mixable
  @concern Tails.Mixins.DynamicAttributes
  @concern Tails.Mixins.Collectable

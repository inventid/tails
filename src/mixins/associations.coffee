# Because classes aren't always loaded yet when these associational
# functions are called (which is at class definition), and because
# manually defining the load order causes circular dependencies, we
# pass a function that will evaluate to the correct class when called.
# This seemed to be our best option.
#
Tails.Mixins.Associations =

  InstanceMethods:
    belongsTo: ( association ) ->
      target     = association.get('target')
      attribute  = association.get('attribute')  or inflection.camelize(target.name, true)
      foreignKey = association.get('foreignKey') or inflection.foreign_key(target.name)

      # Store the foreignId and association we were defined with.
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

      # When the association is changed to a raw object, we parse it into
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

    hasOne: ( association ) ->
      target     = association.get('target')
      attribute  = association.get('attribute')  or inflection.camelize(target.name, true)
      foreignKey = association.get('foreignKey') or inflection.foreign_key(@constructor.name)
      through    = association.get('through')
      source     = association.get('source')     or attribute

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

    hasMany: ( association ) ->
      target     = association.get('target')
      attribute  = association.get('attribute')  or inflection.transform(target.name, ['camelize', 'pluralize'])
      foreignKey = association.get('foreignKey') or inflection.foreign_key(@constructor.name)
      through    = association.get('through')
      source     = association.get('source')

      if not through? then @lazy attribute, => target.all().where(foreignKey).is(@id)

      # We're dealing with a through association. We have three kinds of hasMany through associations:
      # 1. The through association is a singular association (belongsTo, hasOne). In this case
      #    we create a getter on the owner that points to the source on the through association.
      # 2. It's a plural association (hasMany) and the source association is singular. We then pluck
      #    the sources from the colleciton of through associations.
      # 3. It's a plural association and the source association is plural as well. We create a union
      #    and add or remove the individual collections.
      # TODO: Write this a bit clearer. The code could maybe be written a bit nicer as well.
      else
        throughAssociation = @constructor.associations().findWhere(attribute: through)
        if throughAssociation.get('type') isnt 'hasMany'
          @getter attribute, => @get(through).get(source or attribute)

        else
          sourceAssociation = (source and throughAssociation.get('target').associations().findWhere(attribute: source)) or
                           throughAssociation.get('target').associations().findWhere(attribute: attribute, type: 'hasMany') or
                           throughAssociation.get('target').associations().findWhere(attribute: inflection.singularize(attribute))
          if sourceAssociation.get('type') is 'hasMany'
            source = sourceAssociation.get('attribute')
            @lazy attribute, =>
              union = new Tails.Collection.Union()
              @get(through).each         ( model ) => union.addCollection model.get(source)
              @get(through).on 'add',    ( model ) => union.addCollection model.get(source)
              @get(through).on 'remove', ( model ) => union.removeCollection model.get(source)
              return union
          else
            source = sourceAssociation.get('attribute')
            @lazy attribute, => @get(through).pluck(source)

    addAssociation: ( association ) ->
      switch association.get('type')
        when 'belongsTo' then @belongsTo association
        when 'hasOne'    then @hasOne    association
        when 'hasMany'   then @hasMany   association

  ClassMethods:
    belongsTo: ( options ) ->
      @addAssociation 'belongsTo', options

    hasOne: ( options ) ->
      @addAssociation 'hasOne', options

    hasMany: ( options ) ->
      @addAssociation 'hasMany', options

    addAssociation: ( type, options ) ->
      attribute  = _(options).keys()[0]
      target     = options[attribute]

      association = new Association
        owner:      @
        type:       type
        attribute:  attribute
        foreignKey: options.foreignKey
        through:    options.through
        source:     options.source

      if target.prototype instanceof Backbone.Model
        association.set target: target
      else association.getter target: target

    associations: ( ) ->
      Association.all().where owner: @

    extended: ( ) ->
      @concern Tails.Mixins.DynamicAttributes
      @concern Tails.Mixins.Collectable
      @concern Tails.Mixins.Interceptable

      @before initialize: ( ) ->
        @constructor.associations().each ( association ) => @addAssociation association

class Association extends Backbone.Model
  _.extend @, Tails.Mixable
  @concern Tails.Mixins.DynamicAttributes
  @concern Tails.Mixins.Collectable

class BelongsToAssociation extends Association

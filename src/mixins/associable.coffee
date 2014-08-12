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

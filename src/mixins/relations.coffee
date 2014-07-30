# Because classes aren't always loaded yet when these relational
# functions are called (which is at class definition), and because
# manually defining the load order causes circular dependencies, we
# pass a function that will evaluate to the correct class when called.
# This seemed to be our best option.
#
Tails.Mixins.Relations =

  InstanceMethods:
    belongsTo: ( relations ) ->
      foreignKey = relations.foreignKey
      for foreignName, klass of _(relations).omit('foreignKey')
        do ( foreignKey, foreignName, klass ) =>
          foreignKey ||= inflection.foreign_key(klass.name)

          # Store the foreignId and relation we were defined with.
          # We will overwrite these.
          foreignId    = @get foreignKey
          foreignModel = @get foreignName
          @unset foreignKey,  silent: true
          @unset foreignName, silent: true

          # Create setters and getters for the property specified
          # by foreignName. These will return the model with
          # our foreignKey, or set our foreignKey respectively.
          @getter foreignName, ( ) => klass.get(@get foreignKey) or new klass({id: @get foreignKey})
          @setter foreignName, ( model ) =>
              return @unset foreignKey unless model?
              unless klass.get(model.id)?
                klass.create(model)
              @set foreignKey, model.id

          # When the relation is changed to a raw object, we parse it into
          # an actual model.
          @on "change:#{foreignKey}", ( we, id ) =>
            model = @get foreignName
            previousModel = klass.get(@previous foreignKey)

            if model? and model isnt previousModel
              @stopListening previousModel if previousModel
              @trigger "change:#{foreignName}", @, model
              @listenTo model, "change:id", ( model, id ) =>
                @set foreignKey, id

          # Make sure to re-set the properties we were defined with.
          if foreignModel?   then @set foreignName, foreignModel
          else if foreignId? then @set foreignKey,  foreignId

    hasOne: ( relations ) ->
      foreignKey = relations.foreignKey
      for foreignName, klass of _(relations).omit('foreignKey')
        do ( foreignKey, foreignName, klass ) =>
          foreignKey ||= inflection.foreign_key(@constructor.name)

          attrs = {}
          attrs[foreignKey] = @id

          @getter foreignName, ( ) => klass.findWhere(attrs) or new klass(attrs)
          @setter foreignName, ( model ) =>
              @attributes(foreignName)[foreignKey] = undefined
              model[foreignKey] = @id

    hasMany: ( relations ) ->
      foreignKey = relations.foreignKey
      for foreignName, klass of _(relations).omit('foreignKey')
        do ( foreignKey, foreignName, klass ) =>
          foreignKey ||= inflection.foreign_key(@constructor.name)
          (selector = {})[foreignKey] = @id
          @lazy foreignName, -> klass.scope where: selector

  ClassMethods:
    belongsTo: ( relations ) ->
      @before initialize: ( ) -> @belongsTo relations?() or relations

    hasOne: ( relations ) ->
      @before initialize: ( ) -> @hasOne relations?() or relations

    hasMany: ( relations ) ->
      @before initialize: ( ) -> @hasMany relations?() or relations

    extended: ( ) ->
      @concern Tails.Mixins.DynamicAttributes
      @concern Tails.Mixins.Collectable
      @concern Tails.Mixins.Interceptable

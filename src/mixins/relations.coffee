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
          Object.defineProperty @attributes, foreignName,
            get: ( ) => klass.get(@get foreignKey)
            set: ( model ) =>
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
          Object.defineProperty @attributes, foreignName,
            get: ( ) => klass.all().findWhere(attrs) or new klass(attrs)
            set: ( model ) =>
              @attributes(foreignName)[foreignKey] = undefined
              model[foreignKey] = @id

    hasMany: ( relations ) ->
      foreignKey = relations.foreignKey
      for foreignName, klass of _(relations).omit('foreignKey')
        do ( foreignKey, foreignName, klass ) =>
          foreignKey ||= inflection.foreign_key(@constructor.name)

          # Create the collection of relations
          collection = new Tails.Collection null, { model: klass, parent: @ }
          @set foreignName, collection

          # Find all models of klass that have already set us as their relation.
          collection.add(klass.all().find ( model ) => model.get(foreignKey) is @id)

          # Listen to the all() collection of the related class for changes in
          # foreign keys. If they're not in our collection and they set their
          # foreign key to us, add them. If they are in our collection and
          # set their foreign key to something else, remove them.
          klass.all().on "change:#{foreignKey}", ( model, id ) =>
            if id isnt @id and collection.contains model
              collection.remove model

            # We have to check if the collection is currently syncing. This
            # is necessary because else
            else if id is @id and not collection.contains model
              collection.add model

          # When the model is added to the all() collection, the change events
          # on the foreign key may have already been triggered. So we check each
          # added model if it has us as its foreign key.
          klass.all().on "add", ( model ) =>
            if model.get(foreignKey) is @id and not collection.contains model
              collection.add model

          klass.all().on "remove", ( model ) =>
            if model.get(foreignKey) is @id and collection.contains model
              collection.remove model

          # Watch our own collection for changes.
          collection.on "add", ( model ) =>
            unless model.get(foreignKey) is @id
              model.set(foreignKey, @id)

          collection.on "remove", ( model ) =>
            if model.get(foreignKey) is @id
              model.set(foreignKey, undefined)

  ClassMethods:
    belongsTo: ( relations ) ->
      @before initialize: ( ) -> @belongsTo relations?() or relations

    hasOne: ( relations ) ->
      @before initialize: ( ) -> @hasOne relations?() or relations

    hasMany: ( relations ) ->
      @before initialize: ( ) -> @hasMany relations?() or relations

  extended: ( ) ->
    @concern Tails.Mixins.Collectable
    @concern Tails.Mixins.Interceptable

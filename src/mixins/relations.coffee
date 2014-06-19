#= require core/app
#= require mixins/collectable

# Because classes aren't always loaded yet when these relational
# functions are called (which is at class definition), and because
# manually defining the load order causes circular dependencies, we
# pass a function that will evaluate to the correct class when called.
# This seemed to be our best option.
#
Tails.Mixins.Relations =

  ClassMethods:
    belongsTo: ( klassFn ) ->
      @addRelation 'belongsTo', klassFn

    hasOne: ( klassFn ) ->
      @addRelation 'hasOne', klassFn

    hasMany: ( klassFn ) ->
      @addRelation 'hasMany', klassFn

    addRelation: ( relation, klassFn ) ->
      unless @_relations?.klass is @
        @_relations = klass: @
      @_relations[relation] ||= []
      @_relations[relation].push(klassFn)

  extended: ( ) ->
    @extend  Tails.Mixins.Collectable

    @after initialize: ( ) ->
      @_blacklistedAttributes ||= []

      # Make sure the relations have been defined by this class,
      # instead of a parent.
      if @ instanceof Backbone.Model and @constructor._relations?.klass is @constructor

        # Define belongsTo relations
        if @constructor._relations.belongsTo?
          for klassFn in @constructor._relations.belongsTo
            do ( klassFn ) =>
              klass = klassFn()

              foreignKey  = klass.name.foreign_key()
              propertyKey = klass.name.underscore()
              @_blacklistedAttributes.push(propertyKey)

              # Store the foreignId and relation we were defined with.
              # We will overwrite these.
              foreignId = @get foreignKey
              relation = @get propertyKey
              @unset foreignKey, silent: true
              @unset propertyKey, silent: true

              # debugger if @constructor.name is 'OrderProduct'

              # Make the foreignKey attribute a proxy for relation.id
              Object.defineProperty @attributes, foreignKey,
                enumerable:   true
                get: ( )  => @get(propertyKey)?.id
                set: ( id ) => @set(propertyKey, klass.get(id))

              # When the relation is changed to a raw object, we parse it into
              # an actual model.
              @on "change:#{propertyKey}", ( we, model ) =>
                @stopListening @previous propertyKey
                if model? and model not instanceof klass
                  attrs = model
                  model = klass.get attrs.id
                  model.set attrs
                  model.synced = true
                  @set propertyKey, model
                  return

                @trigger "change:#{foreignKey}", @, model.id
                @listenTo model, "change:id", ( model, id ) =>
                  @trigger "change:#{foreignKey}", @, id

              # Make sure to re-set the properties we were defined with.
              if relation? then @set propertyKey, relation
              else if foreignId? then @set foreignKey, foreignId

        # Define hasOne relations
        # TODO: This should be revisited when we have hasOne relations
        if @constructor._relations.hasOne?
          for klassFn in @constructor._relations.hasOne
            do ( klassFn ) =>
              klass = klassFn()

              foreignKey  = @constructor.name.foreign_key()
              propertyKey = klass.name.underscore().camelize(true)

              where = {}
              where[foreignKey] = @id

              @getter propertyKey, ( ) -> klass.all().findWhere where
              @setter propertyKey, ( model ) -> model.set(foreignKey, @id)

        # Define hasMany relations
        if @constructor._relations.hasMany?
          for klassFn in @constructor._relations.hasMany
            do ( klassFn ) =>
              klass = klassFn()

              foreignKey  = @constructor.name.foreign_key()
              propertyKey = klass.name.pluralize().underscore()
              @_blacklistedAttributes.push(propertyKey)

              # Create the collection of relations
              collection = new Tails.Collection null, { model: klass, parent: @ }
              @set propertyKey, collection

              # Find all models of klass that have already set us as their relation.
              collection.add(klass.all().find ( model ) => model[propertyKey] is @id)

              # Listen to the all() collection of the related class for changes in
              # foreign keys. If they're not in our collection and they set their
              # foreign key to us, add them. If they are in our collection and
              # set their foreign key to something else, remove them.
              klass.all().on "change:#{foreignKey}", ( model, id ) =>
                # console.log @, model
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
                  model.set(foreignKey, null)

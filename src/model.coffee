{ Unit } = require('sonic')

class Model



  constructor: (attributes = {}) ->
    @attributes = Object.create(null)
    @set(key, value) for key, value of attributes

  has: (key) ->
    key of @attributes

  zoom: (key) ->
    return @attributes[key] ||= Sonic.empty()

  get: (key ) ->
    return @zoom(key).last() if @has(key)

  set: (key, value) ->
    @zoom(key).push(value)
    return this

  define: (key) ->

  lift: () ->
    return Model.lift(@)

  belongsTo: (name, klass, options = {}) ->
    { foreignKey } = options


    @attributes[name] = klass.all()
                             .flatMap(Model.lift)
                             .take(1)



  hasMany: (name, klass, options = {}) ->
    { foreignKey } = options
    result = @zoom('id')
              .map((id) -> ((model) -> model.zoom(foreignKey).map((key) -> key is id))) # filterFn
              .flatMap((filterFn) -> klass.all().flatMap(filterFn))


    klass.all().filter (model) -> model.zoom().zip()


  @lift: ( model ) ->
    return new Unit(model)

#
# basket = new Model
#
# basket.hasMany('fruits', Fruit, foreignKey: 'basket_id')
#
#
# module.exports = Model
#
#
# Fruit = Model.define 'Fruit',
#
#   constructor: ( ) ->
#
#
# Strawberry = Fruit.extend 'Strawberry',





# Model.create()

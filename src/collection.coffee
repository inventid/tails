Mixable = require('./mixable')
Model = require('./model')
config = require('./config')
Sonic  = require('sonic')

class Collection

  model: Model

  constructor: ( models, options = {} ) ->
    @model = options.model if options.model?
    @_models = Sonic(models)
    @_models.onInvalidate @_onModelsInvalidate

    @initialize?()




Object.keys(Sonic.utilities).forEach ( key ) ->
  Collection::[key] = -> Sonic.utilities[key].apply(@_models, arguments)



module.exports = Collection

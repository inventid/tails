{ LinkedList } = require('sonic')
Model = require('./model')

class Collection extends LinkedList

  model: Model

  constructor: ( models, options = {} ) ->
    @model = options.model if options.model?
    @_models = Sonic(models)
    @_models.onInvalidate @_onModelsInvalidate

    @initialize?()


  # @filter: (collection) ->
    # LinkedList.flatMap




module.exports = Collection

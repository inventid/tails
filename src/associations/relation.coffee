Mixable           = require('../mixable')
DynamicAttributes = require('../mixins/dynamic_attributes')
Collectable       = require('../mixins/collectable')

class Relation extends Backbone.Model
  _.extend @, Mixable
  @concern DynamicAttributes
  @concern Collectable

  initialize: ( ) ->
    # destroyer = ( ) =>
    #   @stopListening @get('owner')
    #   @stopListening @get('target')
    #   @trigger 'destroy'

    # @listenTo @get('owner'), 'destroy', destroyer
    # unless @get('target') instanceof Backbone.Collection
    #   @listenTo @get('target'), 'destroy', destroyer

module.exports = Relation

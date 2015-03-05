class Tails.Associations.Relation extends Backbone.Model
  _.extend @, Tails.Mixable
  @concern Tails.Mixins.DynamicAttributes
  @concern Tails.Mixins.Collectable

  initialize: ( ) ->
    # destroyer = ( ) =>
    #   @stopListening @get('owner')
    #   @stopListening @get('target')
    #   @trigger 'destroy'

    # @listenTo @get('owner'), 'destroy', destroyer
    # unless @get('target') instanceof Backbone.Collection
    #   @listenTo @get('target'), 'destroy', destroyer





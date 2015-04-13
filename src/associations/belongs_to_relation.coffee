class Tails.Associations.BelongsToRelation extends Tails.Associations.Relation

  initialize: ( ) ->
    association = @get 'association'
    to          = association.get 'to'
    foreignKey  = @get 'foreignKey'
    owner       = @get 'owner'

    # Create setters and getters for the property specified
    # by name. These will return the model with
    # our foreignKey, or set our foreignKey respectively.
    @getter target: ( ) -> to.get(owner.get(foreignKey))
    @setter target: ( model ) ->
      unless model?
        owner.set foreignKey, null
        return
      unless to.all().get(model.id)?
        to.all().add(model, parse: true)
      owner.set foreignKey, model.id

    super

Relation = require('./relation')

class HasOneRelation extends Relation

  initialize: ( ) ->
    owner       = @get 'owner'
    association = @get 'association'
    to          = association.get 'to'

    foreignKey  = @get 'foreignKey'
    through     = @get 'through'
    source      = @get 'source'

    if not through?
      @getter target: ( ) => to.all().where(foreignKey).is(owner.id).first()
      @setter target: ( model ) =>
        to.all().where(foreignKey).is(owner.id).first()?.unset foreignKey
        model.set foreignKey, owner.id

     else
      @getter target: ( ) => owner.get(through).get source
      @setter target: ( model ) => owner.get(through).set source, model

    super

module.exports = HasOneRelation

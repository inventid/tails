
class Tails.Associations.HasManyRelation extends Tails.Associations.Relation

  initialize: ( ) ->
    association = @get('association')
    to          = association.get('to')
    owner       = @get('owner')

    name        = @get('name')
    foreignKey  = @get('foreignKey')
    through     = @get('through')
    source      = @get('source')

    if not through?
      @lazy target: ( ) =>
        collection = to.all().where(foreignKey).is(owner.id)
        collection.parent = owner
        return collection

    # We're dealing with a through association. We have three kinds of hasMany through associations:
    # 1. The through association is a singular association (belongsTo, hasOne). In this case
    #    we create a getter on the owner that points to the source on the through association.
    # 2. It's a plural association (hasMany) and the source association is singular. We then pluck
    #    the sources from the colleciton of through associations.
    # 3. It's a plural association and the source association is plural as well. We create a union
    #    and add or remove the individual collections.
    # TODO: Write this a bit clearer. The code could maybe be written a bit nicer as well.
    else
      throughAssociation = owner.constructor.associations().findWhere(name: through)
      if throughAssociation.get('type') isnt 'hasMany'
        @getter target: => owner.get(through).get(source or name)

      else
        sourceAssociation = (source and throughAssociation.get('to').associations().findWhere(name: source)) or
                         throughAssociation.get('to').associations().findWhere(name: name, type: 'hasMany') or
                         throughAssociation.get('to').associations().findWhere(name: inflection.singularize(name))
        if sourceAssociation.get('type') is 'hasMany'
          source = sourceAssociation.get('name')
          @lazy target: ->
            union = new Tails.Collection.Union()
            union.parent = owner
            owner.get(through).each         ( model ) => union.addCollection model.get(source)
            owner.get(through).on 'add',    ( model ) => union.addCollection model.get(source)
            owner.get(through).on 'remove', ( model ) => union.removeCollection model.get(source)
            return union
        else
          source = sourceAssociation.get('name')
          @lazy target: -> owner.get(through).pluck(source)

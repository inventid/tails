class Tails.Associations.Association extends Backbone.Model
  _.extend @, Tails.Mixable
  @concern Tails.Mixins.Debug
  @concern Tails.Mixins.DynamicAttributes
  @concern Tails.Mixins.Collectable

  relations: ( ) ->
    unless @_relations?
      @_relations = new Tails.Collection [], model: Tails.Associations.Relation
    return @_relations

  apply: ( owner ) ->
    attrs =
      association: @
      from: @get('from')
      to: @get('to')
      name: @get('name')
      owner: owner

    switch @get 'type'
      when 'belongsTo'
        model = owner.get(attrs.name)
        relation = new Tails.Associations.BelongsToRelation _.extend attrs,
          foreignKey: @get('foreignKey') or inflection.foreign_key(attrs.to.name)
        relation.set("target", model) if model?

      when 'hasOne'
        model = owner.get(attrs.name)
        relation = new Tails.Associations.HasOneRelation _.extend attrs,
          foreignKey: @get('foreignKey') or inflection.foreign_key(attrs.from.name)
          through: @get('through')
          source: @get('source') or @get('name')
        relation.set("target", model) if model?

      when 'hasMany'
        relation = new Tails.Associations.HasManyRelation _.extend attrs,
          foreignKey: @get('foreignKey') or inflection.foreign_key(attrs.from.name)
          through: @get('through')
          source: @get('source') or @get('name')

    @relations().add(relation)
    owner.relations().add(relation)
    owner.getter attrs.name, -> relation.get('target')
    owner.setter attrs.name, (value)-> relation.set('target', value)


Mixable = require('../mixable')
Debug = require('../mixins/debug')
DynamicAttributes = require('../mixins/dynamic_attributes')
Collectable = require('../mixins/collectable')
Collection = require('../collection')
Relation = require('./relation')

BelongsToRelation = require('./belongs_to_relation')
HasOneRelation = require('./has_one_relation')
HasManyRelation = require('./has_many_relation')

class Association extends Backbone.Model
  _.extend @, Mixable
  @concern Debug
  @concern DynamicAttributes
  @concern Collectable

  relations: ( ) ->
    unless @_relations?
      @_relations = new Collection [], model: Relation
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
        relation = new BelongsToRelation _.extend attrs,
          foreignKey: @get('foreignKey') or inflection.foreign_key(attrs.to.name or attrs.to.toString().match(/^function\s*([^\s(]+)/)[1])
        relation.set("target", model) if model?

      when 'hasOne'
        model = owner.get(attrs.name)
        relation = new HasOneRelation _.extend attrs,
          foreignKey: @get('foreignKey') or inflection.foreign_key(attrs.from.name or attrs.from.toString().match(/^function\s*([^\s(]+)/)[1])
          through: @get('through')
          source: @get('source') or @get('name')
        relation.set("target", model) if model?

      when 'hasMany'
        models = owner.get(attrs.name)
        relation = new HasManyRelation _.extend attrs,
          foreignKey: @get('foreignKey') or inflection.foreign_key(attrs.from.name or attrs.from.toString().match(/^function\s*([^\s(]+)/)[1])
          through: @get('through')
          source: @get('source') or @get('name')
        relation.set("target", models) if models?

    @relations().add(relation)
    owner.relations().add(relation)
    owner.getter attrs.name, -> relation.get('target')
    owner.setter attrs.name, (value)-> relation.set('target', value)


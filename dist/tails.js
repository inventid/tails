(function() {
  var Associable, Association, BelongsToRelation, Collectable, Collection, Debug, DynamicAttributes, HasManyRelation, HasOneRelation, Hash, History, Interceptable, Mixable, Model, Relation, Storage, Tails, Template, View, config;

  require('./utils/rivets-tails');

  Hash = require('./utils/hash');

  Mixable = require('./mixable');

  Interceptable = require('./mixins/interceptable');

  Debug = require('./mixins/debug');

  DynamicAttributes = require('./mixins/dynamic_attributes');

  Collectable = require('./mixins/collectable');

  Associable = require('./mixins/associable');

  Storage = require('./mixins/storage');

  History = require('./mixins/history');

  Collection = require('./collection');

  Association = require('./associations/association');

  Relation = require('./associations/relation');

  BelongsToRelation = require('./associations/belongs_to_relation');

  HasOneRelation = require('./associations/has_one_relation');

  HasManyRelation = require('./associations/has_many_relation');

  Model = require('./model');

  Template = require('./template');

  View = require('./view');

  config = require('./config');

  Tails = {
    Mixins: {},
    Utils: {},
    Associations: {},
    Models: {},
    Views: {}
  };

  Tails.Utils = {
    Hash: Hash
  };

  Tails.Mixable = Mixable;

  Tails.Mixins = {
    Interceptable: Interceptable,
    Collectable: Collectable,
    Associable: Associable,
    Debug: Debug,
    DynamicAttributes: DynamicAttributes,
    Storage: Storage,
    History: History
  };

  Tails.Collection = Collection;

  Tails.Associations = {
    Relation: Relation,
    Association: Association,
    BelongsToRelation: BelongsToRelation,
    HasOneRelation: HasOneRelation,
    HasManyRelation: HasManyRelation
  };

  Tails.Model = Model;

  Tails.View = View;

  Tails.Template = Template;

  Tails.config = config;

  module.exports = Tails;

}).call(this);

//# sourceMappingURL=tails.js.map

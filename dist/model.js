var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var linked_list_1 = require('../node_modules/sonic/dist/linked_list');
var utils_1 = require('./utils');
var simple_record_1 = require('../node_modules/knuckles/dist/simple_record');
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(object) {
        var _this = this;
        _super.call(this, object);
        this._belongsTo = function (klass) {
            var name = klass['name'];
            var foreignKey = utils_1.default.underscore(name) + "_id";
            return _this.zoom(foreignKey).flatMap(function (id) {
                return Model.where(klass.all(), "id", id);
            });
        };
        this._hasOne = function (klass) {
            return _this._hasMany(klass);
        };
        this._hasMany = function (klass) {
            var name = _this.constructor['name'];
            var foreignKey = utils_1.default.underscore(name) + "_id";
            return _this.zoom('id').flatMap(function (id) {
                return Model.where(klass.all(), foreignKey, id);
            });
        };
        this.constructor.all().push(this);
    }
    Model._keyFn = function (model) {
        return model.get('id') || null;
    };
    ;
    Model.all = function () {
        if (this._collection == null)
            this._collection = new linked_list_1.default([], this._keyFn);
        return this._collection;
    };
    Model.where = function (models, key, value) {
        return Model.pluck(models, key).filter(function (tuple) {
            var model = tuple[0], _value = tuple[1];
            return _value === value;
        }).map(function (tuple) { return tuple[0]; });
    };
    Model.pluck = function (models, key) {
        return models.flatMap(function (model) {
            return model.zoom(key).map(function (value) {
                return [model, value];
            });
        });
    };
    return Model;
})(simple_record_1.default);
exports.default = Model;

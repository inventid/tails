import LinkedList from '../node_modules/sonic/dist/linked_list';
import SimpleRecord from '../node_modules/knuckles/dist/simple_record';
class Model extends SimpleRecord {
    constructor(object) {
        super(object);
        this.constructor.all().push(this);
    }
    static _keyFn(model) {
        return model.id || null;
    }
    ;
    static all() {
        if (this._collection == null)
            this._collection = new LinkedList([], this._keyFn);
        return this._collection;
    }
    static where(models, key, value) {
        return Model.pluck(models, key).filter((tuple) => {
            var [model, _value] = tuple;
            return _value === value;
        }).map((tuple) => tuple[0]);
    }
    static pluck(models, key) {
        return models.flatMap((model) => {
            return model.zoom(key).map((value) => {
                return [model, value];
            });
        });
    }
}
export default Model;

import _Collection from '../node_modules/knuckles/dist/collection';
import { MutableList } from '../node_modules/sonic/dist/mutable_list';
import ArrayList from '../node_modules/sonic/dist/array_list';
import Utils from './utils';
import ObservableCache from '../node_modules/sonic/dist/observable_cache';
export class Collection extends MutableList {
    constructor(models = [], options) {
        super();
        this.has = (key) => {
            return this._cache.has(key);
        };
        this.get = (key) => {
            if (!this.has(key))
                this._record.get(key);
            return this._cache.get(key);
        };
        this._models = new ArrayList(models);
        this._record = new _Collection(this.url(), []);
        this._cache = new ObservableCache(this._models);
        // this._record.observe({
        //   onInvalidate: (key: Key) => {
        //     this._models.set(key)
        //   }
        // })
    }
    url() {
        return Utils.underscore(this.constructor.name);
    }
}
export default Collection;

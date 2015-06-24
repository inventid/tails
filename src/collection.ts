import Key from '../node_modules/sonic/dist/key';
import _Collection from '../node_modules/knuckles/dist/collection';
import Model from './model';
import { MutableList, IMutableList } from '../node_modules/sonic/dist/mutable_list';
import ArrayList from '../node_modules/sonic/dist/array_list';
import Utils from './utils';
import ObservableCache from '../node_modules/sonic/dist/observable_cache';

export class Collection<V extends Model> extends MutableList<V> {
  protected _models: IMutableList<V>;
  protected _record: _Collection<V>;
  protected _cache: ObservableCache<V>;

  constructor(models: V[] = [], options?: any) {
    super();

    this._models = new ArrayList(models);
    this._record = new _Collection(this.url(), []);
    this._cache = new ObservableCache(this._models);

    // this._record.observe({
    //   onInvalidate: (key: Key) => {
    //     this._models.set(key)
    //   }
    // })
  }

  has = (key: Key): boolean => {

    return this._cache.has(key)
  }

  get = (key: Key): V => {
    if (!this.has(key)) this._record.get(key);
    return this._cache.get(key);
  }

  url(): string {
    return Utils.underscore(this.constructor.name);
  }
}

export default Collection;

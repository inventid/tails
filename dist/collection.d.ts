import _Collection from '../node_modules/knuckles/dist/collection';
import Model from './model';
import { MutableList, IMutableList } from '../node_modules/sonic/dist/mutable_list';
import ObservableCache from '../node_modules/sonic/dist/observable_cache';
export declare class Collection<V extends Model> extends MutableList<V> {
    protected _models: IMutableList<V>;
    protected _record: _Collection<V>;
    protected _cache: ObservableCache<V>;
    constructor(models?: V[], options?: any);
    has: (key: string | number) => boolean;
    get: (key: string | number) => V;
    url(): string;
}
export default Collection;

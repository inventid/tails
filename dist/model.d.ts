import Key from '../node_modules/sonic/dist/key';
import LinkedList from '../node_modules/sonic/dist/linked_list';
import { ObservableList } from '../node_modules/sonic/dist/observable_list';
import SimpleRecord from '../node_modules/knuckles/dist/simple_record';
declare class Model extends SimpleRecord<any> {
    private static _collection;
    private static _keyFn(model);
    static all(): LinkedList<Model>;
    constructor(object: {
        [key: string]: any;
    });
    private _belongsTo;
    private _hasOne;
    private _hasMany;
    static where<T extends Model>(models: ObservableList<T>, key: Key, value: any): ObservableList<T>;
    static pluck<T extends Model>(models: ObservableList<T>, key: Key): ObservableList<[T, any]>;
}
export default Model;

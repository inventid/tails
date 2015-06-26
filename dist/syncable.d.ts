import { Model } from './model';
import { IRecord } from '../node_modules/knuckles/dist/record.d';
import { Mixable } from './mixable';
export interface Syncable extends Mixable {
}
export declare function Syncable<T extends typeof Model, Mixable>(target: T): void;
export declare module Syncable {
    enum SYNC_STATES {
        "new" = 0,
        "destroyed" = 1,
        "synced" = 2,
    }
    module ClassMethods {
        function syncWith<V extends typeof Model, Syncable>(...records: IRecord<V>[]): void;
    }
    module InstanceMethods {
        var _syncState: boolean;
        function save(): void;
        function destroy(): void;
    }
}
export declare function isSyncable(obj: any): ;
export default Syncable;

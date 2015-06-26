import { Model } from './model';
// import Collection from '../node_modules/sonic/dist/linked_list';
import { IRecord } from '../node_modules/knuckles/dist/record.d';
import { Mixable, isMixable } from './mixable';

export interface Syncable extends Mixable {
}

export function Syncable<T extends typeof Model, Mixable>(target: T): void {
  if (!isMixable(target)) Mixable(target);
  (<any>target).concern(Syncable);
}

export module Syncable {
  export enum SYNC_STATES {
    "new",
    "destroyed",
    "synced"
  }

  export module ClassMethods {
    export function syncWith<V extends typeof Model, Syncable>(...records: IRecord<V>[]) {

    }
  }
  export module InstanceMethods {
    export var _syncState: boolean = undefined;

    export function save() {
      if (this._syncState == SYNC_STATES.synced) return;

      console.log("Saving", this);
      throw new Error('Not implemented.');

      this._syncState = SYNC_STATES.synced;
    }

    export function destroy() {
      if (this._syncState ==SYNC_STATES.destroyed) return;

      console.log("Destroying", this);
      throw new Error('Not implemented.');

      this._syncState = SYNC_STATES.destroyed;

    }
  }
}

export function isSyncable(obj: any): obj is Syncable {
  return Object.keys(Syncable.ClassMethods).reduce((memo: boolean, key: string): boolean => memo && !(obj[key] == null), true)
}

export default Syncable;

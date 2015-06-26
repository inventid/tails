import { Mixable, isMixable } from './mixable';
export function Syncable(target) {
    if (!isMixable(target))
        Mixable(target);
    target.concern(Syncable);
}
export var Syncable;
(function (Syncable) {
    (function (SYNC_STATES) {
        SYNC_STATES[SYNC_STATES["new"] = 0] = "new";
        SYNC_STATES[SYNC_STATES["destroyed"] = 1] = "destroyed";
        SYNC_STATES[SYNC_STATES["synced"] = 2] = "synced";
    })(Syncable.SYNC_STATES || (Syncable.SYNC_STATES = {}));
    var SYNC_STATES = Syncable.SYNC_STATES;
    var ClassMethods;
    (function (ClassMethods) {
        function syncWith(...records) {
        }
        ClassMethods.syncWith = syncWith;
    })(ClassMethods = Syncable.ClassMethods || (Syncable.ClassMethods = {}));
    var InstanceMethods;
    (function (InstanceMethods) {
        InstanceMethods._syncState = undefined;
        function save() {
            if (this._syncState == SYNC_STATES.synced)
                return;
            console.log("Saving", this);
            throw new Error('Not implemented.');
            this._syncState = SYNC_STATES.synced;
        }
        InstanceMethods.save = save;
        function destroy() {
            if (this._syncState == SYNC_STATES.destroyed)
                return;
            console.log("Destroying", this);
            throw new Error('Not implemented.');
            this._syncState = SYNC_STATES.destroyed;
        }
        InstanceMethods.destroy = destroy;
    })(InstanceMethods = Syncable.InstanceMethods || (Syncable.InstanceMethods = {}));
})(Syncable || (Syncable = {}));
export function isSyncable(obj) {
    return Object.keys(Syncable.ClassMethods).reduce((memo, key) => memo && !(obj[key] == null), true);
}
export default Syncable;

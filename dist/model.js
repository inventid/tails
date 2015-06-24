var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
import Mixable from './mixable';
import Collectable from './collectable';
import Associable from './associable';
import Interceptable from './interceptable';
import Debug from './debug';
import SimpleRecord from '../node_modules/knuckles/dist/simple_record';
export let Model = class extends SimpleRecord {
    constructor(object) {
        super(object);
        this.constructor.all().push(this);
        this.initialize();
    }
    initialize() { }
};
Model = __decorate([
    Mixable,
    Interceptable,
    Collectable,
    Associable,
    Debug
], Model);
export default Model;

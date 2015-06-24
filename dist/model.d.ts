import Key from '../node_modules/sonic/dist/key';
import SimpleRecord from '../node_modules/knuckles/dist/simple_record';
export interface ModelConstructor {
    prototype: Model;
    new (object: {
        [key: string]: any;
    }): Model;
}
export declare class Model extends SimpleRecord<any> {
    id: Key;
    constructor(object: {
        [key: string]: any;
    });
    initialize(): void;
}
export default Model;

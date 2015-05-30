var model_1 = require('./model');
var observable_record_1 = require('./observable_record');
var mutable_record_1 = require('./mutable_record');
var simple_record_1 = require('./simple_record');
var Tails;
(function (Tails) {
    Tails.Model = model_1.default;
    Tails.Record = simple_record_1.default;
    Tails.ObservableRecord = observable_record_1.default;
    Tails.MutableRecord = mutable_record_1.default;
    Tails.SimpleRecord = simple_record_1.default;
})(Tails || (Tails = {}));
module.exports = Tails;

var Utils;
(function (Utils) {
    function underscore(string) {
        return string.replace(/((!?[^|\s])[A-Z][a-z0-9])/, "_$1").toLowerCase();
    }
    Utils.underscore = underscore;
})(Utils = exports.Utils || (exports.Utils = {}));
exports.default = Utils;

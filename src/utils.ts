export module Utils {
  export function underscore(string: String) {
    return string.replace(/((!?[^|\s])[A-Z][a-z0-9])/, "_$1").toLowerCase()
  }
}

export default Utils;

Tails.Utils.Hash = ( string ) ->
  # Taken from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
  hash = 0;
  return hash if string.length is 0

  for i in [0...string.length]
    char = string.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash # Convert to 32bit integer

  return hash


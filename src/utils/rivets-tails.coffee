rivets?.adapters[':'] =
  subscribe: ( obj, keypath, callback ) ->
    if (obj instanceof Backbone.Collection)
      obj.on('add remove reset', callback)

    obj.on('change:' + keypath, callback);

  unsubscribe: ( obj, keypath, callback ) ->
    if obj instanceof Backbone.Collection
      obj.off('add remove reset', callback)

    obj.off('change:' + keypath, callback)

  read: ( obj, keypath ) ->
    return if obj instanceof Backbone.Collection then obj.models else obj.get(keypath)

  publish: ( obj, keypath, value ) ->
    obj.set(keypath, value)


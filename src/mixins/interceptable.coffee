# This mixin mainly serves as a helper to other mixins. It allows
# them to execute code before or after a method is invoked. The bulk
# of this mixin's complexity is due to the fact that one might want
# to set an interceptor before the interceptable method is defined, or
# that it might not be defined at all! This is why we strategically
# place setters and getters on the @ect, so that when the class gets
# to the point where it defines the interceptable method, the setter
# will replace itself with the interceptable method wrapped by the
# interceptors. Chaining of interceptors also proved to be a challenge
# in this scenario.
#
Interceptable =

  InstanceMethods:
    before: ( interceptors ) ->
      @intercept before: interceptors

    after: ( interceptors ) ->
      @intercept after: interceptors

    intercept: ( params ) ->
      klass = @constructor
      for placement, interceptors of params when placement in ['before', 'after']

        # Map functions in interceptors.these to the
        # functions in interceptors.do
        if interceptors.these?
          for key in interceptors.these

            # Find the key of functions passed as
            # actual function, instead of string.
            (key = k; break) for k, v of @ when key is v if typeof key is 'function'
            interceptors[key] = interceptors.do

        # Exclude previously processed these and do
        # keywords from interceptors.
        interceptors = _(interceptors).omit('these', 'do')
        for key, fns of interceptors

          # Fns might or might not be an array. Convert it
          # into one when it's not.
          fns = [fns] unless _(fns).isArray()
          for fn in fns
            do ( key, fn ) =>

              # The ideal case: the method we want to intercept
              # already exists. In this case, we wrap the method
              # with the before or after interceptor function.
              if (@hasOwnProperty(key) or klass::hasOwnProperty(key)) and
                  not (@[key].before? or @[key].after?)
                interceptable = @[key]
                @[key] = ( args... ) ->
                  (@[fn] or fn).apply @, args if placement is 'before'
                  ret = interceptable.apply @, args
                  (@[fn] or fn).apply @, args if placement is 'after'
                  return ret

              # If the interceptable method isn't yet defined, things
              # are a bit more difficult. By creating a setter and
              # a getter on the key of that method, we are able to
              # intercept when the method eventually gets defined, and
              # wrap it at that point.
              else
                # This might not be the first time we define an interceptor
                # on this yet-to-be defined method. So we need to chain these
                # too.
                before = if @[key]?.klass is klass then @[key]?.before
                after  = if @[key]?.klass is klass then @[key]?.after

                if placement is 'before'
                  prev = before
                  before = ( args... ) ->
                    prev?.apply @, args
                    (@[fn] or fn).apply @, args

                else if placement is 'after'
                  prev = after
                  after = ( args... ) ->
                    (@[fn] or fn).apply @, args
                    prev?.apply @, args

                Object.defineProperty @, key,
                  configurable: true

                  # Wrap the interceptable that is defined
                  # by when calling the following setter.
                  set: ( interceptable ) ->
                    # TODO: Look into this. This seems to be
                    # the only way to avoid call stack size
                    # exceptions.
                    Object.defineProperty @, key,
                      writable: true
                      value: ( args... ) ->
                        before?.apply @, args
                        ret = interceptable.apply @, args
                        after?.apply @, args
                        return ret

                  # In case the method won't get defined at
                  # all, we wrap our super's method by the
                  # interceptors.
                  get: ( ) ->
                    interceptor = ( args... ) ->
                      before?.apply @, args
                      superFn = @constructor.__super__?[key]
                      ret = superFn?.apply @, args unless superFn?.klass is klass
                      after?.apply @, args
                      return ret

                    interceptor.before = before
                    interceptor.after = after
                    interceptor.klass = klass
                    return interceptor

  ClassMethods:
    before: ( interceptors ) ->
      if interceptors?()?
        @before initialize: -> @before interceptors.call @
      else @::before interceptors

    after: ( interceptors ) ->
      if interceptors?()?
        @before initialize: -> @after interceptors.call @
      else @::after interceptors

module.exports = Interceptable

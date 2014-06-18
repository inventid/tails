#= require core/app
#= require mixins/dynamic_properties

# This mixin mainly serves as a helper to other mixins. It allows
# them to execute code before or after a method is invoked. The bulk
# of this mixin's complexity is due to the fact that one might want
# to set an interceptor before the interceptable method is defined, or
# that it might not be defined at all! This is why we strategically
# place setters and getters on the object, so that when the class gets
# to the point where it defines the interceptable method, the setter
# will replace itself with the interceptable method wrapped by the
# interceptors. Chaining of interceptors also proved to be a challenge
# in this scenario.
#
Tails.Mixins.Interceptable =

    ClassMethods:
        before: ( befores, fn = null ) ->
            @intercept 'before', befores, fn

        after: ( afters, fn = null ) ->
            @intercept 'after', afters, fn

        # placement, fn1: fn2
        # placement, fn1: 'fn2'
        # placement, 'fn1', fn2
        # placement, 'fn1', 'fn2'
        # placement, ['fn1', 'fn2'], fn3
        # placement, ['fn1', 'fn2'], 'fn3'
        intercept: ( placement, interceptors, fn = null ) ->
            if _(interceptors).isString()
                throw new Error('Function expected but none was given.') unless typeof fn in ['function', 'string']
                key = interceptors
                interceptors = {}
                interceptors[key] = fn

            else if _(interceptors).isArray()
                throw new Error('Function expected but none was given.') unless typeof fn in ['function', 'string']
                keys = interceptors
                interceptors = {}
                for key in keys
                    interceptors[key] = fn

            for key, fn of interceptors
                do ( key, fn ) =>

                    # If the prototype has not yet defined the property, or
                    # the property is an interceptor,
                    if not @::hasOwnProperty(key) or @::[key].before? or @::[key].after?

                        before = ( if @::[key]?.klass is @ then @::[key]?.before ) or ( ( ) -> )
                        after  = ( if @::[key]?.klass is @ then @::[key]?.after )  or ( ( ) -> )

                        # If the property has defined an interceptor we merge the
                        # previous interceptor with the new one
                        if placement is 'before'
                            prev = before
                            before = ( args... ) ->
                                (@[fn] or fn).apply @, args
                                prev.apply @, args

                        else if placement is 'after'
                            prev = after
                            after = ( args... ) ->
                                prev.apply @, args
                                (@[fn] or fn).apply @, args

                        # Add a setter which will replace itself with the function it's
                        # called with, applying the interceptor before or after it.
                        @::setter key, ( interceptable ) ->
                            delete @[key]

                            @[key] = ( args ... ) ->
                                before.apply(@, args)
                                ret = interceptable.apply(@, args)
                                after.apply(@, args)
                                return ret

                        # Add a getter which returns the newly applied interceptor
                        # to provide chaining of interceptors. The possibility exists
                        # this method will not be overwritten by the class, so we need
                        # to act accordingly. When this method is called, we apply the
                        # before and after calls around the call to our superclass'
                        # similarly named method.
                        klass = @
                        @::getter key, ( ) ->
                            interceptor = ( args... ) ->
                                before.apply(@, args)

                                # Call the like-named method on our super class.
                                superFn = @constructor.__super__?[key]
                                ret = superFn.apply(@, args) unless superFn.klass is klass

                                after.apply(@, args)
                                return ret

                            interceptor.before = before
                            interceptor.after = after
                            interceptor.klass = klass
                            return interceptor

                    # The interceptable method exists. Just wrap it with the before
                    # or after function.
                    else
                        interceptable = @::[key]
                        @::[key] = ( args... ) ->
                            (@[fn] or fn).apply(@, args) if placement is 'before'
                            ret = interceptable.apply(@, args)
                            (@[fn] or fn).apply(@, args) if placement is 'after'
                            return ret

    extended: ( ) ->
        @include Tails.Mixins.DynamicProperties

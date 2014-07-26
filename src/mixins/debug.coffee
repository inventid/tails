# Makes classes print a log message after instantiation of a new
# instance and instances print a log message after an attribute changes.
#
Tails.Mixins.Debug =

  ClassMethods:
    extended: ( ) ->
      @concern Tails.Mixins.Interceptable

      @after initialize: ->
        @log "New #{@constructor.name}", JSON.stringify @

  InstanceMethods:
    log: ( strings... ) ->
      console.log new Date(), strings

    included: ( ) ->
      @concern Tails.Mixins.Interceptable

      @after initialize: ->
        @on "change", () =>
          @log "Change of attribute in #{@constructor.name}", JSON.stringify @

# Makes classes print a log message after instantiation of a new
# instance and instances print a log message after an attribute changes.
#
Tails.Mixins.Debug =

  InstanceMethods:
    LOG_LEVELS :
      "ERROR"   : on
      "WARNING" : on
      "INFO"    : off

    _excludedMethods : _.union Object.keys(Tails.Mixins.Interceptable.InstanceMethods), [
      "constructor", "log", "message", "warn", "error", "info"
    ]

    debug: () ->
      @LOG_LEVELS.INFO = on

    message: (things...) ->
      line = "#{new Date()} - "
      for thing in things
        if thing.constructor.name is "String"
          line += thing + " "
        else
          line += JSON.stringify(thing) + " "

      line+= "in #{@constructor.name}(#{@id})"
      return line

    error: ( things... ) ->
      return unless @LOG_LEVELS.ERROR
      line = @message things...
      console.error line

    warn: ( things... ) ->
      return unless @LOG_LEVELS.WARNING
      line = @message things...
      console.warn line

    log: ( things... ) ->
      line = @message things...
      console.log line

    info: ( things... ) ->
      return unless @LOG_LEVELS.INFO
      line = @message things...
      console.log line


    included: ( ) ->
      @concern Tails.Mixins.Interceptable

      @after initialize: (args...) ->
        @info "Called function 'initialize' of #{@constructor.name} with arguments:", args

        @on "change", (event) =>
          @info "Change of attributes:", event.changedAttributes()

        funcs = for key, value of @
          if value instanceof Function and key not in @_excludedMethods
            key
          else continue

        for key in funcs
          do (key) =>
            @after "these": [key], "do" : (args...) ->
              @info "Called function '#{key}' of #{@constructor.name} with arguments:", args

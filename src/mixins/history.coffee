#
Tails.Mixins.History =

  Interactions: () ->
    InstanceMethods:
      @with Tails.Mixins.Storage,
        diff: ( ) ->
          diff = {}
          # The apply function
          diff.apply = (context = @) =>
            # console.log "Applying diff to instance #{@id} of", @constructor.name, JSON.stringify diff
            for key, change of diff
              for type, values of change
                switch type
                  when "create"
                    context.set key, values["value"]
                  when "update"
                    context.set key, values["new"]
                  when "delete"
                    context.unset key
            return context

          # Generate the changeset
          prevAttrs = @constructor.retrieve(@id) or {}
          for key, value of @attributes
            if prevAttrs[key] isnt @get key
              if prevAttrs[key]?
                diff[key] = "update":
                  "old" : prevAttrs[key]
                  "new" : @get key
              else
                diff[key] = "create":
                  "value" : @get key

          for key, value of prevAttrs
            if not @has key
                diff[key] = "delete":
                  "value" : value

          return diff

        commit: () ->
          key = @store @diff()
          return key

        included: ( ) ->
          @after initialize: () ->
            @on "change", @commit

# The basic template model. Will use rivets.js for binding
# objects to the template.
#
class Tails.Template extends App.Model
    @concern App.Mixins.Collectable

    urlRoot: '/assets'
    format:  'html'

    initialize: ( attrs = {}, options = {} ) ->
        super

    # Binds an object - in most cases an instance of App.Model -
    # to the template using rivets.js.
    bind: ( view ) ->
        return @fetch().then ( ) =>
            $el = @$el.clone()
            rivets.bind $el, view
            return $el

    parse: ( response, options ) ->
        return $el: $(response)

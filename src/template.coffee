# The basic template model. Will use rivets.js for binding
# objects to the template.
#
class Tails.Template extends Tails.Model
  @concern Tails.Mixins.Collectable

  urlRoot: 'assets'
  format:  'html'

  # Binds an object to the template using rivets.js.
  bind: ( view ) ->
    return @fetch(parse: true).then ( ) =>
      $el = @get('$el').clone()
      rivets.bind $el, view
      return $el

  parse: ( response, options ) ->
    return $el: $(response)

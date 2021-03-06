# The basic template model. Will use rivets.js for binding
# objects to the template.
#
class Tails.Template extends Tails.Model
  @concern Tails.Mixins.Collectable

  urlRoot: 'assets'
  format:  'html'
  acceptFormat: 'text/html'

  # Binds an object to the template using rivets.js.
  bind: ( view ) ->
    return @fetch(parse: true).then ( ) =>
      $el = $(@get('html')).clone()
      rivets.bind $el, view
      return $el

  parse: ( response, options ) ->
    return html: response

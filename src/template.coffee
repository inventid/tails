# The basic template model. Will use rivets.js for binding
# objects to the template.
#

Collectable = require('./mixins/collectable')
Model       = require('./model')

class Template extends Model
  @concern Collectable

  urlRoot: 'assets'
  format:  'html'

  # Binds an object to the template using rivets.js.
  bind: ( view ) ->
    return @fetch(parse: true).then ( ) =>
      $el = $(@get('html')).clone()
      rivets.bind $el, view
      return $el

  parse: ( response, options ) ->
    return html: response

module.exports = Collectable

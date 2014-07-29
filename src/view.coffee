# We assume that views always have one template. This template's
# element will be made available through @$el. As not every view
# will necessarily have a model, the model has to be manually
# bound.
#
class Tails.View extends Backbone.View
    _.extend @, Tails.Mixable

    initialize: ( options = {} ) ->
        @template = Tails.Template.get(@template) if @template.constructor is String

        @template.bind(@)
            .then ( $el ) =>
                @setElement($el)
                @render()
        super options

    render: ( ) ->
        # Make sure events are set properly. When
        # the view is removed and re-added to the
        # DOM, we need to re-set the events.
        @delegateEvents()

    setView: ( view ) ->
        @view = view
        @view.render()

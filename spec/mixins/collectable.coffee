describe "Tails.Mixins.Collectable", ->

  beforeEach ->
    class @Model extends Backbone.Model
      _.extend(@, Tails.Mixable)
      @concern(Tails.Mixins.Collectable)

  describe "when extended", ->
    it "should ensure, by throwing an error, no duplicate models are loaded", ->
      createModel = => new @Model({id: 1})
      createModel()
      expect(createModel).toThrow()




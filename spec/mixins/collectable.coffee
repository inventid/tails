describe "Tails.Mixins.Collectable", ->

  beforeEach ->
    localStorage.clear()
    class @Model extends Backbone.Model
      _.extend(@, Tails.Mixable)
      @concern(Tails.Mixins.Collectable)

  describe "creation", ->
    it "should ensure, by throwing an error, no duplicate models are loaded", ->
      createModel = => new @Model({id: 1})
      createModel()
      expect(createModel).toThrow()







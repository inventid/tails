describe "Tails.Mixins.History", ->

  beforeEach ->
    localStorage.clear()
    class @Model extends Backbone.Model
      _.extend @, Tails.Mixable
      @concern Tails.Mixins.Storage
      @concern Tails.Mixins.History

  describe "creation", ->
    it "should store itself in local storage", ->
      class Fruit extends @Model

      apple = new Fruit id : 1
      apple.set prop: "val"

      changes = apple.diff()
      apple.unset "prop"

      pear = new Fruit id : 2

      changes.apply(pear)
      expect(apple.get "prop").not.toBe("val")
      expect(pear.get "prop").toBe("val")
      changes.apply()
      expect(apple.get "prop").toBe("val")

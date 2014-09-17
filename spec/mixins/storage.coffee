describe "Tails.Mixins.Storage", ->

  beforeEach ->
    localStorage.clear()
    class @Model extends Backbone.Model
      _.extend @, Tails.Mixable
      @concern Tails.Mixins.Storage

  describe "creation", ->
    it "should store itself in local storage", ->
      class Fruit extends @Model

      apple = new Fruit id: 1, prop: "val"
      apple.trigger "sync"

      pear = new Fruit id: 1

      expect(pear.get "prop").toEqual("val")

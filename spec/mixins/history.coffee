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

      console.log JSON.stringify apple
      console.log JSON.stringify changes.apply(pear)
      changes.apply()
      console.log JSON.stringify apple

      console.log JSON.stringify localStorage

describe "Tails.Mixins.History", ->

  beforeEach ->
    localStorage.clear()
    class @Model extends Backbone.Model
      _.extend @, Tails.Mixable
      @concern Tails.Mixins.Collectable
      @concern Tails.Mixins.History

    class @OtherModel extends Backbone.Model
      _.extend @, Tails.Mixable
      @concern Tails.Mixins.History

  describe "creation", ->
    it "should store itself in local storage", ->
      class Fruit extends @Model

      apple = Fruit.get 1
      apple.set "test", "1"
      apple.set "test2", "2"
      apple.set "test3", "3"
      apple.set "test4", "4"

      apple.trigger "sync"
      expect(Fruit.retrieve(apple.get "id")).toEqual(apple.attributes)

      Fruit.get 2
      Fruit.get 3

      console.log Fruit.retrieve()

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

    it "should store itself in local storage", ->
     class Fruit extends Tails.Model
        _.extend @, Tails.Mixable
        @concern Tails.Mixins.Collectable

      a = Fruit.get(4)
      a.set "prop", "val"
      a.store()


      class Fruit extends Tails.Model
        _.extend @, Tails.Mixable
        @concern Tails.Mixins.Collectable

      Fruit.reset()
      Fruit.retrieve()

      console.log JSON.stringify Fruit.collection().models

      # b = Fruit.get(4)
      # expect(b.get('prop')).toEqual("val")






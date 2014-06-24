describe "Tails.Mixins.Collectable", ->

  beforeEach ->
    class @Model extends Backbone.Model
      _.extend(@, Tails.Mixable)
      @extend(Tails.Mixins.Collectable)

  describe ".all", ->

    it "should return a collection", ->
      expect(@Model.all() instanceof Tails.Collection).toBe(true)

    it "should not return the a subclass' superclass' collection", ->
      class SubModel extends @Model
      expect(SubModel.all()).not.toEqual(@Model.all())

  describe ".get", ->

    it "should return a new model when one with the given id isn't present", ->
      expect(@Model.all().length).toEqual(0)
      model = @Model.get(1)
      expect(@Model.all().length).toEqual(1)

    it "should return the model with the given id when it exists", ->
      getModel = ( ) => @Model.get(1)
      model = getModel()
      expect(getModel()).toEqual(model)
      expect(@Model.all().length).toEqual(1)

  describe "when extended", ->

    it "should ensure, by throwing an error, no duplicate models are loaded", ->
      createModel = => new @Model({id: 1})
      createModel()
      expect(createModel).toThrow()


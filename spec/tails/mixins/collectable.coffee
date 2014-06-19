describe "Tails.Mixins.Collectable", ->

  beforeEach ->
    class @Model extends Backbone.Model
      _.extend(@, Tails.Mixable)
      @extend(Tails.Mixins.Collectable)

  describe ".ClassMethods", ->

    describe ".all", ->

      it "should return a collection", ->
        expect(@Model.all()).to.be.an.instanceof(Tails.Collection)

      it "should not return the a subclass' superclass' collection", ->
        class SubModel extends @Model
        expect(SubModel.all()).not.to.equal(@Model.all())

    describe ".get", ->

      it "should return a new model when one with the given id isn't present", ->
        expect(@Model.all().length).to.equal(0)
        model = @Model.get(1)
        expect(@Model.all().length).to.equal(1)

      it "should return the model with the given id when it exists", ->
        getModel = ( ) => @Model.get(1)
        model = getModel()
        expect(getModel()).to.equal(model)
        expect(@Model.all().length).to.equal(1)

  describe ".extended", ->

    it "should extend Tails.Mixins.Interceptable", ->
      class Model extends Backbone.Model
        _.extend(@, Tails.Mixable)

      spy = sinon.spy(Model, 'extend')
      Model.extend(Tails.Mixins.Collectable)
      expect(spy).to.have.been.calledWith(Tails.Mixins.Interceptable)

    it "should ensure, by throwing an error, no duplicate models are loaded", ->
      createModel = => new @Model({id: 1})
      createModel()
      expect(createModel).to.throw(Error)


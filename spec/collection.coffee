describe "Tails.Collection", ->

  describe "#constructor", ->

    it "should set its parent property when options provide one", ->
      collection = new Tails.Collection()
      expect(collection.parent).to.equal(undefined)

      model = new Tails.Model()
      collection = new Tails.Collection(null, parent: model)
      expect(collection.parent).to.equal(model)

    it "should use the model class when options provide one", ->
      class Tails.Models.Fruit extends Tails.Model
      collection = new Tails.Collection(null, { model: Tails.Models.Fruit })
      expect(collection.model).to.equal(Tails.Models.Fruit)

    it "should detect its model class when none is provided", ->
      collection = new Tails.Collection()
      expect(collection.model).to.equal(Tails.Model)

      class Tails.Models.Fruit extends Tails.Model
      class Tails.Collections.Fruits extends Tails.Collection
      collection = new Tails.Collections.Fruits
      expect(collection.model).to.equal(Tails.Models.Fruit)

  describe "#urlRoot", ->

    it "should return a string", ->
      collection = new Tails.Collection()
      expect(collection.urlRoot()).to.be.a('string')

    it "should contain the collection's model's name, pluralized and underscored", ->
      class Tails.Models.RedFruit extends Tails.Model
      class Tails.Collections.RedFruits extends Tails.Collection
      collection = new Tails.Collections.RedFruits()
      expect(collection.urlRoot()).to.contain('red_fruits')

  describe "#url", ->

    it "should return a string", ->
      collection = new Tails.Collection()
      expect(collection.url()).to.be.a('string')

    it "should contain the App url", ->
      collection = new Tails.Collection()
      expect(collection.url()).to.contain(Tails.url)

    it "should contain the url root", ->
      collection = new Tails.Collection()
      expect(collection.url()).to.contain((new collection.model).urlRoot())

    it "should contain the parent url root when the model has a parent", ->
      class ParentModel extends Tails.Model
      parentModel = new ParentModel()
      collection = new Tails.Collection(null, { parent: parentModel })
      expect(collection.url()).to.contain(parentModel.urlRoot())

    it "should contain the format", ->
      format = 'html'
      collection = new Tails.Collection()
      collection.format = format
      expect(collection.url()).to.contain(format)

  describe "#_prepareModel", ->

    it "should be tested"

#= require vendor
#= require core/collection

describe "App.Collection", ->

    describe "#constructor", ->

        it "should set its parent property when options provide one", ->
            collection = new App.Collection()
            expect(collection.parent).to.equal(undefined)

            model = new App.Model()
            collection = new App.Collection(null, parent: model)
            expect(collection.parent).to.equal(model)

        it "should use the model class when options provide one", ->
            class App.Models.Fruit extends App.Model
            collection = new App.Collection(null, { model: App.Models.Fruit })
            expect(collection.model).to.equal(App.Models.Fruit)

        it "should detect its model class when none is provided", ->
            collection = new App.Collection()
            expect(collection.model).to.equal(App.Model)

            class App.Models.Fruit extends App.Model
            class App.Collections.Fruits extends App.Collection
            collection = new App.Collections.Fruits
            expect(collection.model).to.equal(App.Models.Fruit)

    describe "#urlRoot", ->

        it "should return a string", ->
            collection = new App.Collection()
            expect(collection.urlRoot()).to.be.a('string')

        it "should contain the collection's model's name, pluralized and underscored", ->
            class App.Models.RedFruit extends App.Model
            class App.Collections.RedFruits extends App.Collection
            collection = new App.Collections.RedFruits()
            expect(collection.urlRoot()).to.contain('red_fruits')

    describe "#url", ->

        it "should return a string", ->
            collection = new App.Collection()
            expect(collection.url()).to.be.a('string')

        it "should contain the App url", ->
            collection = new App.Collection()
            expect(collection.url()).to.contain(App.url)

        it "should contain the url root", ->
            collection = new App.Collection()
            expect(collection.url()).to.contain((new collection.model).urlRoot())

        it "should contain the parent url root when the model has a parent", ->
            class ParentModel extends App.Model
            parentModel = new ParentModel()
            collection = new App.Collection(null, { parent: parentModel })
            expect(collection.url()).to.contain(parentModel.urlRoot())

        it "should contain the format", ->
            format = 'html'
            collection = new App.Collection()
            collection.format = format
            expect(collection.url()).to.contain(format)

    describe "#_prepareModel", ->

        it "should be tested"

#= require vendor
#= require core/model

describe "App.Model", ->

    describe "#constructor", ->

        it "should set its parent property when options provide one", ->
            model = new App.Model()
            expect(model.parent).to.equal(undefined)

            parent = new App.Model()
            model = new App.Model({}, parent: parent)
            expect(model.parent).to.equal(parent)

        it "should set its synced property when options provide one", ->
            model = new App.Model()
            expect(model.synced).to.equal(false)

            model = new App.Model({}, synced: true)
            expect(model.synced).to.equal(true)

        it "should set its synced property to true when the model triggers a sync event", ->
            model = new App.Model()
            expect(model.synced).to.equal(false)

            model.trigger('sync')
            expect(model.synced).to.equal(true)

        it "should make getters and setters for the model's attributes after one has been set", ->
            model = new App.Model()
            expect(model.someAttribute).to.equal(undefined)

            model.set('some_attribute', 1)
            expect(model.someAttribute).to.equal(1)

            model.someAttribute = 2
            expect(model.someAttribute).to.equal(2)
            expect(model.get('some_attribute')).to.equal(2)

    describe "#urlRoot", ->

        it "should return a string", ->
            model = new App.Model()
            expect(model.urlRoot()).to.be.a('string')

        it "should contain the model's name, underscored and pluralized", ->
            class SomeModelName extends App.Model
            model = new SomeModelName()
            expect(model.urlRoot()).to.contain('some_model_names')

    describe "#url", ->

        it "should return a string", ->
            model = new App.Model()
            expect(model.url()).to.be.a('string')

        it "should contain the App url", ->
            model = new App.Model()
            expect(model.url()).to.contain(App.url)

        it "should contain the url root", ->
            model = new App.Model()
            expect(model.url()).to.contain(model.urlRoot())

        it "should contain the parent url root when the model has a parent", ->
            class ParentModel extends App.Model
            parentModel = new ParentModel()
            model = new App.Model({}, parent: parentModel)
            expect(model.url()).to.contain(parentModel.urlRoot())

        it "should contain the model id", ->
            id = 1234321
            model = new App.Model(id: id)
            expect(model.url()).to.contain(id)

    describe "#fetch", ->

        it "should be tested"




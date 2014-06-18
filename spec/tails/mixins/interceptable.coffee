#= require sinon
#= require sinon-chai
#= require vendor
#= require core/mixable
#= require mixins/interceptable

describe "App.Mixins.Interceptable", ->


    describe ".ClassMethods", ->

        beforeEach ->
            class @Model extends Backbone.Model
                _.extend(@, App.Mixable)
                @extend(App.Mixins.Interceptable)

                fn: sinon.spy()
                anotherFn: sinon.spy()
                yetAnotherFn: sinon.spy()

        describe ".before", ->

            it "should forward its arguments to .intercept", ->
                spy = sinon.spy(@Model, 'intercept')
                map = initialize: ->
                @Model.before(map)

                expect(spy).to.have.been.calledOnce
                expect(spy).to.have.been.calledWith('before', map, null)

        describe ".after", ->

            it "should forward its arguments to .intercept", ->
                spy = sinon.spy(@Model, 'intercept')
                map = initialize: ->
                @Model.after(map)

                expect(spy).to.have.been.calledOnce
                expect(spy).to.have.been.calledWith('after', map, null)

        describe ".intercept", ->

            it "should accept interceptors as an object map", ->
                spy = sinon.spy()
                fn = @Model::fn
                @Model.intercept('before', fn: spy)

                model = new @Model()
                model.fn()

                expect(fn).to.have.been.calledOnce
                expect(spy).to.have.been.calledOnce
                expect(model.fn).not.to.equal(fn)

            it "should accept interceptors as a string and a function", ->
                spy = sinon.spy()
                fn = @Model::fn
                @Model.intercept('before', 'fn', spy)

                model = new @Model()
                model.fn()

                expect(fn).to.have.been.calledOnce
                expect(spy).to.have.been.calledOnce
                expect(model.fn).not.to.equal(fn)

            it "should accept interceptors as a string and a string", ->
                fn = @Model::fn
                anotherFn = @Model::anotherFn
                @Model.intercept('before', 'fn', 'anotherFn')

                model = new @Model()
                model.fn()

                expect(fn).to.have.been.calledOnce
                expect(anotherFn).to.have.been.calledOnce

                expect(model.fn).not.to.equal(fn)
                expect(model.anotherFn).to.equal(anotherFn)

            it "should accept interceptors as an array and a function", ->
                spy = sinon.spy()
                fn = @Model::fn
                anotherFn = @Model::anotherFn
                @Model.intercept('before', ['fn', 'anotherFn'], spy)

                model = new @Model()
                model.fn()
                model.anotherFn()

                expect(fn).to.have.been.calledOnce
                expect(anotherFn).to.have.been.calledOnce
                expect(spy).to.have.been.calledTwice
                expect(model.fn).not.to.equal(fn)
                expect(model.anotherFn).not.to.equal(anotherFn)

            it "should accept interceptors as an array and a string", ->
                fn = @Model::fn
                anotherFn = @Model::anotherFn
                yetAnotherFn = @Model::yetAnotherFn
                @Model.intercept('before', ['fn', 'anotherFn'], 'yetAnotherFn')

                model = new @Model()
                model.fn()
                model.anotherFn()

                expect(fn).to.have.been.calledOnce
                expect(anotherFn).to.have.been.calledOnce
                expect(yetAnotherFn).to.have.been.calledTwice
                expect(model.fn).not.to.equal(fn)
                expect(model.anotherFn).not.to.equal(anotherFn)
                expect(model.yetAnotherFn).to.equal(yetAnotherFn)

            it "should throw an error when a string was given but no function provided", ->
                fn = @Model::fn
                intercept = -> @Model.intercept('before', 'fn')
                expect(intercept).to.throw(Error)

                model = new @Model()
                expect(model.fn).to.equal(fn)

            it "should throw an error when an array was given but no function was provided", ->
                fn = @Model::fn
                anotherFn = @Model::anotherFn
                intercept = -> @Model.intercept('before', ['fn', 'anotherFn'])
                expect(intercept).to.throw(Error)

                model = new @Model()
                expect(model.fn).to.equal(fn)
                expect(model.anotherFn).to.equal(anotherFn)

            it "should execute 'before' methods before the given method", ->
                spy = sinon.spy()
                fn = @Model::fn
                @Model.intercept('before', fn: spy)

                model = new @Model()
                model.fn()

                expect(spy).to.have.been.calledBefore(fn)

            it "should execute 'after' methods after the given method", ->
                spy = sinon.spy()
                fn = @Model::fn
                @Model.intercept('after', fn: spy)

                model = new @Model()
                model.fn()

                expect(spy).to.have.been.calledAfter(fn)

            it "should be able to chain 'before' methods", ->
                spy1 = sinon.spy()
                spy2 = sinon.spy()
                fn = @Model::fn
                @Model.intercept('before', fn: spy1)
                @Model.intercept('before', fn: spy2)

                model = new @Model()
                model.fn()

                expect(spy2).to.have.been.calledBefore(spy1)
                expect(spy1).to.have.been.calledBefore(fn)

            it "should be able to chain 'after' methods", ->
                spy1 = sinon.spy()
                spy2 = sinon.spy()
                fn = @Model::fn
                @Model.intercept('after', fn: spy1)
                @Model.intercept('after', fn: spy2)

                model = new @Model()
                model.fn()

                expect(spy1).to.have.been.calledAfter(fn)
                expect(spy2).to.have.been.calledAfter(spy1)

            it "should be able to chain 'before' and 'after' methods", ->
                spy1 = sinon.spy()
                spy2 = sinon.spy()
                fn = @Model::fn
                @Model.intercept('before', fn: spy1)
                @Model.intercept('after', fn: spy2)

                model = new @Model()
                model.fn()

                expect(spy1).to.have.been.calledBefore(fn)
                expect(spy2).to.have.been.calledAfter(fn)

            it "should apply interceptors when the interceptable method hasn't yet been defined", ->
                before1 = sinon.spy()
                before2 = sinon.spy()
                fn = sinon.spy()
                after1 = sinon.spy()
                after2 = sinon.spy()

                class Model extends Backbone.Model
                    _.extend(@, App.Mixable)
                    @extend(App.Mixins.Interceptable)

                    @before fn: before2
                    @before fn: before1
                    @after fn: after1
                    @after fn: after2

                    fn: fn

                model = new Model()
                model.fn()

                expect(before1).to.have.been.calledBefore(before2)
                expect(before2).to.have.been.calledBefore(fn)
                expect(after1).to.have.been.calledAfter(fn)
                expect(after2).to.have.been.calledAfter(after1)

                expect(fn).to.have.been.calledOnce
                expect(before1).to.have.been.calledOnce
                expect(before2).to.have.been.calledOnce
                expect(after1).to.have.been.calledOnce
                expect(after2).to.have.been.calledOnce

            it "should work correctly when a subclass' superclass has an interceptor", ->
                # Interceptor on superclass
                spy = sinon.spy()

                class SuperClass extends Backbone.Model
                    _.extend(@, App.Mixable)
                    @extend(App.Mixins.Interceptable)

                    @before initialize: spy

                class SubClass extends SuperClass

                subClass = new SubClass()
                expect(spy).to.have.been.calledOnce

                # Interceptor on sub and superclass
                superSpy = sinon.spy()
                subSpy = sinon.spy()

                class SuperClass extends Backbone.Model
                    _.extend(@, App.Mixable)
                    @extend(App.Mixins.Interceptable)
                    @before initialize: superSpy

                class SubClass extends SuperClass
                    @before initialize: subSpy

                subClass = new SubClass()
                expect(superSpy).to.have.been.calledOnce
                expect(subSpy).to.have.been.calledOnce

                # Interceptor on sub and superclass, superclass defining the method
                initialize = sinon.spy()
                superSpy = sinon.spy()
                subSpy = sinon.spy()

                class SuperClass extends Backbone.Model
                    _.extend(@, App.Mixable)
                    @extend(App.Mixins.Interceptable)
                    @before initialize: superSpy
                    initialize: initialize

                class SubClass extends SuperClass
                    @before initialize: subSpy

                subClass = new SubClass()
                expect(superSpy).to.have.been.calledOnce
                expect(subSpy).to.have.been.calledOnce
                expect(initialize).to.have.been.calledOnce

                # Interceptor on sub and superclass, subclass defining the method
                initialize = sinon.spy()
                superSpy = sinon.spy()
                subSpy = sinon.spy()

                class SuperClass extends Backbone.Model
                    _.extend(@, App.Mixable)
                    @extend(App.Mixins.Interceptable)
                    @before initialize: superSpy

                class SubClass extends SuperClass
                    @before initialize: subSpy
                    initialize: initialize

                subClass = new SubClass()
                expect(superSpy).to.have.been.calledOnce
                expect(subSpy).to.have.been.calledOnce
                expect(initialize).to.have.been.calledOnce

    describe ".extended", ->

        it "should include App.Mixins.DynamicProperties", ->
            class Model extends Backbone.Model
                _.extend(@, App.Mixable)

            spy = sinon.spy(Model, 'include')
            Model.extend(App.Mixins.Interceptable)
            expect(spy).to.have.been.calledWith(App.Mixins.DynamicProperties)

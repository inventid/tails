#= require sinon
#= require sinon-chai
#= require vendor
#= require core/mixable
#= require mixins/dynamic_properties

describe "App.Mixins.DynamicProperties", ->

    beforeEach ->
        class @SomeClass
            _.extend(@, App.Mixable)
            @concern(App.Mixins.DynamicProperties)

        @instance = new @SomeClass()

    describe ".Methods", ->

        describe ".getter", ->

            it "should call #defineProperty and forward it's arguments", ->
                fn = ( ) -> return 5
                spy = sinon.spy(@instance, 'defineProperty')

                @instance.getter 'attribute', fn
                expect(spy).to.be.calledWith('getter', 'attribute', fn)

                @instance.getter attribute: fn
                expect(spy).to.be.calledWith('getter', { attribute: fn }, null)

        describe ".setter", ->

            it "should call #defineProperty and forward it's arguments", ->
                fn = ( ) -> return 5
                spy = sinon.spy(@instance, 'defineProperty')

                @instance.setter 'attribute', fn
                expect(spy).to.be.calledWith('setter', 'attribute', fn)

                @instance.setter attribute: fn
                expect(spy).to.be.calledWith('setter', { attribute: fn }, null)

        describe ".defineProperty", ->

            it "should throw an error when a string but no function is passed", ->
                getter = ( ) -> @instance.defineProperty('getter', 'attribute')
                setter = ( ) -> @instance.defineProperty('setter', 'attribute')

                expect(getter).to.throw(Error)
                expect(setter).to.throw(Error)

            describe "when defining a getter", ->

                it "should add a getter to an object by passing an object", ->
                    fn1 = sinon.spy()
                    fn2 = sinon.spy()

                    @instance.defineProperty('getter', { attribute1: fn1, attribute2: fn2 })

                    @instance.attribute1
                    expect(fn1).to.have.been.calledOnce

                    @instance.attribute2
                    expect(fn2).to.have.been.calledOnce

                it "should add a getter to an object through passing a string and a function", ->
                    fn = sinon.spy()

                    @instance.defineProperty('getter', 'attribute', fn)
                    @instance.attribute

                    expect(fn).to.have.been.calledOnce

                it "should overwrite the existing getter", ->
                    fn = sinon.spy()
                    newFn = sinon.spy()

                    @instance.defineProperty('getter', attribute: fn)
                    @instance.defineProperty('getter', attribute: newFn)
                    @instance.attribute

                    expect(fn).not.to.have.been.called
                    expect(newFn).to.have.been.calledOnce

                it "should not overwrite the existing setter", ->
                    getter = sinon.spy()
                    setter = sinon.spy()

                    @instance.defineProperty('setter', attribute: setter)
                    @instance.attribute = 3
                    expect(setter).to.have.been.calledOnce

                    @instance.defineProperty('getter', attribute: getter)
                    @instance.attribute
                    @instance.attribute = 4

                    expect(setter).to.have.been.calledTwice
                    expect(getter).to.have.been.calledOnce

            describe "when defining a setter", ->

                it "should add a setter by passing an object", ->
                    fn1 = sinon.spy()
                    fn2 = sinon.spy()

                    @instance.defineProperty('setter', { attribute1: fn1, attribute2: fn2 })

                    @instance.attribute1 = 1
                    expect(fn1).to.have.been.calledOnce
                    expect(fn1).to.have.been.calledWith(1)

                    @instance.attribute2 = 2
                    expect(fn2).to.have.been.calledOnce
                    expect(fn2).to.have.been.calledWith(2)


                it "should add a getter to an object through passing a string and a function", ->
                    fn = sinon.spy()

                    @instance.defineProperty('setter', 'attribute', fn)
                    @instance.attribute = 1

                    expect(fn).to.have.been.calledOnce
                    expect(fn).to.have.been.calledWith(1)

                it "should overwrite the existing setter", ->
                    fn = sinon.spy()
                    newFn = sinon.spy()

                    @instance.defineProperty('setter', attribute: fn)
                    @instance.defineProperty('setter', attribute: newFn)
                    @instance.attribute = 1

                    expect(fn).not.to.have.been.called
                    expect(newFn).to.have.been.calledOnce

                it "should not overwrite the existing getter", ->
                    setter = sinon.spy()
                    getter = sinon.spy()

                    @instance.defineProperty('getter', attribute: getter)
                    @instance.attribute
                    expect(getter).to.have.been.calledOnce

                    @instance.defineProperty('setter', attribute: setter)
                    @instance.attribute = 5
                    @instance.attribute

                    expect(getter).to.have.been.calledTwice
                    expect(setter).to.have.been.calledOnce

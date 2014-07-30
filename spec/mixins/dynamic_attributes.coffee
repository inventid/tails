describe "Tails.Mixins.DynamicAttributes", ->

  beforeEach ->

    class @Model extends Backbone.Model
      _.extend @, Tails.Mixable
      @concern Tails.Mixins.DynamicAttributes

  describe ".getter", ->

    it "should add the getter when passing a function", ->
      fn1 = jasmine.createSpy()
      fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        @getter -> prop1: fn1, prop2: fn2

      instance = new AnotherModel()
      instance.get 'prop1'
      instance.get 'prop2'
      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()

    it "should add the getter when passing an object", ->
      fn1 = jasmine.createSpy()
      fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        @getter prop1: fn1, prop2: fn2

      instance = new AnotherModel()
      instance.get 'prop1'
      instance.get 'prop2'
      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()

    it "should overwrite the existing getter", ->
      fn1 = jasmine.createSpy('fn1')
      fn2 = jasmine.createSpy('fn2')

      class AnotherModel extends @Model
        @getter prop1: fn1
        @getter prop1: fn2

      instance = new AnotherModel()
      instance.get 'prop1'

      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()

    it "should not overwrite the existing setter", ->
      fn1 = jasmine.createSpy()
      fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        @getter -> prop1: fn1
        @setter -> prop1: fn2

      instance = new AnotherModel()
      instance.get 'prop1'
      instance.set prop1: 3

      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()

  describe ".setter", ->

    it "should add the setter when passing a function", ->
      fn1 = jasmine.createSpy()
      fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        @setter -> prop1: fn1, prop2: fn2

      instance = new AnotherModel()
      instance.set prop1: 1
      instance.set prop2: 2
      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()

    it "should add the setter when passing an object", ->
      fn1 = jasmine.createSpy()
      fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        @setter prop1: fn1, prop2: fn2

      instance = new AnotherModel()
      instance.set prop1: 3
      instance.set prop2: 4
      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()

    it "should overwrite the existing setter", ->
      fn1 = jasmine.createSpy('fn1')
      fn2 = jasmine.createSpy('fn2')

      class AnotherModel extends @Model
        @setter prop1: fn1
        @setter prop1: fn2

      instance = new AnotherModel()
      instance.set prop1: 5

      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()

    it "should not overwrite the existing getter", ->
      fn1 = jasmine.createSpy()
      fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        @setter -> prop1: fn1
        @getter -> prop1: fn2

      instance = new AnotherModel()
      instance.set prop1: 6
      instance.get 'prop1'

      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()

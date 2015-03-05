describe "Tails.Mixins.DynamicAttributes", ->

  beforeEach ->

    class @Model extends Backbone.Model
      _.extend @, Tails.Mixable
      @concern Tails.Mixins.DynamicAttributes

  describe ".getter", ->

    it "should add the getter", ->
      fn1 = jasmine.createSpy()
      fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        @getter prop1: fn1, prop2: fn2

      instance = new AnotherModel()
      instance.get 'prop1'
      instance.get 'prop2'
      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()

    it "should add the getter when it's a string", ->
      class AnotherModel extends @Model
        @getter prop: 'fn'
        fn: jasmine.createSpy()

      instance = new AnotherModel()
      instance.get 'prop'
      expect(instance.fn).toHaveBeenCalled()

    # it "should use the default setter when none is defined", ->
    #   fn = jasmine.createSpy()

    #   class AnotherModel extends @Model
    #     @getter prop: fn

    #   instance = new AnotherModel()
    #   instance.set prop: 3

    #   expect(instance.get 'prop').toEqual(3)

    # it "should not overwrite a previously defined attribute", ->
    #   fn = jasmine.createSpy()

    #   class AnotherModel extends @Model
    #   instance = new AnotherModel()

    #   instance.set prop: 3
    #   instance.getter prop: fn

    #   instance.get 'prop'
    #   expect(fn).not.toHaveBeenCalled()

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
      set = jasmine.createSpy('set')
      get = jasmine.createSpy('get')

      class AnotherModel extends @Model
        @getter prop1: get
        @setter prop1: set

      instance = new AnotherModel()
      instance.get 'prop1'
      instance.set prop1: 3

      expect(get).toHaveBeenCalled()
      expect(set).toHaveBeenCalled()

  describe ".setter", ->

    it "should add the setter", ->
      fn1 = jasmine.createSpy()
      fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        @setter prop1: fn1, prop2: fn2

      instance = new AnotherModel()
      instance.set prop1: 3
      instance.set prop2: 4
      expect(fn1).toHaveBeenCalled()
      expect(fn2).toHaveBeenCalled()

    # it "should use the default getter when none is defined", ->
    #   spy = jasmine.createSpy()
    #   fn = ( value ) ->
    #     spy()
    #     value + 3

    #   class AnotherModel extends @Model
    #     @setter prop: fn

    #   instance = new AnotherModel()
    #   instance.set prop: 3

    #   expect(instance.get 'prop').toEqual(6)

    # it "should not overwrite a previously defined attribute", ->
    #   fn = jasmine.createSpy()

    #   class AnotherModel extends @Model
    #   instance = new AnotherModel()

    #   instance.set prop: 3
    #   instance.setter prop: fn

    #   instance.set 'prop', 5
    #   expect(fn).not.toHaveBeenCalled()

    it "should add the setter when it's a string", ->
      class AnotherModel extends @Model
        @setter prop: 'fn'
        fn: jasmine.createSpy()

      instance = new AnotherModel()
      instance.set 'prop'
      expect(instance.fn).toHaveBeenCalled()

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
      set = jasmine.createSpy('set')
      get = jasmine.createSpy('get')

      class AnotherModel extends @Model
        @setter prop1: set
        @getter prop1: get

      instance = new AnotherModel()
      instance.set prop1: 6
      instance.get 'prop1'

      expect(set).toHaveBeenCalled()
      expect(get).toHaveBeenCalled()

  describe ".lazy", ->
    it "should lazily initialize an attribute and call the initializer once", ->
      fn = jasmine.createSpy()
      class AnotherModel extends @Model
        @lazy prop: fn

      instance = new AnotherModel()
      expect(fn).not.toHaveBeenCalled()

      instance.get 'prop'
      expect(fn.calls.count()).toEqual(1)

      instance.get 'prop'
      expect(fn.calls.count()).toEqual(1)

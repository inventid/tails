describe "Tails.Mixins.Interceptable", ->

  beforeEach ->
    class @Model extends Backbone.Model
      _.extend @, Tails.Mixable
      @concern Tails.Mixins.Interceptable

  describe ".before", ->

    it "should add the interceptor when passing a function", ->
      _interceptor = jasmine.createSpy()
      _fn = jasmine.createSpy()

      class AnotherModel extends @Model
        @before -> fn: @interceptor
        interceptor: _interceptor
        fn: _fn

      instance = new AnotherModel()
      instance.fn()
      expect(_interceptor).toHaveBeenCalled()
      expect(_fn).toHaveBeenCalled()

    it "should add the interceptor when passing an object", ->
      interceptor = jasmine.createSpy()
      _fn = jasmine.createSpy()

      class AnotherModel extends @Model
        @before fn: interceptor
        fn: _fn

      instance = new AnotherModel()
      instance.fn()
      expect(interceptor).toHaveBeenCalled()
      expect(_fn).toHaveBeenCalled()

    it "should add interceptors when using these and do", ->
      _interceptor1 = jasmine.createSpy()
      _interceptor2 = jasmine.createSpy()
      _fn1 = jasmine.createSpy()
      _fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        fn1: _fn1
        interceptor2: _interceptor2
        @before -> these: [ @fn1, 'fn2' ], do: [ 'interceptor1', @interceptor2 ]
        interceptor1: _interceptor1
        fn2: _fn2

      instance = new AnotherModel()
      instance.fn1()
      instance.fn2()

      expect(_fn1.calls.count()).toBe(1)
      expect(_fn2.calls.count()).toBe(1)
      expect(_interceptor1.calls.count()).toBe(2)
      expect(_interceptor2.calls.count()).toBe(2)

    it "should chain interceptors", ->
      interceptor1 = jasmine.createSpy('interceptor1')
      interceptor2 = jasmine.createSpy('interceptor2')
      interceptor3 = jasmine.createSpy('interceptor3')
      _fn1 = jasmine.createSpy()
      _fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        @before -> fn1: interceptor1
        @before -> fn2: [interceptor2, interceptor3]
        fn1: _fn1
        fn2: _fn2

      AnotherModel::fn1()
      AnotherModel::fn2()
      expect(_fn1).toHaveBeenCalled()
      expect(_fn2).toHaveBeenCalled()
      expect(interceptor1).not.toHaveBeenCalled()
      expect(interceptor2).not.toHaveBeenCalled()
      expect(interceptor3).not.toHaveBeenCalled()

      instance = new AnotherModel()
      instance.fn1()
      instance.fn2()
      expect(interceptor1).toHaveBeenCalled()
      expect(interceptor2).toHaveBeenCalled()
      expect(interceptor3).toHaveBeenCalled()
      expect(_fn1.calls.count()).toBe(2)
      expect(_fn2.calls.count()).toBe(2)

  describe ".after", ->

    it "should add the interceptor to an instance of the class when passing a function", ->
      _interceptor = jasmine.createSpy('interceptor')
      _fn = jasmine.createSpy()

      class AnotherModel extends @Model
        @after -> fn: @interceptor
        interceptor: _interceptor
        fn: _fn

      AnotherModel::fn()
      expect(_fn).toHaveBeenCalled()
      expect(_interceptor).not.toHaveBeenCalled()

      instance = new AnotherModel()
      instance.fn()
      expect(_interceptor).toHaveBeenCalled()
      expect(_fn.calls.count()).toBe(2)

    it "should add the interceptor to the prototype of the class when passing an object", ->
      interceptor = jasmine.createSpy('interceptor')
      _fn = jasmine.createSpy()

      class AnotherModel extends @Model
        @after fn: interceptor
        fn: _fn

      AnotherModel::fn()
      expect(_fn).toHaveBeenCalled()
      expect(interceptor).toHaveBeenCalled()

      instance = new AnotherModel()
      instance.fn()
      expect(interceptor.calls.count()).toBe(2)
      expect(_fn.calls.count()).toBe(2)

    it "should add interceptors when using these and do", ->
      _interceptor1 = jasmine.createSpy()
      _interceptor2 = jasmine.createSpy()
      _fn1 = jasmine.createSpy()
      _fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        fn1: _fn1
        interceptor2: _interceptor2
        @after -> these: [ @fn1, 'fn2' ], do: [ 'interceptor1', @interceptor2 ]
        interceptor1: _interceptor1
        fn2: _fn2

      instance = new AnotherModel()
      instance.fn1()
      instance.fn2()

      expect(_fn1.calls.count()).toBe(1)
      expect(_fn2.calls.count()).toBe(1)
      expect(_interceptor1.calls.count()).toBe(2)
      expect(_interceptor2.calls.count()).toBe(2)

    it "should chain interceptors", ->
      interceptor1 = jasmine.createSpy('interceptor1')
      interceptor2 = jasmine.createSpy('interceptor2')
      interceptor3 = jasmine.createSpy('interceptor3')
      _fn1 = jasmine.createSpy()
      _fn2 = jasmine.createSpy()

      class AnotherModel extends @Model
        @after -> fn1: interceptor1
        @after -> fn2: [interceptor2, interceptor3]
        fn1: _fn1
        fn2: _fn2

      AnotherModel::fn1()
      AnotherModel::fn2()
      expect(_fn1).toHaveBeenCalled()
      expect(_fn2).toHaveBeenCalled()
      expect(interceptor1).not.toHaveBeenCalled()
      expect(interceptor2).not.toHaveBeenCalled()
      expect(interceptor3).not.toHaveBeenCalled()

      instance = new AnotherModel()
      instance.fn1()
      instance.fn2()
      expect(interceptor1).toHaveBeenCalled()
      expect(interceptor2).toHaveBeenCalled()
      expect(interceptor3).toHaveBeenCalled()
      expect(_fn1.calls.count()).toBe(2)
      expect(_fn2.calls.count()).toBe(2)

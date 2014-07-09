describe "Tails.Mixable", ->

  beforeEach ->
    class @Target
      _.extend(@, Tails.Mixable)

    @target = new @Target()

    @mixin =
      InstanceMethods:
        instanceFn: jasmine.createSpy()
        included: jasmine.createSpy()

      ClassMethods:
        classFn: jasmine.createSpy()
        extended: jasmine.createSpy()

    @anotherMixin =
      fn: jasmine.createSpy()
      included: jasmine.createSpy()
      extended: jasmine.createSpy()

  describe ".include", ->

    it "should call the included method of the mixin", ->
      @Target.include(@mixin, @anotherMixin)
      expect(@mixin.InstanceMethods.included).toHaveBeenCalled()
      expect(@anotherMixin.included).toHaveBeenCalled()

    it "should add all properties of mixin when no InstanceMethods are present", ->
      @Target.include(@anotherMixin)
      expect(@target.fn).toBeDefined()
      expect(@target.fn).toEqual(@anotherMixin.fn)

    it "should add all properties of mixin.InstanceMethods when InstanceMethods are present", ->
      @Target.include(@mixin)
      expect(@target.instanceFn).toBeDefined()
      expect(@target.instanceFn).toEqual(@mixin.InstanceMethods.instanceFn)

    it "should include the mixin only once", ->
      targetSpy = jasmine.createSpy()
      Object.defineProperty(@Target::, 'instanceFn', set: targetSpy)

      @Target.include(@mixin)
      expect(@mixin.InstanceMethods.included).toHaveBeenCalled()
      expect(targetSpy).toHaveBeenCalled()
      expect(targetSpy).toHaveBeenCalledWith(@mixin.InstanceMethods.instanceFn)

      @Target.include(@mixin)
      expect(@mixin.InstanceMethods.included).toHaveBeenCalled()
      expect(targetSpy).toHaveBeenCalled()

      class AnotherTarget extends @Target
      Object.defineProperty(AnotherTarget::, 'instanceFn', set: anotherTargetSpy)
      AnotherTarget.include(@mixin)

      anotherTarget = new AnotherTarget()
      anotherTargetSpy = jasmine.createSpy()

      expect(@mixin.InstanceMethods.included).toHaveBeenCalled()
      expect(anotherTargetSpy).not.toHaveBeenCalled()

  describe ".extend", ->

    it "should call the extended method of the mixin", ->
      @Target.extend(@mixin, @anotherMixin)
      expect(@mixin.ClassMethods.extended).toHaveBeenCalled()
      expect(@anotherMixin.extended).toHaveBeenCalled()

    it "should add all properties of mixin when no ClassMethods are present", ->
      @Target.extend(@anotherMixin)
      expect(@Target.fn).toBeDefined()
      expect(@Target.fn).toEqual(@anotherMixin.fn)

    it "should add all properties of mixin.ClassMethods when ClassMethods are present", ->
      @Target.extend(@mixin)
      expect(@Target.classFn).toBeDefined()
      expect(@Target.classFn).toEqual(@mixin.ClassMethods.classFn)

    it "should extend the mixin only once", ->
      targetSpy = jasmine.createSpy()
      Object.defineProperty(@Target, 'classFn', set: targetSpy)

      @Target.extend(@mixin)
      expect(@mixin.ClassMethods.extended).toHaveBeenCalled()
      expect(targetSpy).toHaveBeenCalled()
      expect(targetSpy).toHaveBeenCalledWith(@mixin.ClassMethods.classFn)

      @Target.extend(@mixin)
      expect(@mixin.ClassMethods.extended).toHaveBeenCalled()
      expect(targetSpy).toHaveBeenCalled()

      class AnotherTarget extends @Target
      anotherTargetSpy = jasmine.createSpy()
      Object.defineProperty(AnotherTarget, 'classFn', set: anotherTargetSpy)

      AnotherTarget.extend(@mixin)
      expect(@mixin.ClassMethods.extended).toHaveBeenCalled()
      expect(anotherTargetSpy).not.toHaveBeenCalled()

  describe ".concern", ->

    it "should call extend and include and forward its arguments", ->
      includeSpy = spyOn(@Target, 'include')
      extendSpy = spyOn(@Target, 'extend')

      @Target.concern(@mixin)

      expect(includeSpy).toHaveBeenCalled()
      expect(includeSpy).toHaveBeenCalledWith(@mixin.InstanceMethods)

      expect(extendSpy).toHaveBeenCalled()
      expect(extendSpy).toHaveBeenCalledWith(@mixin.ClassMethods)


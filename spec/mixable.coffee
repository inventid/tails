describe "Tails.Mixable", ->

  beforeEach ->
    class @Target
      _.extend(@, Tails.Mixable)

    @target = new @Target()

    @mixin =
      name : "mixin"
      InstanceMethods:
        instanceFn: jasmine.createSpy()
        included: jasmine.createSpy()

      ClassMethods:
        classFn: jasmine.createSpy()
        extended: jasmine.createSpy()

      Interactions: () ->
        InstanceMethods:
          name : "instanceInteractions1"

    @anotherMixin =
      name : "anotherMixin"
      fn: jasmine.createSpy()
      included: jasmine.createSpy()
      extended: jasmine.createSpy()
      Interactions: () ->
        InstanceMethods:
          name : "instanceInteractions2"

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
      expect(includeSpy).toHaveBeenCalledWith(@mixin)

      expect(extendSpy).toHaveBeenCalled()
      expect(extendSpy).toHaveBeenCalledWith(@mixin)

  describe ".with", ->

    it "should return the second argument if the first argument was included", ->
      withSpy = spyOn(@Target, 'with').and.callThrough()

      funcs =
        prop: "val"
        fn : jasmine.createSpy()

      @Target.include @mixin
      res = @Target.with @mixin, funcs

      expect(withSpy).toHaveBeenCalled()
      expect(withSpy).toHaveBeenCalledWith(@mixin, funcs)
      expect(res).toBe(funcs)
      expect(@Target.with @mixin).toBeTruthy()


    it "should return the second argument if the first argument was extended", ->
      withSpy = spyOn(@Target, 'with').and.callThrough()

      funcs =
        prop: "val"
        fn : jasmine.createSpy()

      @Target.extend @mixin
      res = @Target.with @mixin, funcs

      expect(withSpy).toHaveBeenCalled()
      expect(withSpy).toHaveBeenCalledWith(@mixin, funcs)
      expect(res).toBe(funcs)
      expect(@Target.with @mixin).toBeTruthy()

    it "should return null if the first argument isn't included or extended", ->
      withSpy = spyOn(@Target, 'with').and.callThrough()

      funcs =
        prop: "val"
        fn : jasmine.createSpy()

      res = @Target.with @mixin, funcs

      expect(withSpy).toHaveBeenCalled()
      expect(withSpy).toHaveBeenCalledWith(@mixin, funcs)
      expect(res).toBeNull()
      expect(@Target.with @mixin).toBeFalsy()

  describe ".interactions", ->
    it "should call the interactions method of a mixin when it is included", ->
      interactionsSpy = spyOn(@mixin, "Interactions").and.callThrough()
      anotherInteractionsSpy = spyOn(@anotherMixin, "Interactions")

      @Target.include @mixin, @anotherMixin

      expect(interactionsSpy).toHaveBeenCalled()
      expect(anotherInteractionsSpy).toHaveBeenCalled()

    it "should call _include method with the interactions of a mixin when it is included", ->
      includeSpy = spyOn(@Target, '_include').and.callThrough()

      obj = @mixin.Interactions.apply(@Target)
      anotherObj = @anotherMixin.Interactions.apply(@Target)

      interactionsSpy = spyOn(@mixin, 'Interactions').and.returnValue(obj)
      anotherInteractionsSpy = spyOn(@anotherMixin, 'Interactions').and.returnValue(anotherObj)
      mixins = [@mixin, @anotherMixin]
      @Target.include mixins...

      expect(includeSpy).toHaveBeenCalled()
      expect(includeSpy.calls.count()).toBe(3*mixins.length)
      expect(includeSpy.calls.allArgs()).toEqual([[@mixin], [obj], [@anotherMixin], [anotherObj], [obj], [anotherObj]])

    it "should call the interactions method of a mixin when it is extended", ->
      interactionsSpy = spyOn(@mixin, "Interactions").and.callThrough()
      anotherInteractionsSpy = spyOn(@anotherMixin, "Interactions")

      @Target.extend @mixin, @anotherMixin

      expect(interactionsSpy).toHaveBeenCalled()
      expect(anotherInteractionsSpy).toHaveBeenCalled()

    it "should call _extend method with the interactions of a mixin when it is extended", ->
      extendSpy = spyOn(@Target, '_extend').and.callThrough()

      obj = @mixin.Interactions.apply(@Target)
      anotherObj = @anotherMixin.Interactions.apply(@Target)

      interactionsSpy = spyOn(@mixin, 'Interactions').and.returnValue(obj)
      anotherInteractionsSpy = spyOn(@anotherMixin, 'Interactions').and.returnValue(anotherObj)
      mixins = [@mixin, @anotherMixin]
      @Target.extend mixins...

      expect(extendSpy).toHaveBeenCalled()
      expect(extendSpy.calls.count()).toBe(3*mixins.length)
      expect(extendSpy.calls.allArgs()).toEqual([[@mixin], [obj], [@anotherMixin], [anotherObj], [obj], [anotherObj]])

    it "should overwrite existing methods when applying interactions, both on classes and instances", ->
      klass = @Target
      instance = new @Target

      fn = () -> "val"
      otherFn = () -> "otherVal"

      mixin =
        fn: fn

      @Target.concern mixin

      expect(klass.fn).toBe(fn)
      expect(instance.fn()).toBe("val")

      interactiveMixin =
        Interactions: () ->
          {
            InstanceMethods:
              fn: otherFn
            ClassMethods:
              fn: otherFn
          }

      @Target.concern interactiveMixin

      expect(klass.fn).toBe(otherFn)
      expect(instance.fn()).toBe("otherVal")

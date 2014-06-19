describe "Tails.Mixable", ->

  beforeEach ->
    class @Target
      _.extend(@, Tails.Mixable)

    @target = new @Target()

    @mixin =
      InstanceMethods:
        instanceFn: sinon.spy()

      ClassMethods:
        classFn: sinon.spy()

      ObjectMethods:
        objectFn: sinon.spy()


      extended: sinon.spy()
      included: sinon.spy()

    @anotherMixin =
      InstanceMethods:
        instanceFn: sinon.spy()

      ClassMethods:
        classFn: sinon.spy()

      ObjectMethods:
        objectFn: sinon.spy()

      extended: sinon.spy()
      included: sinon.spy()

  describe ".include", ->

    it "should call the included method of the mixin", ->
      @Target.include(@mixin, @anotherMixin)
      expect(@mixin.included).to.have.been.calledOnce
      expect(@anotherMixin.included).to.have.been.calledOnce

    it "should add all properties of mixin.InstanceMethods and mixin.ObjectMethods", ->
      @Target.include(@mixin)
      expect(@target.instanceFn).to.exist
      expect(@target.instanceFn).to.equal(@mixin.InstanceMethods.instanceFn)

      expect(@target.objectFn).to.exist
      expect(@target.objectFn).to.equal(@mixin.ObjectMethods.objectFn)

    it "should include the mixin only once", ->
      targetSpy = sinon.spy()
      Object.defineProperty(@Target::, 'instanceFn', set: targetSpy)

      @Target.include(@mixin)
      expect(@mixin.included).to.have.been.calledOnce
      expect(targetSpy).to.have.been.calledOnce
      expect(targetSpy).to.have.been.calledWith(@mixin.InstanceMethods.instanceFn)

      @Target.include(@mixin)
      expect(@mixin.included).to.have.been.calledOnce
      expect(targetSpy).to.have.been.calledOnce

      class AnotherTarget extends @Target
      Object.defineProperty(AnotherTarget::, 'instanceFn', set: anotherTargetSpy)
      AnotherTarget.include(@mixin)

      anotherTarget = new AnotherTarget()
      anotherTargetSpy = sinon.spy()

      expect(@mixin.included).to.have.been.calledOnce
      expect(anotherTargetSpy).not.to.have.been.called

  describe ".extend", ->

    it "should call the extended method of the mixin", ->
      @Target.extend(@mixin, @anotherMixin)
      expect(@mixin.extended).to.have.been.calledOnce
      expect(@anotherMixin.extended).to.have.been.calledOnce

    it "should add all properties of mixin.ClassMethods and mixin.ObjectMethods", ->
      @Target.extend(@mixin)
      expect(@Target.classFn).to.exist
      expect(@Target.classFn).to.equal(@mixin.ClassMethods.classFn)

      expect(@Target.objectFn).to.exist
      expect(@Target.objectFn).to.equal(@mixin.ObjectMethods.objectFn)

    it "should extend the mixin only once", ->
      targetSpy = sinon.spy()
      Object.defineProperty(@Target, 'classFn', set: targetSpy)

      @Target.extend(@mixin)
      expect(@mixin.extended).to.have.been.calledOnce
      expect(targetSpy).to.have.been.calledOnce
      expect(targetSpy).to.have.been.calledWith(@mixin.ClassMethods.classFn)

      @Target.extend(@mixin)
      expect(@mixin.extended).to.have.been.calledOnce
      expect(targetSpy).to.have.been.calledOnce

      class AnotherTarget extends @Target
      anotherTargetSpy = sinon.spy()
      Object.defineProperty(AnotherTarget, 'classFn', set: anotherTargetSpy)

      AnotherTarget.extend(@mixin)
      expect(@mixin.extended).to.have.been.calledOnce
      expect(anotherTargetSpy).not.to.have.been.called

  describe ".concern", ->

    it "should call extend and include and forward its arguments", ->
      includeSpy = sinon.spy(@Target, 'include')
      extendSpy = sinon.spy(@Target, 'extend')

      @Target.concern(@mixin)

      expect(includeSpy).to.have.been.calledOnce
      expect(includeSpy).to.have.been.calledWith(@mixin)

      expect(extendSpy).to.have.been.calledOnce
      expect(extendSpy).to.have.been.calledWith(@mixin)

      @Target.include.restore()
      @Target.extend.restore()

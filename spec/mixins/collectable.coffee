describe "Tails.Mixins.Collectable", ->

  beforeEach ->
    localStorage.clear()
    class @Model extends Backbone.Model
      _.extend(@, Tails.Mixable)
      @concern(Tails.Mixins.Collectable)

  describe "creation", ->
    it "should ensure, by throwing an error, no duplicate models are loaded", ->
      createModel = => new @Model({id: 1})
      createModel()
      expect(createModel).toThrow()

    it "should allow the creation of named scopes", ->
      class Fruit extends @Model
        @scope 'fresh', where: { rotten: false}
        @scope 'rotten', where: { rotten: true }

      goodBanana = new Fruit({ rotten: false })
      badBanana = new Fruit({ rotten: true })

      expect(Fruit.fresh.contains(goodBanana)).toBe(true)
      expect(Fruit.fresh.contains(badBanana)).toBe(false)
      expect(Fruit.rotten.contains(goodBanana)).toBe(false)
      expect(Fruit.rotten.contains(badBanana)).toBe(true)

      goodBanana.set('rotten', true)
      expect(Fruit.fresh.contains(goodBanana)).toBe(false)
      expect(Fruit.rotten.contains(goodBanana)).toBe(true)

      Fruit.fresh.add(badBanana)
      expect(badBanana.get('rotten')).toBe(false)
      expect(Fruit.fresh.contains(badBanana)).toBe(true)
      expect(Fruit.rotten.contains(badBanana)).toBe(false)

    it "should allow the creation of anonymous scopes", ->
      class Fruit extends @Model

      freshFruits = Fruit.scope where: { rotten: false }
      rottenFruits = Fruit.scope where: { rotten: true }

      goodBanana = new Fruit({ rotten: false })
      badBanana = new Fruit({ rotten: true })

      expect(freshFruits.contains(goodBanana)).toBe(true)
      expect(freshFruits.contains(badBanana)).toBe(false)
      expect(rottenFruits.contains(goodBanana)).toBe(false)
      expect(rottenFruits.contains(badBanana)).toBe(true)

      goodBanana.set('rotten', true)
      expect(freshFruits.contains(goodBanana)).toBe(false)
      expect(rottenFruits.contains(goodBanana)).toBe(true)

      freshFruits.add(badBanana)
      expect(badBanana.get('rotten')).toBe(false)
      expect(freshFruits.contains(badBanana)).toBe(true)
      expect(rottenFruits.contains(badBanana)).toBe(false)

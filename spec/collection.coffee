describe "Tails.Collection", ->

  describe "#filter", ->
    it "should create a filtered subset of itself", ->
        class Fruit extends Tails.Model
          @getter fresh: ( ) -> not @get 'rotten'
          @setter fresh: (v) -> @set rotten: not v

        fruits = new Tails.Collection([], model: Fruit)
        freshFruits = fruits.filter ( model ) -> model.get('fresh') is true
        rottenFruits = fruits.filter ( model ) -> model.get('rotten') is true

        goodBanana = new Fruit({ rotten: false })
        badBanana = new Fruit({ rotten: true })
        fruits.add([goodBanana, badBanana])

        expect(freshFruits.contains(goodBanana)).toBe(true)
        expect(freshFruits.contains(badBanana)).toBe(false)
        expect(rottenFruits.contains(goodBanana)).toBe(false)
        expect(rottenFruits.contains(badBanana)).toBe(true)

        goodBanana.set('rotten', true)
        expect(freshFruits.contains(goodBanana)).toBe(false)
        expect(rottenFruits.contains(goodBanana)).toBe(true)

        expect(-> freshFruits.add(badBanana)).toThrow()
        expect(badBanana.get('fresh')).toBe(false)
        expect(freshFruits.contains(badBanana)).toBe(false)
        expect(rottenFruits.contains(badBanana)).toBe(true)

        expect(-> rottenFruits.remove(badBanana)).toThrow()
        expect(badBanana.get('fresh')).toBe(false)
        expect(freshFruits.contains(badBanana)).toBe(false)
        expect(rottenFruits.contains(badBanana)).toBe(true)

  describe "#where", ->
    describe "when passing an object", ->
      it "should create a filtered subset of itself", ->
        class Fruit extends Tails.Model
          @getter fresh: ( ) -> not @get 'rotten'
          @setter fresh: (v) -> @set rotten: not v

        fruits = new Tails.Collection([], model: Fruit)
        freshFruits = fruits.where { fresh: true }
        rottenFruits = fruits.where { rotten: true }

        goodBanana = new Fruit({ rotten: false })
        badBanana = new Fruit({ rotten: true })
        fruits.add([goodBanana, badBanana])

        expect(freshFruits.contains(goodBanana)).toBe(true)
        expect(freshFruits.contains(badBanana)).toBe(false)
        expect(rottenFruits.contains(goodBanana)).toBe(false)
        expect(rottenFruits.contains(badBanana)).toBe(true)

        goodBanana.set('rotten', true)
        expect(freshFruits.contains(goodBanana)).toBe(false)
        expect(rottenFruits.contains(goodBanana)).toBe(true)

        freshFruits.add(badBanana)
        expect(badBanana.get('fresh')).toBe(true)
        expect(freshFruits.contains(badBanana)).toBe(true)
        expect(rottenFruits.contains(badBanana)).toBe(false)

        freshFruits.remove(badBanana)
        expect(badBanana.get('fresh')).toBe(undefined)
        expect(freshFruits.contains(badBanana)).toBe(false)
        expect(rottenFruits.contains(badBanana)).toBe(false)

    describe "when using the query interface", ->
      describe ".is", ->
        it "should create a filtered subset of itself", ->
          class Fruit extends Tails.Model
            @getter fresh: ( ) -> not @get 'rotten'
            @setter fresh: (v) -> @set rotten: not v

          fruits = new Tails.Collection([], model: Fruit)
          freshFruits = fruits.where('fresh').is(true)
          rottenFruits = fruits.where('rotten').is(true)

          goodBanana = new Fruit({ rotten: false })
          badBanana = new Fruit({ rotten: true })
          fruits.add([goodBanana, badBanana])

          expect(freshFruits.contains(goodBanana)).toBe(true)
          expect(freshFruits.contains(badBanana)).toBe(false)
          expect(rottenFruits.contains(goodBanana)).toBe(false)
          expect(rottenFruits.contains(badBanana)).toBe(true)

          goodBanana.set('rotten', true)
          expect(freshFruits.contains(goodBanana)).toBe(false)
          expect(rottenFruits.contains(goodBanana)).toBe(true)

          freshFruits.add(badBanana)
          expect(badBanana.get('fresh')).toBe(true)
          expect(freshFruits.contains(badBanana)).toBe(true)
          expect(rottenFruits.contains(badBanana)).toBe(false)

          freshFruits.remove(badBanana)
          expect(badBanana.get('fresh')).toBe(undefined)
          expect(freshFruits.contains(badBanana)).toBe(false)
          expect(rottenFruits.contains(badBanana)).toBe(false)

      describe ".in", ->
        it "should create a filtered subset of itself", ->
          class Fruit extends Tails.Model

          fruits = new Tails.Collection([], model: Fruit)
          freshFruits = fruits.where('color').in(['red', 'green', 'orange', 'yellow'])
          rottenFruits = fruits.where('color').in(['black', 'brown'])
          greenFruits = fruits.where('color').is('green')

          goodBanana = new Fruit({ color: 'green' })
          badBanana = new Fruit({ color: 'brown' })
          fruits.add([goodBanana, badBanana])

          expect(freshFruits.contains(goodBanana)).toBe(true)

          expect(freshFruits.contains(goodBanana)).toBe(true)
          expect(freshFruits.contains(badBanana)).toBe(false)
          expect(rottenFruits.contains(goodBanana)).toBe(false)
          expect(rottenFruits.contains(badBanana)).toBe(true)

          goodBanana.set('color', 'yellow')
          expect(freshFruits.contains(goodBanana)).toBe(true)
          expect(freshFruits.contains(badBanana)).toBe(false)

          goodBanana.set('color', 'brown')
          expect(freshFruits.contains(goodBanana)).toBe(false)
          expect(rottenFruits.contains(goodBanana)).toBe(true)

          expect(-> freshFruits.add(badBanana)).toThrow()
          expect(freshFruits.contains(badBanana)).toBe(false)
          expect(rottenFruits.contains(badBanana)).toBe(true)

          expect(-> rottenFruits.remove(badBanana)).toThrow()
          expect(freshFruits.contains(badBanana)).toBe(false)
          expect(rottenFruits.contains(badBanana)).toBe(true)

        # it "should work with collections", ->
        #   fruits = new Tails.Collection()
        #   baskets = new Tails.Collection()

        #   redBasket = new Tails.Model({ color: 'red' })
        #   greenBasket = new Tails.Model({ color: 'green' })
        #   baskets.add([redBasket, greenBasket])

        #   validFruits = fruits.where('color').in(baskets.all().pluck('color'))
        #   # console.log 'whoop'

        #   apple = new Tails.Model({ color: 'green' })
        #   strawberry = new Tails.Model({ color: 'red' })
        #   orange = new Tails.Model({ color: 'orange' })
        #   fruits.add([apple, strawberry, orange])

        #   expect(validFruits.contains(apple)).toBe(true)
        #   expect(validFruits.contains(strawberry)).toBe(true)
        #   expect(validFruits.contains(orange)).toBe(false)

        #   baskets.remove(greenBasket)
        #   expect(validFruits.contains(apple)).toBe(false)

        #   orangeBasket = new Tails.Model({ color: 'orange' })
        #   baskets.add(orangeBasket)
        #   expect(validFruits.contains(orange)).toBe(true)

      describe ".atLeast, .atMost, .greaterThan, .lessThan", ->
        it "should create a filtered subset of itself", ->
          class Fruit extends Tails.Model

          fruits = new Tails.Collection([], model: Fruit)
          freshFruits1 = fruits.where('daysOld').atMost(7)
          freshFruits2 = fruits.where('daysOld').lessThan(8)
          rottenFruits1 = fruits.where('daysOld').atLeast(8)
          rottenFruits2 = fruits.where('daysOld').greaterThan(7)

          goodBanana = new Fruit({ daysOld: 7 })
          badBanana = new Fruit({ daysOld: 9 })
          fruits.add([goodBanana, badBanana])

          expect(freshFruits1.contains(goodBanana)).toBe(true)
          expect(freshFruits1.contains(badBanana)).toBe(false)
          expect(freshFruits2.contains(goodBanana)).toBe(true)
          expect(freshFruits2.contains(badBanana)).toBe(false)

          expect(rottenFruits1.contains(goodBanana)).toBe(false)
          expect(rottenFruits1.contains(badBanana)).toBe(true)
          expect(rottenFruits2.contains(goodBanana)).toBe(false)
          expect(rottenFruits2.contains(badBanana)).toBe(true)

          goodBanana.set('daysOld', 7)
          expect(freshFruits1.contains(goodBanana)).toBe(true)
          expect(freshFruits2.contains(goodBanana)).toBe(true)
          expect(rottenFruits1.contains(goodBanana)).toBe(false)
          expect(rottenFruits2.contains(goodBanana)).toBe(false)

          goodBanana.set('daysOld', 8)
          expect(freshFruits1.contains(goodBanana)).toBe(false)
          expect(freshFruits2.contains(goodBanana)).toBe(false)
          expect(rottenFruits1.contains(goodBanana)).toBe(true)
          expect(rottenFruits2.contains(goodBanana)).toBe(true)

          expect(-> freshFruits1.add(badBanana)).toThrow()
          expect(freshFruits1.contains(badBanana)).toBe(false)
          expect(rottenFruits1.contains(badBanana)).toBe(true)

          expect(-> freshFruits2.add(badBanana)).toThrow()
          expect(freshFruits2.contains(badBanana)).toBe(false)
          expect(rottenFruits2.contains(badBanana)).toBe(true)

          expect(-> rottenFruits1.remove(badBanana)).toThrow()
          expect(freshFruits1.contains(badBanana)).toBe(false)
          expect(rottenFruits1.contains(badBanana)).toBe(true)

          expect(-> rottenFruits2.remove(badBanana)).toThrow()
          expect(freshFruits2.contains(badBanana)).toBe(false)
          expect(rottenFruits2.contains(badBanana)).toBe(true)


  describe "Tails.Collection.Plucked", ->
    it "should work", ->
      fruits = new Tails.Collection()

      apple = new Tails.Model({ color: 'green' })
      banana = new Tails.Model({ color: 'yellow' })
      orange = new Tails.Model({ color: 'orange' })


      colors = new Tails.Collection.Plucked(fruits, attribute: 'color')
      expect(colors.length).toBe(0)

      fruits.add([apple, banana])
      expect(colors.length).toBe(2)
      expect(colors.contains('green')).toBe(true)
      expect(colors.contains('yellow')).toBe(true)

      addSpy = jasmine.createSpy()
      removeSpy = jasmine.createSpy()
      colors.on 'add', addSpy
      colors.on 'remove', removeSpy

      fruits.add(orange)
      fruits.remove(apple)

      expect(addSpy).toHaveBeenCalledWith('orange')
      expect(removeSpy).toHaveBeenCalledWith('green')

      expect(colors.contains('orange')).toBe(true)
      expect(colors.contains('green')).toBe(false)

  describe "Tails.Collection.Filtered", ->
    it "should work", ->
      # TODO: Most of what we test at Tails.Collection#where actually
      # belongs here. This should be fixed.
      collection = new Tails.Collection()
      subset = new Tails.Collection.Filtered(collection)

  describe "Tails.Collection.Union", ->
    it "should work", ->
      collection1 = new Tails.Collection()
      collection2 = new Tails.Collection()
      union = new Tails.Collection.Union([collection1, collection2])

      model1 = new Tails.Model()
      model2 = new Tails.Model()

      collection1.add(model1)
      expect(union.contains(model1)).toBe(true)
      expect(union.length).toBe(1)

      collection2.add(model2)
      expect(union.contains(model1)).toBe(true)
      expect(union.length).toBe(2)

      collection2.add(model1)
      expect(union.contains(model1)).toBe(true)
      expect(union.length).toBe(2)

      collection1.remove(model1)
      expect(union.contains(model1)).toBe(true)
      expect(union.length).toBe(2)

      collection2.remove(model1)
      expect(union.contains(model1)).toBe(false)
      expect(union.length).toBe(1)

      collection1.remove(model2)
      expect(union.contains(model2)).toBe(true)
      expect(union.length).toBe(1)

    # it "should update when the pluck updates", ->

  # describe "Tails.Collection.Intersection", ->
  #   it "should work", ->
  #     collection1 = new Tails.Collection()
  #     collection2 = new Tails.Collection()
  #     intersection = new Tails.Collection.Intersection([collection1, collection2])

  #     fmodelodel1 = new Tails.Model()
  #     model2 = new Tails.Model()

  #     collection1.add(model1)
  #     expect(intersection.contains(model1)).toBe(false)
  #     collection2.add(model1)
  #     expect(intersection.contains(model1)).toBe(true)

  #     collection2.add(model2)
  #     expect(intersection.contains(model2)).toBe(false)
  #     intersection.removeSource(collection1)
  #     expect(intersection.contains(model2)).toBe(true)

  #     intersection.addSource(collection1)
  #     expect(intersection.contains(model2)).toBe(false)


  # it "should be tested"

  # describe "#constructor", ->

  #   it "should set its parent property when options provide one", ->
  #     collection = new Tails.Collection()
  #     expect(collection.parent).to.equal(undefined)

  #     model = new Tails.Model()
  #     collection = new Tails.Collection(null, parent: model)
  #     expect(collection.parent).to.equal(model)

  #   it "should use the model class when options provide one", ->
  #     class Tails.Models.Fruit extends Tails.Model
  #     collection = new Tails.Collection(null, { model: Tails.Models.Fruit })
  #     expect(collection.model).to.equal(Tails.Models.Fruit)

  #   it "should detect its model class when none is provided", ->
  #     collection = new Tails.Collection()
  #     expect(collection.model).to.equal(Tails.Model)

  #     class Tails.Models.Fruit extends Tails.Model
  #     class Tails.Collections.Fruits extends Tails.Collection
  #     collection = new Tails.Collections.Fruits
  #     expect(collection.model).to.equal(Tails.Models.Fruit)

  # describe "#urlRoot", ->

  #   it "should return a string", ->
  #     collection = new Tails.Collection()
  #     expect(collection.urlRoot()).to.be.a('string')

  #   it "should contain the collection's model's name, pluralized and underscored", ->
  #     class Tails.Models.RedFruit extends Tails.Model
  #     class Tails.Collections.RedFruits extends Tails.Collection
  #     collection = new Tails.Collections.RedFruits()
  #     expect(collection.urlRoot()).to.contain('red_fruits')

  # describe "#url", ->

  #   it "should return a string", ->
  #     collection = new Tails.Collection()
  #     expect(collection.url()).to.be.a('string')

  #   it "should contain the App url", ->
  #     collection = new Tails.Collection()
  #     expect(collection.url()).to.contain(Tails.url)

  #   it "should contain the url root", ->
  #     collection = new Tails.Collection()
  #     expect(collection.url()).to.contain((new collection.model).urlRoot())

  #   it "should contain the parent url root when the model has a parent", ->
  #     class ParentModel extends Tails.Model
  #     parentModel = new ParentModel()
  #     collection = new Tails.Collection(null, { parent: parentModel })
  #     expect(collection.url()).to.contain(parentModel.urlRoot())

  #   it "should contain the format", ->
  #     format = 'html'
  #     collection = new Tails.Collection()
  #     collection.format = format
  #     expect(collection.url()).to.contain(format)

  # describe "#_prepareModel", ->

  #   it "should be tested"

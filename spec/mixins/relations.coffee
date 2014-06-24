describe "Tails.Mixins.Relations", ->


  beforeEach ->
    class @Model extends Backbone.Model
      _.extend @, Tails.Mixable
      @concern Tails.Mixins.Relations

  describe ".belongsTo", ->

    it "should add the relations when passing a function", ->
      class Basket extends @Model
      class Fruit  extends @Model
        @belongsTo -> basket: Basket

      fruit  = new Fruit()
      expect(fruit.get('basket') instanceof Basket).toBe(true)

    it "should add the relations when passing an object", ->
      class Basket extends @Model
      class Fruit  extends @Model
        @belongsTo basket: Basket

      fruit  = new Fruit()
      expect(fruit.get('basket') instanceof Basket).toBe(true)

    it "should instantiate the relation when passing the relation id to the constructor", ->
      class Fruit  extends @Model
        @belongsTo ->
          basket: Basket,
          owner: Owner
      class Basket extends @Model
      class Owner  extends @Model

      basket = new Basket({id: 1})
      owner  = new Owner({id: 4})
      fruit = new Fruit({basket_id: basket.id, owner_id: owner.id})

      expect(fruit.get('basket')).toBe(basket)
      expect(fruit.get('basket_id')).toBe(basket.id)
      expect(fruit.get('owner')).toBe(owner)
      expect(fruit.get('owner_id')).toBe(owner.id)

    it "should instantiate the relation when passing the relation to the constructor", ->
      class Fruit  extends @Model
        @belongsTo -> basket: Basket, owner: Owner
      class Basket extends @Model
      class Owner  extends @Model

      basket = new Basket({id: 1})
      owner  = new Owner({id: 4})
      fruit = new Fruit({basket: basket, owner: owner})

      expect(fruit.get('basket')).toBe(basket)
      expect(fruit.get('basket_id')).toBe(basket.id)
      expect(fruit.get('owner')).toBe(owner)
      expect(fruit.get('owner_id')).toBe(owner.id)

    it "should change the value of the foreign key when a different model is set", ->
      class Basket extends @Model
      class Fruit  extends @Model
        @belongsTo -> basket: Basket

      basket1 = new Basket({id: 1})
      basket2 = new Basket({id: 2})
      fruit   = new Fruit({basket: basket1})

      expect(fruit.get('basket_id')).toBe(basket1.id)

      fruit.set('basket', basket2)
      expect(fruit.get('basket_id')).toBe(basket2.id)

    it "should change the value of the model when a different foreign key is set", ->
      class Basket extends @Model
      class Fruit  extends @Model
        @belongsTo -> basket: Basket

      basket1 = new Basket({id: 1})
      basket2 = new Basket({id: 2})
      fruit   = new Fruit({basket_id: basket1.id})

      expect(fruit.get('basket')).toBe(basket1)

      fruit.set('basket_id', basket2.id)
      expect(fruit.get('basket')).toBe(basket2)

    it "should allow specifying a custom foreign key", ->
      class Basket extends @Model
      class Fruit  extends @Model
        @belongsTo container: Basket, foreignKey: 'container_id'

      basket = new Basket({id: 1})
      fruit = new Fruit({container_id: 1})
      expect(fruit.get('container')).toBe(basket)

  describe ".hasOne", ->

    it "should add the relations when passing a function", ->
      class Fruit extends @Model
        @belongsTo -> person: Person
      class Person extends @Model
        @hasOne -> fruit: Fruit

      person = new Person()
      expect(person.get('fruit')).toBeDefined()

    it "should add the relations when passing an object", ->
      class Fruit extends @Model
        @belongsTo -> person: Person
      class Person extends @Model
        @hasOne fruit: Fruit

      person = new Person()
      expect(person.get('fruit')).toBeDefined()

    # it "should set the relation when one is created", ->
    #   class Fruit extends @Model
    #     @belongsTo -> person: Person
    #   class Person extends @Model
    #     @hasOne -> fruit: Fruit

    #   person = new Person()
    #   expect
    #   fruit = new Basket({id: 1})
    #   fruit = new Fruit({basket_id: basket.id, owner_id: owner.id})

    #   expect(fruit.get('basket')).toBe(basket)
    #   expect(fruit.get('basket_id')).toBe(basket.id)
    #   expect(fruit.get('owner')).toBe(owner)
    #   expect(fruit.get('owner_id')).toBe(owner.id)

    # it "should instantiate the relation when passing the relation to the constructor", ->
    #   class Fruit extends @Model
    #     @belongsTo -> person: Person
    #   class Person extends @Model
    #     @hasOne -> fruit: Fruit

    #   basket = new Basket({id: 1})
    #   owner  = new Owner({id: 4})
    #   fruit = new Fruit({basket: basket, owner: owner})

    #   expect(fruit.get('basket')).toBe(basket)
    #   expect(fruit.get('basket_id')).toBe(basket.id)
    #   expect(fruit.get('owner')).toBe(owner)
    #   expect(fruit.get('owner_id')).toBe(owner.id)

    # it "should change the value of the foreign key when a different model is set", ->
    #   class Fruit extends @Model
    #     @belongsTo -> person: Person
    #   class Person extends @Model
    #     @hasOne -> fruit: Fruit

    #   basket1 = new Basket({id: 1})
    #   basket2 = new Basket({id: 2})
    #   fruit   = new Fruit({basket: basket1})

    #   expect(fruit.get('basket_id')).toBe(basket1.id)

    #   fruit.set('basket', basket2)
    #   expect(fruit.get('basket_id')).toBe(basket2.id)

    # it "should change the value of the model when a different foreign key is set", ->
    #   class Fruit extends @Model
    #     @belongsTo -> person: Person
    #   class Person extends @Model
    #     @hasOne -> fruit: Fruit

    #   basket1 = new Basket({id: 1})
    #   basket2 = new Basket({id: 2})
    #   fruit   = new Fruit({basket_id: basket1.id})

    #   expect(fruit.get('basket')).toBe(basket1)

    #   fruit.set('basket_id', basket2.id)
    #   expect(fruit.get('basket')).toBe(basket2)

    # it "should allow specifying a custom foreign key", ->
    #   class Fruit extends @Model
    #     @belongsTo -> owner: Person, foreignKey: 'owner'
    #   class Person extends @Model
    #     @hasOne -> fruit: Fruit, foreignKey: 'owner'

    #   basket = new Basket({id: 1})
    #   fruit = new Fruit({container_id: 1})
    #   expect(fruit.get('container')).toBe(basket)

  describe ".hasMany", ->

    it "should add the collection when passing a function", ->
      class Fruit extends @Model
        @belongsTo -> basket: Basket
      class Basket extends @Model
        @hasMany -> fruits: Fruit

      basket = new Basket()
      expect(basket.get('fruits')).toBeDefined()
      expect(basket.get('fruits').model).toBe(Fruit)

    it "should add the collection when passing a object", ->
      class Fruit extends @Model
        @belongsTo -> basket: Basket
      class Basket extends @Model
        @hasMany fruits: Fruit

      basket = new Basket()
      expect(basket.get('fruits')).toBeDefined()
      expect(basket.get('fruits').model).toBe(Fruit)

    it "should set the foreign key of the relation when it's added to the collection", ->
      class Fruit extends @Model
        @belongsTo -> basket: Basket
      class Basket extends @Model
        @hasMany -> fruits: Fruit

      fruit = new Fruit({id: 1})
      basket = new Basket({id: 1})
      expect(fruit.get('basket_id')).toBeUndefined()

      basket.get('fruits').add(fruit)
      expect(fruit.get('basket_id')).toBe(basket.id)

    it "should remove the foreign key of the relation when it's removed from the collection", ->
      class Fruit extends @Model
        @belongsTo -> basket: Basket
      class Basket extends @Model
        @hasMany -> fruits: Fruit

      fruit = new Fruit({id: 1})
      basket = new Basket({id: 1})
      basket.get('fruits').add(fruit)
      expect(fruit.get('basket_id')).toBe(basket.id)

      basket.get('fruits').remove(fruit)
      expect(fruit.get('basket_id')).toBeUndefined()

    it "should listen to changes of foreign keys in the related class", ->
      class Fruit extends @Model
        @belongsTo -> basket: Basket
      class Basket extends @Model
        @hasMany -> fruits: Fruit

      fruit = new Fruit({id: 1})
      basket = new Basket({id: 1})

      expect(basket.get('fruits').contains(fruit)).toBe(false)
      expect(fruit.get('basket_id')).toBeUndefined()

      fruit.set('basket_id', basket.id)
      expect(basket.get('fruits').contains(fruit)).toBe(true)

      fruit.unset('basket_id')
      expect(basket.get('fruits').contains(fruit)).toBe(false)

    it "should allow specifying a custom foreign key", ->
      class Fruit extends @Model
        @belongsTo -> container: Basket, foreignKey: 'container_id'
      class Basket extends @Model
        @hasMany -> fruits: Fruit, foreignKey: 'container_id'

      basket = new Basket({id: 1})
      fruit = new Fruit({id: 1, container_id: 1})

      expect(basket.get('fruits').contains(fruit)).toBe(true)




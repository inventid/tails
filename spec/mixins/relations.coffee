describe "Tails.Mixins.Relations", ->

  beforeEach ->
    class @Model extends Backbone.Model
      _.extend @, Tails.Mixable
      @concern Tails.Mixins.Relations

  describe ".belongsTo", ->
    it "should add the relations", ->
      class Basket extends @Model
      class Fruit  extends @Model
        @belongsTo basket: Basket

      fruit  = new Fruit()
      expect(Fruit.relations().findWhere(attribute: 'basket')).toBeDefined()
      expect(Fruit.relations().findWhere(attribute: 'basket').get('target')).toBe(Basket)

    it "should add the relations when wrapping the target in a function", ->
      class Basket extends @Model
      class Fruit  extends @Model
        @belongsTo basket: (-> Basket)

      fruit = new Fruit()
      expect(Fruit.relations().findWhere(attribute: 'basket')).toBeDefined()
      expect(Fruit.relations().findWhere(attribute: 'basket').get('target')).toBe(Basket)

    it "should instantiate the relation when passing the relation id to the constructor", ->
      class Fruit  extends @Model
        @belongsTo basket: (-> Basket)
        @belongsTo owner:  (-> Owner)

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
        @belongsTo basket: (-> Basket)
        @belongsTo owner:  (-> Owner)

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
        @belongsTo basket: (-> Basket)

      basket1 = new Basket({id: 1})
      basket2 = new Basket({id: 2})
      fruit   = new Fruit({basket: basket1})

      expect(fruit.get('basket_id')).toBe(basket1.id)

      fruit.set('basket', basket2)
      expect(fruit.get('basket_id')).toBe(basket2.id)

    it "should change the value of the model when a different foreign key is set", ->
      class Basket extends @Model
      class Fruit  extends @Model
        @belongsTo basket: (-> Basket)

      basket1 = new Basket({id: 1})
      basket2 = new Basket({id: 2})
      fruit   = new Fruit({basket_id: basket1.id})

      expect(fruit.get('basket')).toBe(basket1)

      fruit.set('basket_id', basket2.id)
      expect(fruit.get('basket')).toBe(basket2)

    it "should allow specifying a custom foreign key", ->
      class Basket extends @Model
      class Fruit  extends @Model
        @belongsTo container: (-> Basket), foreignKey: 'container_id'

      basket = new Basket({id: 1})
      fruit = new Fruit({container_id: 1})
      expect(fruit.get('container')).toBe(basket)

  describe ".hasOne", ->

    it "should add the relation", ->
      class Fruit extends @Model
      class Person extends @Model
        @hasOne fruit: Fruit

      person = new Person()
      expect(Person.relations().findWhere(attribute: 'fruit')).toBeDefined()
      expect(Person.relations().findWhere(attribute: 'fruit').get('target')).toBe(Fruit)

    it "should add the relation when wrapping the target in a function", ->
      class Fruit extends @Model
      class Person extends @Model
        @hasOne fruit: (-> Fruit)

      person = new Person()
      expect(Person.relations().findWhere(attribute: 'fruit')).toBeDefined()
      expect(Person.relations().findWhere(attribute: 'fruit').get('target')).toBe(Fruit)

    it "should set the relation when the foreign model has its foreign key set", ->
      class Fruit extends @Model
      class Person extends @Model
        @hasOne fruit: (-> Fruit)

      person = new Person({ id: 1 })
      fruit = new Fruit({ id: 1, person_id: person.id })

      expect(person.get('fruit')).toBe(fruit)

    it "should set the relation when passing the relation to the constructor", ->
      class Fruit extends @Model
      class Person extends @Model
        @hasOne fruit: (-> Fruit)

      fruit = new Fruit({ id: 1 })
      person = new Person({ id: 1, fruit: fruit })

      expect(person.get('fruit')).toBe(fruit)

    it "should set the relation through another relation", ->
      class Fruit extends @Model
        @belongsTo fruitBox: (-> FruitBox)
      class FruitBox extends @Model
        @hasOne fruit: (-> Fruit)
        @belongsTo person: (-> Person)
      class Person extends @Model
        @hasOne fruitBox: (-> FruitBox)
        @hasOne fruit: (-> Fruit), through: 'fruitBox'

      person = new Person({ id: 1})
      fruitBox = new FruitBox({ id: 1, person: person })
      fruit = new Fruit({ id: 1, fruitBox: fruitBox })

      expect(person.get('fruit')).toBe(fruit)

  describe ".hasMany", ->

    it "should add the collection", ->
      class Fruit extends @Model
      class Basket extends @Model
        @hasMany fruits: Fruit

      basket = new Basket()
      expect(basket.get('fruits')).toBeDefined()
      expect(basket.get('fruits').model).toBe(Fruit)

    it "should add the collection when wrapping the target in a function", ->
      class Fruit extends @Model
      class Basket extends @Model
        @hasMany fruits: (-> Fruit)

      basket = new Basket()
      expect(basket.get('fruits')).toBeDefined()
      expect(basket.get('fruits').model).toBe(Fruit)

    it "should set the foreign key of the relation when it's added to the collection", ->
      class Fruit extends @Model
        @belongsTo basket: (-> Basket)
      class Basket extends @Model
        @hasMany fruits: (-> Fruit)

      fruit = new Fruit({id: 1})
      basket = new Basket({id: 1})
      expect(fruit.get('basket_id')).toBeUndefined()

      basket.get('fruits').add(fruit)
      expect(fruit.get('basket_id')).toBe(basket.id)

    it "should remove the foreign key of the relation when it's removed from the collection", ->
      class Fruit extends @Model
        @belongsTo basket: (-> Basket)
      class Basket extends @Model
        @hasMany fruits: (-> Fruit)

      fruit = new Fruit({id: 1})
      basket = new Basket({id: 1})
      basket.get('fruits').add(fruit)
      expect(fruit.get('basket_id')).toBe(basket.id)

      basket.get('fruits').remove(fruit)
      expect(fruit.get('basket_id')).toBeUndefined()

    it "should listen to changes of foreign keys in the related class", ->
      class Fruit extends @Model
        @belongsTo basket: (-> Basket)
      class Basket extends @Model
        @hasMany fruits: (-> Fruit)

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
        @belongsTo container: (-> Basket), foreignKey: 'container_id'
      class Basket extends @Model
        @hasMany fruits: (-> Fruit), foreignKey: 'container_id'

      basket = new Basket({id: 1})
      fruit = new Fruit({id: 1, container_id: 1})

      expect(basket.get('fruits').contains(fruit)).toBe(true)

    it "should allow relations through another relation", ->
      class Fruit extends @Model
        @belongsTo basket: (-> Basket)

      class Basket extends @Model
        @hasMany   fruits: (-> Fruit)
        @belongsTo store:  (-> Store)

      class Store extends @Model
        @hasMany   baskets: (-> Basket)
        @hasMany   fruits:  (-> Fruit), through: 'baskets'
        @belongsTo owner: (-> Owner)

      class Owner extends @Model
        @hasOne  store: (-> Store)
        @hasMany fruits: (-> Fruit), through: 'store'
        @belongsTo city: (-> City)

      class City extends @Model
        @hasMany owners: (-> Owner)
        @hasMany stores: (-> Store), through: 'owners'
        @hasMany fruits: (-> Fruit), through: 'stores'

      city   = new City({ id: 1 })
      owner  = new Owner({ id: 1, city: city })
      store  = new Store({ id: 1, owner: owner })
      basket = new Basket({ id: 1, store: store })
      fruit  = new Fruit({ id: 1, basket: basket })

      # Through many, source many
      expect(store.get('fruits').contains(fruit)).toBe(true)
      # Through one, source many
      expect(owner.get('fruits').contains(fruit)).toBe(true)
      # Through many, source one
      expect(city.get('stores').contains(store)).toBe(true)
      # Nested throughs
      expect(city.get('fruits').contains(fruit)).toBe(true)

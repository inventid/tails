# Tails

## What is it?

**Caution**: Tails is still under heavy development and it's API may still change here and there.

Tails is a layer on top of Backbone makes it super easy to manage your models in the front-end. It takes away the issue of loading and linking related models and allows you to focus on the important bits of your web app. 

Tails is designed to integrate nicely with a Rails app that exposes a REST API of it's data to the front-end. Tails aims to duplicate your back-end models in the front-end, lazy loading any properties you may need automatically when you need them.

## How to use it?

Easy! Have a look at some examples:

```CoffeeScript
class Models.Fruit extends Tails.Model
  @belongsTo -> basket: Models.Basket
  
class Models.Basket extends Tails.Model
  @hasMany -> fruits: Models.Fruit
  
# Initializing the relation using foreign key
fruit = new Models.Fruits({basket_id: 5})
basket = new Models.Basket({id: 5})
fruit.get('basket') is basket # true

# Tails always keeps track of the relations 
basket.get('fruits').contains(fruit) # true
fruit.set('basket', null)
basket.get('fruits').contains(fruit) # false

# Initializing relation by explicitly setting it
fruit = new Models.Fruit(basket: basket)
fruit.get('basket_id') is 5 # true
```
As you might have noticed in the example above, we pass functions to the `belongsTo` and `hasMany` class methods. This is because classes that have a relation to each other create a circular dependency. Tails evaluates the function after both the models are loaded (in fact, just before initialize is called on your model), which ensures that it can always find the dependencies. If you are sure this is not gonna be an issue for you, you can also choose not to wrap your arguments into a function, as such: `@hasMany: fruits: Models.Fruit`


Tails follows the Rails mantra of *convention over configuration*. That means that it will automatically use *model_name*_id as the foreign key of a model. But don't worry if you have your application set up differently! Tails allows you to specify a custom foreign key:

```CoffeeScript
class Models.Dog extends Tails.Model
  @belongsTo -> owner: Models.Person, foreignKey: 'owner_id'
  
class Models.Person extends Tails.Model
  @hasMany -> pets: Models.Dog, foreignKey: 'owner_id'
  
person = new Models.Person({id: 1})
dog = new Models.Dog({owner: person})

dog.get('owner') is person # true
person.get('pets').contains(dog) # true
```

### Mixins

Tails also provides a few mixins that may be of use. Be sure to extends Tails.Mixable, and then you're free to use them as you see fit!
```CoffeeScript
class SomeClass extends Tails.Mixable
```

Of course, it may not always be possible to extend this way, primarily if you must inherit from some other class. No worries! Underscore.js has you covered.
```CoffeeScript
class SomeClass extends SomeBaseClass
  _.extend @, Tails.Mixable
```

#### Tails.Mixins.Interceptable
The Interceptable mixin allows you to execute code before or after a certain method runs. This is useful for things like routers, where a lot of share code.

```CoffeeScript
class MyRouter extends Backbone.Router
  _.extend @, Tails.Mixable
  
  @concern Tails.Mixins.Interceptable
  
  @before these: ['friends', 'account'], do: 'ensureSignedIn'
  @before admin: 'ensureAdmin'
  
  routes: 
    '/friends': 'friends'
    '/account': 'account'
    '/admin':   'admin'
  
  products: ( ) ->
  account: ( ) ->
  admin: ( ) ->
  ensureSignedIn: ( ) ->
  ensureAdmin: ( ) ->
```

#### Tails.Mixins.DynamicProperties
The DynamicProperties mixin makes it easy to put getters and setters on your class. This is mainly useful for CoffeeScript where the `get` and `set` JavaScript syntax is not available.

```CoffeeScript
class SomeClass extends Tails.Mixable
  @getter -> myProperty: ( )       -> return @_myProperty
  @setter -> myProperty: ( value ) -> @_myProperty = value if value > 3
```


![inventid logo](https://s3-eu-west-1.amazonaws.com/static-inventid-nl/content/img/logo@2x.png)

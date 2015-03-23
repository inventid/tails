[![inventid logo](https://cdn.inventid.nl/assets/logo-horizontally-ba8ae38ab1f53863fa4e99b977eaa1c7.png)](http://opensource.inventid.nl)

# Tails

|Branch|Build status|Coverage|
|----|----|---|
|Master branch|[![Build Status master branch](https://travis-ci.org/inventid/tails.svg?branch=master)](https://travis-ci.org/inventid/tails)|[![Coverage Status](http://img.shields.io/coveralls/inventid/tails/master.svg)](https://coveralls.io/r/inventid/tails?branch=master)
|Develop branch|[![Build Status develop branch](https://travis-ci.org/inventid/tails.svg?branch=develop)](https://travis-ci.org/inventid/tails)|[![Coverage Status](http://img.shields.io/coveralls/inventid/tails/develop.svg)](https://coveralls.io/r/inventid/tails?branch=develop)|

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
fruit.get('basket') is basket            # true

# Tails always keeps track of the relations 
basket.get('fruits').contains(fruit)     # true
fruit.unset('basket')
basket.get('fruits').contains(fruit)     # false

# Initializing relation by explicitly setting it
fruit = new Models.Fruit(basket: basket)
fruit.get('basket_id') is 5              # true
```
As you might have noticed in the example above, we pass functions to the `belongsTo` and `hasMany` class methods. This is because classes that have a relation to each other create a circular dependency. Tails evaluates the function after both the models are loaded (in fact, just before `initialize` is called on your model), which ensures that it can always find the dependencies. If you are sure this is not gonna be an issue for you, you can also choose not to wrap your arguments into a function, as such: `@hasMany: fruits: Models.Fruit`


Tails follows the Rails mantra of *convention over configuration*. That means that it will automatically use *model_name*_id as the foreign key of a model. But don't worry if you have your application set up differently! Tails allows you to specify a custom foreign key:

```CoffeeScript
class Models.Dog extends Tails.Model
  @belongsTo -> owner: Models.Person, foreignKey: 'owner_id'
  
class Models.Person extends Tails.Model
  @hasMany -> pets: Models.Dog, foreignKey: 'owner_id'
  
person = new Models.Person({id: 1})
dog = new Models.Dog({owner: person})

dog.get('owner') is person              # true
person.get('pets').contains(dog)        # true
```

### Mixins

Tails also provides a few mixins that may be of use. Be sure to extend Tails.Mixable, and then you're free to use them as you see fit!
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
Here too Tails allows you to pass functions instead of plain objects, which allows us to use actual pointers to methods instead of strings because were sure these methods are loaded when the functions are evaluated: 
```CoffeeScript
@before -> these: [@friends, @account], do: @ensureSignedIn
@before -> admin: @ensureAdmin
```
However, in this particular case it's a bit hairy because of the way how Backbone handles its routes, and it wouldn't work. Backbone extracts these methods and stores them seperatly, keeping us from properly setting our interceptors. See [#7](https://github.com/inventid/tails/issues/7).

#### Tails.Mixins.DynamicProperties
The DynamicProperties mixin makes it easy to put getters and setters on your class. This is mainly useful for CoffeeScript where the `get` and `set` JavaScript syntax is not available.

```CoffeeScript
class SomeClass extends Tails.Mixable
  @getter -> myProperty: ( )       -> return @_myProperty
  @setter -> myProperty: ( value ) -> @_myProperty = value if value > 3
```

### How to suggest improvements?

We are still actively developing Tails for our internal use, but we would already love to hear your feedback. In case you have some great ideas, you may just [open an issue](https://github.com/inventid/tails/issues/new). Be sure to check beforehand whether the same issue does not already exist.

### How can I contribute?

We feel contributions from the community are extremely worthwhile. If you use Tails in production and make some modification, please share it back to the community. You can simply [fork the repository](/inventid/tails/fork), commit your changes to your code and create a pull request back to this repository.

If there are any issues related to your changes, be sure to reference to those. Additionally we use the `develop` branch, so create a pull request to that branch and not to `master`.

### Collaborators

We would like to thank the developers which contributed to Tails, both big and small.

- [joostverdoorn](https://github.com/joostverdoorn) (Lead developer of Tails @ [inventid](https://www.inventid.nl))
- [steffansluis](https://github.com/steffansluis) (Developer @ [FeedbackFruits](https://secure.feedbackfruits.com))
- [rogierslag](https://github.com/rogierslag) (Developer @ [inventid](https://www.inventid.nl))


```

                                                                   yy`                     
                                                                  yy`                     
                     `dd-                                      .oo..hd:                   
                   `++yyyy-                                  .++//  NM/                   
                   `yy//syss/                              ://+:..  hhys-                 
  -::::::::      .:/+++++/ydy+:                          -://:..  ..symM+                 
  odsoossss::::::+ys.-yy/:oshMy                        ::++.      ::+odM+                 
  +ysoo++ooossssssso `yy/:/+smy--                    .-oo:-`      ::::hM+                 
  ``ody/+ss/:::::/+/..yy/:::+shMM                 `.-oo--`     ```::::hM+                 
  :///+ys:::://///:/++ss/:::/+sNN``              `:so--```     `::::::hM+                 
oodNNNNNd::::mNNNy//::::::::/+oyyMN`            /y+:-``::`    `.::::::hM+                 
MMo:::/++::++`   +Mm::::::::/++++MN`            /y/ `::::`   .::::::symM+                 
oodNNNNNd::++`   `.-ss::::::/+sNNMN`          dNy+/::::::`   -+/::::mN/`                  
NNyo++oyhmmo+oo-   .ys::::/+oso..MN`          syo/:::::::` :/++/::ssNM/                   
////yddmNMMo+dm+   `oo::::-..----MN`       `yhoo+:::::::://+++/:::mm::`                   
  odo//////ssdd/   `++....` `-/hhMN`       `hh+//::::::++++++/:/ooMN`                     
  /o-`-sossddso- `..--      `.-oooooo.   `oooo/::://///+++++++/odd++                      
      .osNNso-.` `..    ../oooooo  +o. -+oddhho++++++++++++++shyo+                        
        .yy//--.......//+omMMMMMM::::::ohhhhyy+++++oooo++++syhdy::::                      
           yho++o+oooommhhhddddddddddhho:+dy  .-. -++oooosshdy+sdddh::::.                 
               +mddmNNss. -:///////+o- oNd--``oy:   `::yymmo:/+/::--dmmm/```              
                   .MN::` -:+ssssooyy:`/yo `::sy/```.-:MM+:::::/++``  .-+sss+             
                   .MN::`   .::::MMMMs:+yo .yyNMs:+yo `MM+::::::::++`     `:/ys`          
                    ``ss/:` `````//NMNNs:+Nd````sNy::::MM+:.````````       ``::os`        
                     `NNys/:. .::::yymMNNNMNmmmmNMNNNNmoo++++++/:-           ``::hm+      
                      --hmdddhddd++//osdMMMm++dmdhhhhMN+++++++++++//----.      ``/+sh+    
                        -:--oNmssmmss+/+ooso``syyyyyyhhmmo+/::::::::::::----.    ``/h+    
                            .+ohhyydmhhhhyso  syyyo:/yyMMdhsooo+:::::::::::::..`   -+oso  
                              .++hhNMhshmmddooyy+:- `:/ddNMs/oddyyyyo+++/::::::..:/oydMNoo
                                 sssssshmdhhhhdd/     `yymM/.:ssssss+/yhysssssssshhyssssss
                                     /ysyso+--yho/-   `ssmM/.`        /yyyyyyyyyyyy/      
                                         -dh----sms-- `++mM/.`                            
                                           .dd:.:/smh.-oodm/``                            
                                              dMMMs.-MMMM:.                               
```

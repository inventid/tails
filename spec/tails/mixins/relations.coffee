#= require sinon
#= require sinon-chai
#= require vendor
#= require core/mixable
#= require mixins/relations

describe "Tails.Mixins.Relations", ->

  describe ".ClassMethods", ->

    beforeEach ->
      class @Model extends Backbone.Model
        _.extend(@, Tails.Mixable)
        @extend(Tails.Mixins.Relations)

      class @Event extends @Model
      class @Shop extends @Model

    describe ".belongsTo", ->

      it "should set the appropriate attribute", ->
        shop = new @Shop({ event_id: 1 })
        expect(shop.get('event')).not.to.exist

        @Shop.belongsTo => @Event
        shop = new @Shop({ event_id: 1 })
        # debugger
        expect(shop.get('event')).to.exist

        expect(@Shop.all().length).to.equal(2)
        expect(@Event.all().length).to.equal(1)

      it "should set the relation in response to changes to the foreign key", ->
        @Shop.belongsTo => @Event
        shop = new @Shop({ event_id: 1 })
        event1 = shop.get('event')

        shop.set('event_id', 2)
        event2 = shop.get('event')
        expect(event1).not.to.equal(event2)

        expect(@Shop.all().length).to.equal(1)
        expect(@Event.all().length).to.equal(2)

      it "should set the foreign key in response to changes to the relation", ->
        @Shop.belongsTo => @Event
        shop = new @Shop
        expect(shop.get('event_id')).not.to.exist

        event = new @Event({ id: 1 })
        shop.set('event', event)
        expect(shop.get('event_id')).to.equal(1)

        expect(@Shop.all().length).to.equal(1)
        expect(@Event.all().length).to.equal(1)

    describe ".hasOne", ->

      it "should be tested"

    describe ".hasMany", ->

      it "should set the appropriate attribute", ->
        event = new @Event()
        expect(event.get('shops')).not.to.exist

        @Event.hasMany => @Shop
        event = new @Event()
        expect(event.get('shops')).to.exist
        expect(event.get('shops').length).to.equal(0)

        expect(@Event.all().length).to.equal(2)
        expect(@Shop.all().length).to.equal(0)

      it "should set the foreign key of the relation when it's added to the collection", ->
        @Event.hasMany => @Shop
        event = new @Event({ id: 1 })
        shop = new @Shop()

        event.get('shops').add(shop)
        expect(event.get('shops').length).to.equal(1)
        expect(shop.get('event_id')).to.equal(1)

      it "should remove the foreign key of the relation when it's removed from the collection", ->
        @Event.hasMany => @Shop
        event = new @Event({ id: 1 })
        shop = new @Shop()

        event.get('shops').add(shop)
        expect(shop.get('event_id')).to.equal(1)

        event.get('shops').remove(shop)
        expect(shop.get('event_id')).not.to.exist
        expect(event.get('shops').length).to.equal(0)

      it "should listen to changes of foreign keys in the related class", ->
        @Event.hasMany => @Shop
        event = new @Event({ id: 1 })
        expect(event.get('shops').length).to.equal(0)

        shop = new @Shop({ event_id: 1 })
        expect(event.get('shops').length).to.equal(1)
        expect(event.get('shops').contains(shop)).to.be.truthy

        shop.set('event_id', 2)
        expect(event.get('shops').length).to.equal(0)

        shop.set('event_id', 1)
        expect(event.get('shops').length).to.equal(1)
        expect(event.get('shops').contains(shop)).to.be.truthy

    describe ".addRelation", ->

      it "should be tested"

  describe ".extended", ->

    it "should extend Tails.Mixins.Collectable", ->
      class Model extends Backbone.Model
        _.extend(@, Tails.Mixable)

      spy = sinon.spy(Model, 'extend')
      Model.extend(Tails.Mixins.Relations)
      expect(spy).to.have.been.calledWith(Tails.Mixins.Collectable)



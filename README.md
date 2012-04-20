# Backbone.Brace

Brace is an extension to [Backbone](http://backbonejs.org) that adds mixins and self-documenting attributes & events.

## Self-documenting attributes and events

Brace allows:

- "namedEvents" on Models, Collections, Views and Routers, which is a collection of exposed events
- "namedAttributes" on Models, which is a collection of exposed attributes - ie a model schema

Both namedEvents and namedAttributes are arrays of strings.

    :::javascript
    var Person = Brace.Model.extend({
        namedAttributes: ["name"],
        namedEvents: ["sleep"]
    });

For each attribute in namedAttributes, get[Attribute] and set[Attribute] methods are generated:

    :::javascript
    var person = new Person();
    person.setName("Tim");
    person.getName() // Returns "Tim"

Backbone models' get() and set() validate attributes:

    :::javascript
    person.get("name"); // ok
    person.set("name", "Timmy"); // ok
    person.set({
        name: "Timothy"
    }); // ok
    
    person.get("lost"); // throws exception
    person.set("lost", "frequently"); // throws exception
    person.set({
        lost: "frequently"
    }); // throws exception
    
For each event in namedEvents, on[Event] and trigger[Event] methods are generated:
    
    :::javascript
    person.onSleep(function(dream) { console.log("Dreaming about " + dream); } );
    person.triggerSleep("Unicorns");


## Mixins

Brace allows a "mixins" property on models, views, collections and routers:

    :::javascript
    var Loggable = {
        log: function(msg) {
            console.log(msg);
        }
    };
    
    var PersonView = Brace.View.extend({
        mixins: [Loggable],
        
        initialize: function() {
            this.log("Initialized");
        }
    });


## Mixins with Backbone

namedAttributes and namedEvents in mixins are respected:

    :::javascript
    var Selectable = {
        namedAttributes: ["selected"],
        namedEvents: ["select"],

        initialize: function() {
            this.on("change:selected", _.bind(function(model, selected) {
                if (selected) {
                    this.triggerSelect();
                }
            }, this));
        }
    };

    var Person = Brace.Model.extend({
        mixins: [Selectable]
    });
    
    var person = new Person();

    person.onSelect(function() { console.log("Person was selected"); });
    person.setSelected(true);
    person.getSelected();
    person.triggerSelect();

Additionally, Brace composes 

- initialize() on all objects, and
- defaults and validate() on models

All other name clashes between mixins fail violently and forcefully *at class declaration time* (not at instance construction time).

    :::javascript
    var Runnable = {
        run: function() {}
    };
    
    var RunModel = Brace.Model.extend({
        mixins: [Runnable],
        run: function() {}
    }); // throws "Mixin error: class already has property 'run' defined"
    
    
    

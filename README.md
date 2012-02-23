# Backbone.Brace

Brace is an extension to [Backbone](http://backbonejs.org) that adds mixins and self-documenting attributes & events.

## Self-documenting attributes and events

Brace allows:

- "namedEvents" on Models, Collections, Views and Routers
- "namedAttributes" on Models

Both namedEvents and namedAttributes are arrays of strings.

    var Person = Brace.Model.extend({
        namedAttributes: ["name"],
        namedEvents: ["sleep"]
    });

For each attribute in namedAttributes, get[Attribute] and set[Attribute] methods are generated:

    var person = new Person();
    person.setName("Tim");
    person.getName() // Returns "Tim"

Backbone models' get() and set() validate attributes:

    person.get("name"); "Time"
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
    
    person.onSleep(function(dream) { console.log("Dreaming about " + dream); } );
    person.triggerSleep("Unicorns");


## Mixins

Brace allows a "mixins" property on models, views, collections and routers:

    var Loggable = {
        log: function(msg) {
            console.log(msg);
        }
    };
    
    var Person = Brace.View.extend({
        mixins: [Loggable],
        
        initialize: function() {
            this.log("Initialized");
        }
    });


## Mixins with Backbone

namedAttributes and namedEvents in mixins are respected:

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

    person.onSelect(function() { console.log("selected"); });
    person.setSelected(true);
    person.getSelected();
    person.triggerSelect();

Additionally, Brace composes the initialize() methods on all objects, and defaults and validate() on models.

All other name clashes between mixins fail violently and forcefully *at class declaration time* (not at instance construction time).


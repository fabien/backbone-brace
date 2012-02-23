# Backbone.Brace

Brace is an extension to Backbone (http://backbonejs.org) that adds mixins and self-documenting attributes & events.

## Self-documenting attributes and events

Brace adds:

- "namedEvents" to Models, Collections, Views and Routers
- "namedAttributes" property to Models

    var MaleModel = Brace.Model.extend({
        namedAttributes: ["look"],
        namedEvents: ["think"]
    });

    // for each attribute in namedAttributes, get[Attribute] and set[Attribute] methods are generated

    var zoolander = new MaleModel();
    zoolander.setLook("Blue Steel");
    zoolander.getLook() // Returns "Blue Steel"

    // get() and set() validate attributes

    zoolander.get("look"); "Blue Steel"
    zoolander.set("look", "Le Tigre"); // ok
    zoolander.set({
        look: "Ferrari"
    }); // ok

    zoolander.get("lost"); // throws exception
    zoolander.set("lost", "frequently"); // throws exception
    zoolander.set({
        lost: "frequently"
    }); // throws exception

    // for each event in namedEvents, on[Event] and trigger[Event] methods are generated

    zoolander.onThink(function(idea) { console.log(idea);} );
    zoolander.triggerThink("Ow");


## Mixins

    var MyMixin = {
        name: "hi"
    };



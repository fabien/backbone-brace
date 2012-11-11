
module("Brace.AttributesMixinCreator");

test("Getter and setter are added to model", function() {
    var MaleModel = Brace.Model.extend({
        namedAttributes: ["look"]
    });

    var zoolander = new MaleModel();

    ok(zoolander.getLook);
    ok(zoolander.setLook);

    zoolander.setLook("Blue Steel");
    equals(zoolander.get("look"), "Blue Steel");

    equals(zoolander.getLook(), "Blue Steel");
});

test("ID attribute is always added to namedAttributes", function() {
    var MaleModel = Brace.Model.extend({
        namedAttributes: ["look"]
    });

    var zoolander = new MaleModel();

    deepEqual(zoolander.namedAttributes, ["id", "look"]);
    ok(zoolander.getId);
    ok(zoolander.setId);
});

test("Does not barf when user specifies id", function() {
    var MaleModel = Brace.Model.extend({
        namedAttributes: ["id", "look"]
    });

    var zoolander = new MaleModel();

    deepEqual(zoolander.namedAttributes, ["id", "look"]);
    ok(zoolander.getId);
    ok(zoolander.setId);
});

test("ID attribute is not added if model does not specify namedAttributes", function() {
    var MaleModel = Brace.Model.extend();

    var zoolander = new MaleModel();

    ok(!zoolander.namedAttributes);
    ok(!zoolander.getId);
    ok(!zoolander.setId);
});

test("Setting namedAttributes that does not exist fails", function() {
    var MaleModel = Brace.Model.extend({
        namedAttributes: ["look"]
    });

    var zoolander = new MaleModel();
    raises(function() {
        zoolander.set({
            mer: "man"
        });
    });
});

test("Setting attribute that does not exist fails", function() {
    var MaleModel = Brace.Model.extend({
        namedAttributes: ["look"]
    });

    var zoolander = new MaleModel();
    raises(function() {
        zoolander.set("mer", "man");
    });
});

test("Getting attribute that does not exist fails", function() {
    var MaleModel = Brace.Model.extend({
        namedAttributes: ["look"]
    });

    var zoolander = new MaleModel();
    raises(function() {
        zoolander.get("eugooglize");
    });
});

test("Default set and get work", function() {
    var MaleModel = Brace.Model.extend({
        namedAttributes: ["look"]
    });

    var zoolander = new MaleModel();
    zoolander.set("look", "Le Tigre");
    equals(zoolander.get("look"), "Le Tigre");
});

test("Setting any attribute when no property exists succeeds", function() {
    var MaleModel = Brace.Model.extend();

    var hansel = new MaleModel();
    hansel.set("derelique");
});

test("Getting any attribute when no property exists succeeds", function() {
    var MaleModel = Brace.Model.extend();

    var hansel = new MaleModel();
    hansel.get("derelique");
});

test("Mixin can apply namedAttributes to model with no namedAttributes", function() {
    var MyMixin = {
        namedAttributes: ["someAttribute"]
    };
    var MyModel = Brace.Model.extend({
        mixins: [MyMixin]
    });
    var myModel = new MyModel();
    deepEqual(myModel.namedAttributes, ["id", "someAttribute"]);
    ok(myModel.getSomeAttribute);
    ok(myModel.setSomeAttribute);
});

test("Mixin can apply namedAttributes to model with some namedAttributes", function() {
    var MyMixin = {
        namedAttributes: ["someAttribute"]
    };
    var MyModel = Brace.Model.extend({
        mixins: [MyMixin],
        namedAttributes: ["someOtherAttribute"]
    });
    var myModel = new MyModel();
    deepEqual(myModel.namedAttributes, ["id", "someOtherAttribute", "someAttribute"]);
    ok(myModel.getSomeOtherAttribute);
    ok(myModel.setSomeOtherAttribute);
    ok(myModel.getSomeAttribute);
    ok(myModel.setSomeAttribute);
});

test("Children inherit their parents namedAttributes", function() {
    var MyParentModel = Brace.Model.extend({
        namedAttributes: ["someAttribute"]
    });
    var MyModel = MyParentModel.extend({
        namedAttributes: ["someOtherAttribute"]
    });
    var myModel = new MyModel();

    var actual = myModel.namedAttributes.slice();
    var expected = ["id", "someOtherAttribute", "someAttribute"];

    // order doesn't matter
    actual.sort();
    expected.sort();

    deepEqual(actual, expected);
    ok(myModel.getSomeOtherAttribute);
    ok(myModel.setSomeOtherAttribute);
    ok(myModel.getSomeAttribute);
    ok(myModel.setSomeAttribute);
});
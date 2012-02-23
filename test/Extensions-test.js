
module('Brace.Model');

test("Can create BaseModel with no namedAttributes defined", function() {
    Brace.Model.extend();
});

test("BaseModel adds mixin", function() {
    var TestMixin = {
        mixinProperty: "hi"
    };

    var TestModel = Brace.Model.extend({
        mixins: [TestMixin]
    });
    var testModelInstance = new TestModel();

    equals(testModelInstance.mixinProperty, "hi");
});

test("Mixin name clash fails violently on class declaration", function() {
    var TestMixin1 = {
        mixinProperty: "hi"
    };
    var TestMixin2 = {
        mixinProperty: "hi"
    };

    raises(function() {
        var TestModel = Brace.Model.extend({
            mixins: [TestMixin1, TestMixin2]
        });
    });
});

test("Mixin initialize is mixed in when class does not contain initialize method", function() {
    var TestMixin = {
        initialize: function() {
            this.mixin1Initialized = true;
        }
    };
    var TestModel = Brace.Model.extend({
        mixins: [TestMixin]
    });

    var testModelInstance = new TestModel();

    ok(testModelInstance.mixin1Initialized);
});

test("Class initialize is called when mixin initialize is specified", function() {
    var TestMixin = {
        initialize: function() {
            this.myMixinHas = "beenCalled";
        }
    };

    var TestMixin2 = {
        initialize: function() {
            this.myMixin2Has = "beenCalled";
        }
    }

    var TestModel = Brace.Model.extend({
        mixins: [TestMixin, TestMixin2],
        initialize: function() {
            this.classInitializeHas = "beenCalled";
        }
    });
    var testModelInstance = new TestModel();

    equals(testModelInstance.myMixinHas, "beenCalled");
    equals(testModelInstance.myMixin2Has, "beenCalled");
    equals(testModelInstance.classInitializeHas, "beenCalled");
});

test("Mixin defaults compose with class defaults", function() {
    var TestMixin = {
        defaults: {
            yada: "yada"
        }
    };

    var TestModel = Brace.Model.extend({
        mixins: [TestMixin],
        defaults: {
            blah: "blah"
        }
    });

    deepEqual(TestModel.prototype.defaults, {
        blah: "blah",
        yada: "yada"
    });
});

test("Mixin defaults replace class defaults if class has no defaults specified", function() {
    var TestMixin = {
        defaults: {
            yada: "yada"
        }
    };

    var TestModel = Brace.Model.extend({
        mixins: [TestMixin]
    });

    deepEqual(TestModel.prototype.defaults, {
        yada: "yada"
    });
});

test("Mixin validate is mixed in when class does not contain validate method", function() {
    var TestMixin = {
        validate: function() {
            this.mixin1Validated = true;
        }
    };
    var TestModel = Brace.Model.extend({
        mixins: [TestMixin]
    });

    var testModelInstance = new TestModel();
    testModelInstance.set({}); // cause validation

    ok(testModelInstance.mixin1Validated);
});

test("Validate is composed in multiple mixins", function() {
    var TestMixin1 = {
        validate: function() {
            this.mixin1Validated = true;
        }
    };
    var TestMixin2 = {
        validate: function() {
            this.mixin2Validated = true;
        }
    }
    var TestModel = Brace.Model.extend({
        mixins: [TestMixin1, TestMixin2],
        validate: function() {
            this.modelValidated = true;
        }
    });

    var testModelInstance = new TestModel();
    testModelInstance.set({}); // cause validation

    ok(testModelInstance.mixin1Validated);
    ok(testModelInstance.mixin2Validated);
    ok(testModelInstance.modelValidated);
});

test("When a mixin's validate function fails, it is returned before the original function", function() {
    var TestMixin = {
        validate: function() {
            return "you suck!";
        }
    };
    var TestModel = Brace.Model.extend({
        mixins: [TestMixin]
    });

    var called = false;
    var testModelInstance = new TestModel();
    testModelInstance.set({}, {
        error: function(ctx, error) {
            called = true;
            equal(error, "you suck!");
        }
    });

    ok(called);
});

test("Attributes Mixin", function () {

    var ContactModel = Brace.Model.extend({
        namedAttributes: ["name", "number", "address"]
    });

    var myContactModel = new ContactModel({
        name: "scott",
        number: 0412947430
    });

    equals("scott", myContactModel.getName());
    equals(0412947430, myContactModel.getNumber());

    myContactModel.setName("jonothan");
    myContactModel.setNumber(000);


    equals("jonothan", myContactModel.getName());
    equals(000, myContactModel.getNumber());
});


test("Attributes Mixin passes options to underlying set", function () {

    var ContactModel = Brace.Model.extend({
        namedAttributes: ["name", "number", "address"]
    });

    var myContactModel = new ContactModel({
        name: "scott",
        number: 0412947430
    });

    var triggered;
    myContactModel.on("change:name", function() {
        triggered = true;
    });

    myContactModel.setName("jonothan");
    myContactModel.setNumber(000);

    ok(triggered, "Event trigged after set");
    triggered = false;

    myContactModel.setName("jared", {silent: true});

    ok(!triggered, "Event not trigged with silent passed to set");
});



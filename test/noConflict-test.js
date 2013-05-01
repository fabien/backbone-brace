module('No Conflict');

test('No Conflict returns current Backbone version', function() {
    var expectedOldBrace = {
        test: true
    };
    ok(Brace, "Window level Brace exists before noConflict.");
    notDeepEqual(Brace, expectedOldBrace, "Window level Brace is not equal to previous Brace variable before noConflict called.");
    
    var noConflictBrace = Brace.noConflict();
    
    deepEqual(Brace, expectedOldBrace, "Window level Brace is equal to previous Brace variable after noConflict called.");
    ok(noConflictBrace, "Noconflict Brace is still defined after noConflict.");
    notDeepEqual(noConflictBrace, Brace, "Noconflict Brace is not the same as previous Brace.");
});

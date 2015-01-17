Weasel = require('../../app/scripts/weasel');

module.exports = {
    testWeaselUsesTheProvidedId: function (assert) {
        var expectedId = '12312313';
        var weasel = new Weasel(expectedId);
        assert.equal(weasel.id, expectedId, 'expect the id to be used');
        assert.done();
    },

    testWeaselStartsInDown: function(assert){
        var expectedId = '12312313';
        var weasel = new Weasel(expectedId);
        assert.equal(weasel.currentPosition, Weasel.POSITION.down, 'should start down');
        assert.done();
    },

    testWeaselStartsWithNoEventHandlers: function(assert){
        var expectedId = '12312313';
        var weasel = new Weasel(expectedId);
        assert.equal(Object.keys(weasel.events).length, 0, 'should start with 0 handlers');
        assert.done();
    },

    testWeaselMovesFromDownToUpOnMoveExecution: function(assert){
        var expectedId = '12312313';
        var weasel = new Weasel(expectedId);
        assert.equal(weasel.currentPosition, Weasel.POSITION.down, 'should start down');
        weasel.move();
        assert.equal(weasel.currentPosition, Weasel.POSITION.up, 'should have moved up');
        assert.done();
    },

    testWeaselRaisedAnEventOnMoveExecution: function(assert){
        var expectedId = '12312313';
        var movedEventTriggered = false;
        var movedDirection;
        var weasel = new Weasel(expectedId);
        assert.equal(weasel.currentPosition, Weasel.POSITION.down, 'should start down');
        weasel.on(Weasel.EVENTKEYS.weaselMoved, function(src, state){
            movedEventTriggered = true;
            movedDirection = state;
            assert.equal(src.id, expectedId, 'expect the id to be of the created weasel');
        });
        weasel.move();
        assert.equal(weasel.currentPosition, Weasel.POSITION.up, 'should have moved up');
        assert.ok(movedEventTriggered, 'Should have triggered a Move Event');
        assert.equal(movedDirection, Weasel.POSITION.up, 'should have published an up move event');
        assert.done();
    },

    testWeaselMovesFromDownToUpAndBackOnTwoMoveExecutions: function(assert){
        var expectedId = '12312313';
        var weasel = new Weasel(expectedId);
        assert.equal(weasel.currentPosition, Weasel.POSITION.down, 'should start down');
        weasel.move();
        assert.equal(weasel.currentPosition, Weasel.POSITION.up, 'should have moved up');
        weasel.move();
        assert.equal(weasel.currentPosition, Weasel.POSITION.down, 'should have moved down');
        assert.done();
    }
};
Game = require('../../app/scripts/game');

module.exports = {

    testGameDurationStartsAtZeroTicks: function(assert){
        var expectedTicks = 0;
        var game = new Game();
        assert.equal(game.gameDurationTicks, expectedTicks, 'Should start with 0 ticks');
        assert.done();
    },

    testGameIsPlayingDefaultsToFalse: function(assert){
        var expectedPlayingState = false;
        var game = new Game();
        assert.equal(game.playing, expectedPlayingState, 'Should start with playing set to false');
        assert.done();
    },

    testGameStartsWithNoEventHandlers: function(assert){
        var game = new Game();
        assert.equal(Object.keys(game.events).length, 0, 'should start with 0 handlers');
        assert.done();
    },

    testGameShouldStartWithZeroWeasels: function(assert){
        var expectedWeaselCount = 0;
        var game = new Game();
        assert.equal(game.weasels.length, expectedWeaselCount, 'Should start with 0 weasels');
        assert.done();
    },

    testGameAnimatingDefaultsToFalse: function(assert){
        var expectedAnimatingState = false;
        var game = new Game();
        assert.equal(game.animating, expectedAnimatingState, 'Should start with animating set to false');
        assert.done();
    },

    testGameInitDoneDefaultsToFalse: function(assert){
        var expectedInitDoneState = false;
        var game = new Game();
        assert.equal(game.initDone, expectedInitDoneState, 'Should start with initDone set to false');
        assert.done();
    }

};
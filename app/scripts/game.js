var Game = function Game(userOptions){
    this.options = Game.DEFAULT_OPTIONS;
    if(userOptions){
        var self = this;
        Object.keys(this.options).forEach(function(key){
           if(userOptions[key] !== undefined){
               self.options[key] = userOptions[key];
           }
        });
    }
    this.gameDurationTicks = 0;
    this.playing = false;
    this.events = {};
    this.weasels = {};
    this.animating = false;
    this.initDone = false;
    this.hits = 0;
    this.misses = 0;
    this.score = 0;
    this.remainingMS = 0;
    this.lastTickTime = 0;
};

Game.EVENTKEYS = {
    gameDurationElapsed: 'gameDurationElapsed',
    started: 'started',
    stopped: 'stopped',
    weaselHit: 'weaselHit',
    weaselMiss: 'weaselMiss',
    scoreChanged: 'scoreChanged',
    remainingTimeChanged: 'remainingTimeChanged',
    gameOver: 'gameOver',
    weaselMoved: 'weaselMoved'
};

Game.DEFAULT_OPTIONS = {
    weaselCount: 5,
    weaselMaxWaitMS: 2500,
    weaselMinWaitMS: 500,
    weaselMaxUpMS: 2000,
    weaselMinUpMS: 800,
    weaselHitPoints: 750,
    weaselMissPoints: -75,
    gameLengthSeconds: 60
};

Game.prototype.addWeasel = function addWeasel(id){
    var weasel = new Weasel(id);
    var self = this;
    weasel.on(Weasel.EVENTKEYS.weaselMoved, function(src, state){
        self.trigger(Game.EVENTKEYS.weaselMoved, {
            weaselId: src.id,
            weaselState: state
        });
    });
    this.weasels[weasel.id] = weasel;
};

Game.prototype.init = function init(){
    this.weasels = [];
    this.remainingMS = this.options.gameLengthSeconds * 1000;
    this.hits = 0;
    this.misses = 0;
    this.lastTickTime = 0;
    this.updateScore(0-this.score);
    this.updateRemainingTime(0);
    for(var i=1;i<=this.options.weaselCount;i++){
        this.addWeasel(i);
    }

    this.initDone = true;
};

Game.prototype.restart = function restart(){
    if (!this.initDone){
        this.init();
    }
    else{
        this.remainingMS = this.options.gameLengthSeconds * 1000;
        this.hits = 0;
        this.misses = 0;
        this.lastTickTime = 0;
        this.updateScore(0-this.score);
        this.updateRemainingTime(0);
    }
    this.start();
};

Game.prototype.start = function start(){
    if(!this.initDone){
        this.init();
    }
    this.startTicks = Date.now();
    this.lastTickTime = this.startTicks;
    this.playing = true;
    this.startAnimation();
    setTimeout(this.timerTick.bind(this), 1000);
    this.trigger(Game.EVENTKEYS.started, true);
};

Game.prototype.stop = function stop(){
    this.stopAnimation();
    this.playing = false;
    this.trigger(Game.EVENTKEYS.stopped, true);
};

Game.prototype.on = function on(eventName, handler){
    if(!this.events[eventName]){
        this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
};

Game.prototype.off = function off(eventName, handler){
    if(this.events[eventName]){
        if(this.events[eventName].contains(eventName)){
            this.events[eventName].remove(handler);
        }
    }
};

Game.prototype.trigger = function trigger(eventName, obj){
    if(this.events[eventName]){
        var self = this;
        this.events[eventName].forEach(function(h){
           h(self, obj);
        });
    }
};

Game.prototype.getWeaselIdToMove = function getWeaselIdToMove(weaselCount){
    var seed = Math.random();
    var pos = seed * (weaselCount);
    //1 based so ceil it
    return Math.ceil(pos);
};

Game.prototype.getRandomDelay = function getRandomDelay(min, max){
    var proposedDelay = Math.ceil(max * Math.random());
    while(proposedDelay < min){
        proposedDelay = Math.ceil(max * Math.random());
    }
    return proposedDelay;
};

Game.prototype.animate = function animate(){
    if(!this.animating){
        return;
    }
    var index = this.getWeaselIdToMove(this.options.weaselCount);
    var weasel = this.weasels[index];
    weasel.move();
    weasel.reset = setTimeout(function(){
            weasel.move();
            weasel.reset = undefined;
        },
        this.getRandomDelay(this.options.weaselMinUpMS, this.options.weaselMaxUpMS));

    setTimeout(this.animate.bind(this),
        this.getRandomDelay(this.options.weaselMinWaitMS, this.options.weaselMaxWaitMS));
};


Game.prototype.startAnimation = function startAnimation(){
    this.animating = true;
    setTimeout(this.animate.bind(this),
        this.getRandomDelay(this.options.weaselMinWaitMS, this.options.weaselMaxWaitMS));
};

Game.prototype.stopAnimation = function stopAnimation(){
    this.animating = false;
};

Game.prototype.updateScore = function updateScore(scoreToAdd){
    this.score += scoreToAdd;
    this.trigger(Game.EVENTKEYS.scoreChanged, this.score);
};

Game.prototype.updateRemainingTime = function updateRemainingTime(elapsedMS){
    this.remainingMS -=  elapsedMS;
    this.trigger(Game.EVENTKEYS.remainingTimeChanged, this.remainingMS);
    if(this.remainingMS <= 0){
        this.stop();
        this.trigger(Game.EVENTKEYS.gameOver, true);
    }
};

Game.prototype.whack = function whack(whacked_id){
    if(!this.playing){
        return;
    }

    var self = this;
    var hitWeasel = this.weasels[whacked_id];
    if(hitWeasel && hitWeasel.currentPosition === Weasel.POSITION.up){
        if (hitWeasel.reset){
            window.clearTimeout(hitWeasel.reset);
            hitWeasel.move();
            hitWeasel.reset = undefined;
        }
        self.updateScore(this.options.weaselHitPoints);
        this.hits++;
        this.trigger(Game.EVENTKEYS.weaselHit, hitWeasel);
    }
    else {
        self.updateScore(this.options.weaselMissPoints);
        this.misses++;
        this.trigger(Game.EVENTKEYS.weaselMiss, whacked_id);
    }
};

Game.prototype.timerTick = function timerTick(){
    if(!this.playing){
        return;
    }

    var now = Date.now();
    this.updateRemainingTime(now - this.lastTickTime);
    this.lastTickTime = now;
    this.gameDurationTicks = now - this.startTicks;
    this.trigger(Game.EVENTKEYS.gameDurationElapsed, this.gameDurationTicks);
    setTimeout(this.timerTick.bind(this), 1000 - (this.gameDurationTicks % 1000));
};

//module exports for testing
var module = module || {};
module.exports = Game;
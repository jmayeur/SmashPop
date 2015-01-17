var Weasel = function Weasel(id){
    this.currentPosition = Weasel.POSITION.down;
    this.events = {};
    this.id = id;
};

Weasel.POSITION = {
    up: 'up',
    down: 'down'
};

Weasel.EVENTKEYS = {
    weaselMoved: 'weaselMoved'
};

Weasel.prototype.move = function move(){
    if(this.currentPosition === Weasel.POSITION.down){
        this.currentPosition = Weasel.POSITION.up;
    }
    else{
        this.currentPosition = Weasel.POSITION.down;
    }
    this.trigger(Weasel.EVENTKEYS.weaselMoved, this.currentPosition);
};


Weasel.prototype.on = function on(eventName, handler){
    if(!this.events[eventName]){
        this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
};

Weasel.prototype.off = function off(eventName, handler){
    if(this.events[eventName]){
        if(this.events[eventName].contains(eventName)){
            this.events[eventName].remove(handler);
        }
    }
};

Weasel.prototype.trigger = function trigger(eventName, obj){
    if(this.events[eventName]){
        var self = this;
        this.events[eventName].forEach(function(h){
            h(self, obj);
        });
    }
};

//module exports for testing
var module = module || {};
module.exports = Weasel;
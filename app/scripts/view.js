
var GameView = function GameView(){
    this.game = null;
    this.audioHelper = new AudioHelper();
};

GameView.prototype.initGame = function initGame(
    scoreTextElementId, timeTextElementId, startBoxElementId,
    gameBoardElementId, gameOverBoxElementId, finalScoreElementId
) {
    this.audioHelper.initAudio();
    var self = this;
    this.scoreDisplay = document.getElementById(scoreTextElementId);
    this.timeDisplay = document.getElementById(timeTextElementId);
    this.startBox = document.getElementById(startBoxElementId);
    this.gameBoard = document.getElementById(gameBoardElementId);
    this.gameOverBox = document.getElementById(gameOverBoxElementId);
    this.finalScoreDisplay = document.getElementById(finalScoreElementId);

    this.game = new Game('Me');
    this.game.init();

    this.game.on(Game.EVENTKEYS.gameOver, function (src, value) {
        self.finalScoreDisplay.innerText = self.game.score;
        self.gameOverBox.classList.remove('hidden');
        self.gameBoard.classList.add('hidden');
    });

    this.game.on(Game.EVENTKEYS.scoreChanged, function(src, score){
        self.scoreDisplay.innerText = self.formatScore(score);
    });

    this.game.on(Game.EVENTKEYS.remainingTimeChanged, function(src, timeLeft){
        self.timeDisplay.innerText = self.formatTimeLeft(timeLeft);
    });

    this.game.on(Game.EVENTKEYS.weaselHit, function(src, weasel){
        var top = document.getElementById('holeTop_' + weasel.id);
        var bottom = document.getElementById('holeBottom_' + weasel.id);
        self.audioHelper.play();
        top.classList.add('hit');
        bottom.classList.add('hit');
        setTimeout(function(){
            top.classList.remove('hit');
            bottom.classList.remove('hit');
        }, 500);

    });

    this.game.on(Game.EVENTKEYS.weaselMiss, function(src, whacked_id){
        var top = document.getElementById('holeTop_' + whacked_id);
        var bottom = document.getElementById('holeBottom_' + whacked_id);

        top.classList.add('miss');
        bottom.classList.add('miss');
        setTimeout(function(){
            top.classList.remove('miss');
            bottom.classList.remove('miss');
        }, 500);
    });

    this.game.weasels.forEach(function (weasel) {
        var id = weasel.id;
        var container;
        //TODO: So this is lame, I should figure out a better
        //way to balance the board
        if(weasel.id == '4'){
            container = util.md('container_' + id, 'weasel-alt-container');
        }
        else{
            container = util.md('container_' + id, 'weasel-container');
        }

        var holeTop = util.md('holeTop_' + id, 'top-hole');
        var holeBottom = util.md('holeBottom_' + id, 'bottom-hole');
        var holeBottomBox = util.md('holeBottomBox_' + id, 'blanket');

        var img = new Image();
        img.src = './images/' + id + '.png';
        var imgWrapper = util.md('imgWrapper_' + id, ['weasel', 'down']);
        imgWrapper.appendChild(img);
        container.appendChild(holeTop);
        holeBottomBox.appendChild(holeBottom);
        container.appendChild(holeBottomBox);
        container.appendChild(imgWrapper);
        self.gameBoard.appendChild(container);

        weasel.on(Weasel.EVENTKEYS.weaselMoved, function (src, state) {
            self.setUpDown(document.getElementById('imgWrapper_' + src.id), state);
        });
    });
};

GameView.prototype.start = function start(){
    if(this.game.playing){
        return;
    }
    this.startBox.classList.add('hidden');
    this.gameBoard.classList.remove('hidden');
    this.game.start();
};

GameView.prototype.restart = function restart(){
    if(this.game.playing){
        return;
    }
    this.gameOverBox.classList.add('hidden');
    this.gameBoard.classList.remove('hidden');
    this.game.restart();
};

GameView.prototype.formatScore = function formatScore(score){
    //just roll with it
    var strScore;
    if (score >= 0){
        score = score % 10000000;
        strScore = score + '';
        while(strScore.length < 7){
            strScore = '0' + strScore;
        }
    }
    else{
        score = score*-1;
        score = score % 1000000;
        strScore = score + '';
        while(strScore.length < 6){
            strScore = '0' + strScore;
        }
        strScore = '-' + strScore;
    }
    return strScore;
};

GameView.prototype.formatTimeLeft = function formatTimeLeft(msLeft){
    return Math.ceil(msLeft/1000);
};

GameView.prototype.whackDetector = function whackDetector(e){
    var whacked_id;
    var killProp = function killProp(){
        e.preventDefault();
        e.stopPropagation();
    };
    switch (e.keyCode){
        case 37:
            whacked_id = 1;
            break;
        case 38:
            whacked_id = 2;
            break;
        case 39:
            whacked_id = 3;
            break;
        case 40:
            whacked_id = 4;
            break;
        case 32:
            whacked_id = 5;
            break;
    }
    if(whacked_id){
        killProp();
        this.game.whack(whacked_id);
    }
};

GameView.prototype.clickDetector = function clickDetector(e){
    if (!this.game.playing){
        this.start();
    }
};

GameView.prototype.setUpDown = function setUpDown(el, state){
    if(state === Weasel.POSITION.down){
        el.classList.remove('up');
        el.classList.add('down');
    }
    else{
        el.classList.remove('down');
        el.classList.add('up');
    }
};

var util = {
  md: function makeDiv(id, classArray){
      var div = document.createElement('div');
      div.id = id;
      if(classArray){
          if(classArray.constructor === Array){
              classArray.forEach(function(className){
                  div.classList.add(className);
              });
          }
          else{
              div.classList.add(classArray);
          }
      }
      return div;
  }
};




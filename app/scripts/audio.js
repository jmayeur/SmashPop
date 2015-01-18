//via http://www.html5rocks.com/en/tutorials/webaudio/intro/

var AudioHelper = function AudioHelper(){
    this.context;
    this.smashBuffer;
};

AudioHelper.prototype.initAudio = function initAudio(){
    var url = './audio/smash.ogg', self = this;

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new window.AudioContext();

    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
        self.context.decodeAudioData(request.response, function(buffer) {
            self.smashBuffer = buffer;
        }, function(e){
            console.log('Audio Buffer Failed', e);
        });
    };
    request.send();
};

AudioHelper.prototype.play = function play(){
    if(this.smashBuffer && this.context){
        var source = this.context.createBufferSource();
        source.buffer = this.smashBuffer;
        source.connect(this.context.destination);
        source.start(0);
    }
};





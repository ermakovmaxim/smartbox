SB.readyForPlatform('lg', function () {
    var updateInterval;

    var isReady = false, from;

    Player.extend({
        updateDelay: 500,
        _init: function () {

        },
        onEvent: function(){
            if(this.plugin.playState=='5'){
                this.state='stop';
                this.trigger('complete');
            }
        },
        _update: function () {
            var info = this.plugin.mediaPlayInfo();

            if (info && info.duration && !isReady) {
                //$('#log').append('<div>'+info.duration+'</div>');

                $$log(JSON.stringify(info));

                isReady = true;


                this.videoInfo = {
                    duration: info.duration / 1000
                };

                if(from){
                    this.seek(from);
                }

                this.trigger('ready');

            }

            if(!isReady){
                return;
            }

            this.videoInfo.currentTime=info.currentPosition/1000;
            this.trigger('update');
        },
        onBuffering: function (isStarted) {
            this.trigger(isStarted ? 'bufferingBegin' : 'bufferingEnd');
        },
        _play: function (options) {
            clearInterval(updateInterval);
            updateInterval = setInterval(function () {

                Player._update();
            }, this.updateDelay);
            isReady = false;

            $('#pluginPlayer').remove();

            $('body').append('<object mode3D="'+(options.is3d?'side_by_side':'off')+'" type="video/mp4" data="" width="1280" height="720" id="pluginPlayer" style="z-index: 0; position: absolute; left: 0; top: 0;"></object>');
            this.plugin = $('#pluginPlayer')[0];
            this.$plugin = $(this.plugin);
            this.plugin.onPlayStateChange = function () {
                self.onEvent.apply(self, arguments);
            }
            this.plugin.onBuffering = function () {
                self.onBuffering.apply(self, arguments);
            }


            this.plugin.data = options.url;
            this.plugin.play(1);

            from= options.from;
        },
        pause: function(){
            this.plugin.play(0);
            this.state="pause";
        },
        resume: function(){
            this.plugin.play(1);
            this.state="play";
        },
        _stop: function () {
            this.plugin.stop();
            this.state="stop";
        },
        seek: function(time){
            this.plugin.seek(time*1000);
        },
        audio: {
            set: function (index) {
            },
            get: function () {
               return [];
            },
            cur: function () {
                return 0;
            },
            toggle: function () {
            }
        }
    });
});
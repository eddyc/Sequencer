(function () {

    "use strict";

    function initialise(self) {

        self.receivedEvent = function (delay, event) {

            console.log(event);
            console.log(delay);
            self.scheduledEvent(delay, event);
        };

        const scheduler = new Scheduler(self.receivedEvent);

        const playButton = document.getElementById("PlayButton");

        playButton.onclick = function() {

            if (scheduler.isPlaying === true) {

                scheduler.stop();
            }
            else {

                scheduler.play();
            }
        };
        //
        // const tempoSlider = document.getElementById("TempoSlider");
        //
        // tempoSlider.oninput = function(event) {
        //
        //     clipScheduler.setBPM(event.target.value);
        // };
        //
        self.receivedTimeRange = function(timeRange) {

        };

    }

    Polymer({

        is: 'scheduler-engine',
        properties: {
        },
        initialise:function(scheduledEventCallback, tickCallback) {

            this.scheduledEvent = scheduledEventCallback;
            this.tick = tickCallback;
            initialise(this);
        },
    });
})();

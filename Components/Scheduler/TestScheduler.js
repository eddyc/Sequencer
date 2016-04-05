/* exported TestScheduler */

function FakeTimer(limit, step) {

    "use strict";

    const tickCallbacks = [];

    this.pushTickCallback = function(callback) {

        tickCallbacks.push(callback);
    };

    this.start = function() {

        for (let i = 0; i < limit; i += step) {

            for (let j = 0; j < tickCallbacks.length; j++) {

                tickCallbacks[j](i);
            }
        }
    };
}
function TestScheduler() {

    "use strict";

    const defaultBPM = 120;
    const defaultStartTime = {bar:0, beat:0, sixteenth:0, totalSixteenths:0};
    const defaultEndTime = {bar:1, beat:0, sixteenth:0, totalSixteenths:16};
    const defaultTimeRange = {start:defaultStartTime, end:defaultEndTime};

    const timer = new FakeTimer(4, 0.02);

    const clip = new Clip(defaultBPM, defaultTimeRange, eventCallback);

    function eventCallback(events) {

        console.log(events);
    }

    timer.pushTickCallback(clip.tick);

    clip.addEvent(0, {note:0, length:1/16});

    clip.play();
    timer.start();
}

/* exported Scheduler */

function Scheduler(eventCallback, tickCallback) {

    "use strict";

    const defaultBPM = 120;
    const defaultStartTime = {bar:0, beat:0, sixteenth:0, totalSixteenths:0};
    const defaultEndTime = {bar:1, beat:0, sixteenth:0, totalSixteenths:16};
    const defaultTimeRange = {start:defaultStartTime, end:defaultEndTime};
    const timer = new Timer();
    this.isPlaying = false;

    const clip = new NewClip(defaultBPM, defaultTimeRange, eventCallback);

    timer.pushTickCallback(clip.tick);

    clip.addEvent(0, {note:0, length:1/16});

    this.play = function() {

        clip.play();
        this.isPlaying = true;
    };

    this.stop = function() {

        clip.stop();
        this.isPlaying = false;
    };
}

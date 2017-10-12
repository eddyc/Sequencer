/* exported NewClip */
function NewClip(defaultBPM, defaultTimeRange, eventCallback) {

    "use strict";

    const self = this;
    const eventList = new EventList();


    const clipLengthSeconds = defaultBPM / 60;
    const lookAheadTimeSeconds = 0.2;
    const normalisedClipLengthRatio = 1;

    let startTimeSeconds = 0;
    let currentTimeSeconds = 0;

    self.isPlaying = false;

    this.play = function() {

        startTimeSeconds = currentTimeSeconds;
        self.isPlaying = true;
        this.tick(startTimeSeconds);
    };

    this.stop = function() {

        self.isPlaying = false;
    };

    let previousClipTimeRatio = 0;
    let lastReadSinglePass;

    function getEvents(clipTimeRatio, lookAheadTimeRatio) {

        const endTimeRatio = (clipTimeRatio + lookAheadTimeRatio) % 1;

        if (endTimeRatio > clipTimeRatio) {

            const events = eventList.getEvents(clipTimeRatio, endTimeRatio);
            // console.log(events);

            if (events.length > 0) {

                sendEvents(events);
            }

            // console.log("single %f %f", clipTimeRatio, endTimeRatio);
            lastReadSinglePass = true;
        }
        else if (endTimeRatio < clipTimeRatio) {

            const firstPass = normalisedClipLengthRatio;

            const firstEvents = eventList.getEvents(clipTimeRatio, firstPass);
            // console.log(firstEvents);


            if (firstEvents.length > 0) {

                sendEvents(firstEvents);
            }

            if (lastReadSinglePass === true) {

                eventList.reset();
            }

            const secondPass = endTimeRatio;
            const secondEvents = eventList.getEvents(0, secondPass);

            lastReadSinglePass = false;
            // console.log(secondEvents);

            if (secondEvents.length > 0) {

                sendEvents(secondEvents);
            }

            // console.log("double %f %f", clipTimeRatio, endTimeRatio);
        }

        previousClipTimeRatio = clipTimeRatio;
    }

    this.tick = function(currentTimeSecondsIn) {

        currentTimeSeconds = currentTimeSecondsIn;

        if (self.isPlaying === true) {

            const clipTimeSeconds = (currentTimeSeconds - startTimeSeconds) % clipLengthSeconds;
            const clipTimeRatio = clipTimeSeconds / clipLengthSeconds;
            const lookAheadTimeRatio = lookAheadTimeSeconds / clipLengthSeconds;

            const events = getEvents(clipTimeRatio, lookAheadTimeRatio);

            if (typeof events !== 'undefined') {

                sendEvents(events);
            }
            console.log(clipTimeRatio);
        }
    };

    function sendEvents(events) {

        for (let i = 0; i < events.length; ++i) {

            const eventTimeRatio = events[i].time;

            eventCallback(eventTimeRatio, events[i]);
        }
    }
    this.addEvent = function(time, event){


        eventList.insert(time, event);
    };

}

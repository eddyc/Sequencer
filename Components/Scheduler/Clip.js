/* exported Clip */
function Clip(defaultBPM, defaultTimeRange, eventCallback) {

    "use strict";
    
    const self = this;
    const eventList = new EventList();
    const clipLengthSeconds = defaultBPM / 60;
    const normalisedClipLength = 1;

    self.isPlaying = false;
    let startTime;
    let currentTime = 0;
    let bpm = defaultBPM;
    const lookAheadTimeSeconds = 0.1;
    const normalisedLookAheadTime = lookAheadTimeSeconds / clipLengthSeconds;

    this.setBPM = function(newBPM) {

        bpm = newBPM;
    };

    this.addEvent = function(time, event) {

        eventList.insert(time, event);
    };

    this.play = function() {

        startTime = currentTime;
        self.isPlaying = true;
        this.tick(startTime);
    };

    this.stop = function() {

        self.isPlaying = false;
    };

    this.tick = function(time) {

        currentTime = time;

        if (self.isPlaying === true) {

            const clipTime = time - startTime;
            const normalisedClipPosition = (clipTime / clipLengthSeconds) % normalisedClipLength;
            const lookAhead = (normalisedClipPosition + normalisedLookAheadTime) % normalisedClipLength;

            if (lookAhead > normalisedClipPosition) {

                readEvents(normalisedClipPosition, (normalisedClipPosition + normalisedLookAheadTime) % normalisedClipLength, normalisedClipPosition);
            }
            else {

                readEvents(normalisedClipPosition, normalisedClipLength, normalisedClipPosition);
                eventList.reset();
                readEvents(0, lookAhead, normalisedClipPosition);
            }

        }
    };

    function readEvents(startTime, endTime, position) {

        const currentEvents = eventList.getEvents(startTime, endTime);

        if (currentEvents.length > 0) {

            for (let i = 0; i < currentEvents.length; i++) {

                const delayTime = ((normalisedClipLength + currentEvents[i].time) - position) % normalisedClipLength;
                // eventCallback(startTime - currentEvents[i].time , currentEvents[i]);
                eventCallback(delayTime, currentEvents[i]);
            }
        }
    }

    this.setTimeRange = function(timeRange) {

        console.log(timeRange);
    };
}

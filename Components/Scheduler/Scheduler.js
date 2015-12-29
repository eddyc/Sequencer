/* exported Scheduler */

function Scheduler(eventCallback) {

    const events = new Events();
    const lookAheadTimeSeconds = 0.1;
    let absoluteTimeSeconds = 0;

    this.tick = function (absoluteTimeSecondsInput) {

        absoluteTimeSeconds = absoluteTimeSecondsInput;
        //console.log("%f", absoluteTimeSeconds);
        queryEvents();
    };

    function queryEvents() {

        const currentEvents = events.getEvents(absoluteTimeSeconds + lookAheadTimeSeconds);

        if (currentEvents.length === 0) return;

        const delayTime = (currentEvents[0].time - absoluteTimeSeconds) * 1000;

        for (let i = 0; i < currentEvents.length; ++i) {

            eventCallback(currentEvents[i].time - absoluteTimeSeconds);
        }
    }

    this.addEvent = function(time, event) {

        events.insert(time, event);
    };
}

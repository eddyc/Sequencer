/* exported Events */
function Events() {

    "use strict";

    const eventList = [];
    this.eventList = eventList;
    this.insert = function(time, event) {

        const eventListItem = {time:time, event:event};

        if (eventList.length === 0) {

            eventList.push(eventListItem);
        }
        else {

            eventList.splice(locationOf(eventListItem) + 1, 0, eventListItem);
        }
        return eventList;
    };

    this.remove = function(event) {

        eventList.splice(eventList.indexOf(event), 1);
    };

    function locationOf(eventListItem, start, end) {

        start = start || 0;
        end = end || eventList.length;

        const pivot = parseInt(start + (end - start) / 2, 10);

        if (eventList[pivot].time === eventListItem.time){

            return pivot;
        }

        if (end - start <= 1) {

            return eventList[pivot].time > eventListItem.time ? pivot - 1 : pivot;
        }

        if (eventList[pivot].time < eventListItem.time) {

            return locationOf(eventListItem, pivot, end);
        }
        else {

            return locationOf(eventListItem, start, pivot);
        }
    }

    let readEventsIndex = 0;

    this.getEvents = function (endTime) {

        const eventsOut = [];

        for (; readEventsIndex < eventList.length; ++readEventsIndex) {

            if (eventList[readEventsIndex].time < endTime) {

                eventsOut.push(eventList[readEventsIndex]);
            }
            else {

                break;
            }
        }

        return eventsOut;
    };

    this.reset = function() {

        readEventsIndex = 0;
    };
}

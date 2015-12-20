/* exported TimeRange */

function TimeRange(timeRangeDiv, defaultTimeRange, defaultTimeSignature) {

    "use strict";

    const  timeRange = defaultTimeRange;
    let timeSignature = defaultTimeSignature;

    const startTimePoint = instantiateTimePoint("Start", timeRange.start);
    const endTimePoint = instantiateTimePoint("End", timeRange.end);
    const valueStepSize = 10;

    const changedCallbacks = [];

    this.pushChangedCallback = function(callback) {

        changedCallbacks.push(callback);
    };

    this.timeSignatureChanged = function(timeSignatureIn) {

        timeSignature = timeSignatureIn;

        const sixteenthsPerBeat = 16 / timeSignature.denominator;
        const sixteenthsPerBar = sixteenthsPerBeat * timeSignature.numerator;
        setTimeRangeTotalSixteenths(sixteenthsPerBeat, sixteenthsPerBar, timeRange.start, timeRange.start.totalSixteenths);
        setTimeRangeTotalSixteenths(sixteenthsPerBeat, sixteenthsPerBar, timeRange.end, timeRange.end.totalSixteenths);
        setNumberDisplay();
    };

    function setTimeRangeTotalSixteenths(sixteenthsPerBeat, sixteenthsPerBar, timeRangePoint, totalSixteenths) {

        let sixteenths = totalSixteenths;

        timeRangePoint.bar = Math.floor(sixteenths / sixteenthsPerBar);
        sixteenths -= timeRangePoint.bar * sixteenthsPerBar;
        timeRangePoint.beat = Math.floor(sixteenths / sixteenthsPerBeat);
        sixteenths -= timeRangePoint.beat * sixteenthsPerBeat;
        timeRangePoint.sixteenth = sixteenths;
        timeRangePoint.totalSixteenths = totalSixteenths;
    }

    function instantiateNumberDiv(divId, number) {

        const numberDiv = document.getElementById(divId);
        numberDiv.addEventListener('mousedown', mouseDown);
        numberDiv.innerHTML = number;
        return numberDiv;
    }

    function instantiateTimePoint(numberId, timePointData) {

        const bar = instantiateNumberDiv(numberId + "Bar", timePointData.bar);
        const beat = instantiateNumberDiv(numberId + "Beat", timePointData.beat);
        const sixteenth = instantiateNumberDiv(numberId + "Sixteenth", timePointData.sixteenth);

        return {
            beat:beat,
            bar:bar,
            sixteenth:sixteenth
        };
    }

    function mouseDown(event) {

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);

        const sixteenthsPerBeat = 16 / timeSignature.denominator;
        const sixteenthsPerBar = sixteenthsPerBeat * timeSignature.numerator;

        const callingElement = event.currentTarget;
        let position = event.clientY;
        const idString = callingElement.parentElement.id;
        const isStartTime = idString.localeCompare("Start") === 0 ? true : false;
        const initialTotalSixteenthsValue = isStartTime ? timeRange.start.totalSixteenths : timeRange.end.totalSixteenths;
        const timeRangePoint = isStartTime ? timeRange.start : timeRange.end;

        function mouseMove(event) {

            const deltaY = position - event.clientY;
            const step = Math.round(deltaY / valueStepSize);
            let sixteenthsValue = 0;

            if (callingElement === startTimePoint.sixteenth || callingElement === endTimePoint.sixteenth) {

                sixteenthsValue = step + initialTotalSixteenthsValue;
            }
            else if (callingElement === startTimePoint.beat || callingElement === endTimePoint.beat) {

                sixteenthsValue = step * sixteenthsPerBeat + initialTotalSixteenthsValue;
            }
            else if (callingElement === startTimePoint.bar || callingElement === endTimePoint.bar) {

                sixteenthsValue = step * sixteenthsPerBar + initialTotalSixteenthsValue;
            }

            if (isStartTime) {

                const endSixteenth = timeRange.end.totalSixteenths;
                if (sixteenthsValue > endSixteenth - 1) {

                    sixteenthsValue = endSixteenth - 1;
                }
            }
            else {

                const startSixteenth = timeRange.start.totalSixteenths;

                if (sixteenthsValue <  startSixteenth + 1) {

                    sixteenthsValue = startSixteenth + 1;
                }
            }

            setTimeRangeTotalSixteenths(sixteenthsPerBeat, sixteenthsPerBar, timeRangePoint, sixteenthsValue);
            setNumberDisplay(isStartTime);

            changedCallbacks.forEach(function(callback) {

                callback(timeRange);
            });
        }

        function mouseUp() {

            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }
    }

    function setNumberDisplay() {

        function getNumbers(timePoint, timeRangeObject) {

            timePoint.bar.innerHTML = timeRangeObject.bar;
            timePoint.beat.innerHTML = timeRangeObject.beat;
            timePoint.sixteenth.innerHTML = timeRangeObject.sixteenth;
        }

        getNumbers(startTimePoint, timeRange.start);
        getNumbers(endTimePoint, timeRange.end);
    }
}

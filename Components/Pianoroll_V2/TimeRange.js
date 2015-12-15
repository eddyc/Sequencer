/* exported TimeRange */

function TimeRange(timeRangeDiv, defaultTimeRange, defaultTimeSignature) {

    "use strict";

    const  timeRange = defaultTimeRange;
    let timeSignature = defaultTimeSignature;

    const startTimePoint = instantiateTimePoint("Start Time", timeRange.start);
    timeRangeDiv.appendChild(document.createElement('br'));
    timeRangeDiv.appendChild(document.createElement('br'));
    const endTimePoint = instantiateTimePoint("End Time", timeRange.end);
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

    function instantiateNumberDiv(numberText) {

        const numberDiv = document.createElement("div");
        numberDiv.className = "ScrollableNumber";
        const numberTextDiv = document.createElement("div");
        numberTextDiv.className = "NumberDiv";
        numberTextDiv.innerHTML = numberText;
        numberDiv.appendChild(numberTextDiv);
        numberDiv.value = numberText;
        numberDiv.textDiv = numberTextDiv;
        numberDiv.addEventListener('mousedown', mouseDown);

        return {container:numberDiv, number:numberTextDiv};
    }

    function instantiateTimePoint(label, timePointData) {

        const containerDiv = document.createElement("div");
        const labelDiv = document.createElement("div");
        labelDiv.className = "label label-default";
        labelDiv.innerHTML = label;
        labelDiv.id = "TimeSignatureLabel";
        containerDiv.appendChild(labelDiv);
        timeRangeDiv.appendChild(containerDiv);

        const bar = instantiateNumberDiv(timePointData.bar);
        containerDiv.appendChild(bar.container);
        const beat = instantiateNumberDiv(timePointData.beat);
        containerDiv.appendChild(beat.container);
        const sixteenth = instantiateNumberDiv(timePointData.sixteenth);
        containerDiv.appendChild(sixteenth.container);

        return {
            containerDiv:containerDiv,
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
        const isStartTime = callingElement.parentElement === startTimePoint.containerDiv ? true : false;
        const initialTotalSixteenthsValue = isStartTime ? timeRange.start.totalSixteenths : timeRange.end.totalSixteenths;
        const timeRangePoint = isStartTime ? timeRange.start : timeRange.end;

        function mouseMove(event) {

            const deltaY = position - event.clientY;
            const step = Math.round(deltaY / valueStepSize);
            let sixteenthsValue = 0;

            if (callingElement === startTimePoint.sixteenth.container || callingElement === endTimePoint.sixteenth.container) {

                sixteenthsValue = step + initialTotalSixteenthsValue;
            }
            else if (callingElement === startTimePoint.beat.container || callingElement === endTimePoint.beat.container) {

                sixteenthsValue = step * sixteenthsPerBeat + initialTotalSixteenthsValue;
            }
            else if (callingElement === startTimePoint.bar.container || callingElement === endTimePoint.bar.container) {

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

            timePoint.bar.number.innerHTML = timeRangeObject.bar;
            timePoint.beat.number.innerHTML = timeRangeObject.beat;
            timePoint.sixteenth.number.innerHTML = timeRangeObject.sixteenth;
        }

        getNumbers(startTimePoint, timeRange.start);
        getNumbers(endTimePoint, timeRange.end);
    }
}

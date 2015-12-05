/* exported TimeRangeControl */

function TimeRangeControl(timeSignatureControl, startTimeRange, endTimeRange, timeRangeChangedCallback) {

    "use strict";

    const startTimeObject = initialiseTimeRange(startTimeRange);
    const endTimeObject = initialiseTimeRange(endTimeRange);
    let startSixteenth = 0;
    let endSixteenth = 16;
    const valueStepSize = 10;
    setNumberDisplay(startSixteenth,endSixteenth);


    function initialiseTimeRange(timeRange) {

        let timeRangeObject = {};
        timeRangeObject.barsNumber = timeRange.childNodes[3].childNodes[1];
        timeRangeObject.barsElement = timeRange.childNodes[3];
        timeRangeObject.barsElement.addEventListener('mousedown', mouseDown);
        timeRangeObject.beatsNumber = timeRange.childNodes[5].childNodes[1];
        timeRangeObject.beatsElement = timeRange.childNodes[5];
        timeRangeObject.beatsElement.addEventListener('mousedown', mouseDown);
        timeRangeObject.sixteenthsNumber = timeRange.childNodes[7].childNodes[1];
        timeRangeObject.sixteenthsElement = timeRange.childNodes[7];
        timeRangeObject.sixteenthsElement.addEventListener('mousedown', mouseDown);
        return timeRangeObject;
    }

    function mouseDown(event) {

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);

        const callingElement = event.currentTarget;
        const startPosition = event.clientY;

        let changedStartSixteenth;
        let changedEndSixteenth;

        function mouseMove(event) {

            const deltaY = startPosition - event.clientY;
            const roundedIncrement = Math.round(deltaY / valueStepSize);

            if (callingElement === startTimeObject.sixteenthsElement) {
                changedStartSixteenth = startSixteenth + roundedIncrement;
                changedEndSixteenth = endSixteenth;
            }
            else if (callingElement === endTimeObject.sixteenthsElement) {

                changedEndSixteenth = endSixteenth + roundedIncrement;
                changedStartSixteenth = startSixteenth;
            }
            else if (callingElement === startTimeObject.beatsElement) {
                changedStartSixteenth = startSixteenth + (roundedIncrement * timeSignatureControl.sixteenthsPerBeat);
                changedEndSixteenth = endSixteenth;
            }
            else if (callingElement === endTimeObject.beatsElement) {
                changedStartSixteenth = startSixteenth;
                changedEndSixteenth = endSixteenth + (roundedIncrement * timeSignatureControl.sixteenthsPerBeat);
            }
            else if (callingElement === startTimeObject.barsElement) {
                changedStartSixteenth = startSixteenth + (roundedIncrement * timeSignatureControl.sixteenthsPerBar);
                changedEndSixteenth = endSixteenth;
            }
            else if (callingElement === endTimeObject.barsElement) {
                changedStartSixteenth = startSixteenth;
                changedEndSixteenth = endSixteenth + (roundedIncrement * timeSignatureControl.sixteenthsPerBar);
            }

            if (changedStartSixteenth != startSixteenth) {

                if (changedStartSixteenth > endSixteenth - 1) {

                    changedStartSixteenth = endSixteenth - 1;
                }
            }

            if (changedEndSixteenth != endSixteenth) {

                if (changedEndSixteenth < startSixteenth + 1) {

                    changedEndSixteenth = startSixteenth + 1;
                }
            }
            console.log("%f %f", changedStartSixteenth, changedEndSixteenth);

            setNumberDisplay(changedStartSixteenth, changedEndSixteenth);
        }

        function mouseUp() {

            startSixteenth = changedStartSixteenth;
            endSixteenth = changedEndSixteenth;
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }
    }

    function setNumberDisplay(startSixteenthIn, endSixteenthIn) {

        function getNumbers(sixteenths, timeObject) {

            const totalSixteenths = sixteenths;

            const bars = Math.floor(sixteenths / timeSignatureControl.sixteenthsPerBar);
            sixteenths -= bars * timeSignatureControl.sixteenthsPerBar;
            const beats = Math.floor(sixteenths / timeSignatureControl.sixteenthsPerBeat);
            sixteenths -= beats * timeSignatureControl.sixteenthsPerBeat;


            timeObject.barsNumber.innerHTML = bars ;
            timeObject.beatsNumber.innerHTML = beats ;
            timeObject.sixteenthsNumber.innerHTML = sixteenths ;
            return {bars:bars, beats:beats, sixteenths:sixteenths, totalSixteenths:totalSixteenths};
        }

        const startTime = getNumbers(startSixteenthIn, startTimeObject);
        const endTime = getNumbers(endSixteenthIn, endTimeObject);


        timeRangeChangedCallback(timeSignatureControl.getTimeSignature(), startTime, endTime);
    }

    this.timeSignatureChanged = function() {

        setNumberDisplay(startSixteenth, endSixteenth);
    };


    // function set

}

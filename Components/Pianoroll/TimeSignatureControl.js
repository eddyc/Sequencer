/* exported TimeSignatureControl */

function TimeSignatureControl(numerator, denominator) {

    "use strict";

    const numeratorNumber = numerator.childNodes[0].nextSibling;
    const denominatorNumber = denominator.childNodes[0].nextSibling;
    numeratorNumber.innerHTML = 4;
    denominatorNumber.innerHTML = 4;
    const self = this;
    self.sixteenthsPerBar = 16;
    self.sixteenthsPerBeat = 4;
    self.changedCallback = null;

    const denominatorValues = [1, 2, 4, 8, 16];
    const valueStepSize = 10;

    let numeratorCurrentValue = parseInt(numeratorNumber.innerHTML);
    let denominatorCurrentIndex = 2;

    numerator.addEventListener('mousedown', function (event){

        const startPosition = event.clientY;
        function mouseMove(event) {

            const deltaY = startPosition - event.clientY;
            let value = Math.round(deltaY / valueStepSize) + numeratorCurrentValue;

            if (value <= 0) {

                value = 1;
            }

            numeratorNumber.innerHTML = value;
            calculateSixteenthDivisions();
            self.changedCallback();
        }

        function mouseUp() {

            numeratorCurrentValue = parseInt(numeratorNumber.innerHTML);
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    });

    denominator.addEventListener('mousedown', function (event) {

        const startPosition = event.clientY;
        let index;
        function mouseMove(event) {

            const deltaY = startPosition - event.clientY;
            index = Math.round(deltaY / valueStepSize) + denominatorCurrentIndex;

            if (index < 0) {

                index = 0;
            }

            if (index >= denominatorValues.length - 1) {

                index = denominatorValues.length - 1;
            }

            denominatorNumber.innerHTML = denominatorValues[index];
            calculateSixteenthDivisions();
            self.changedCallback();
        }


        function mouseUp() {

            denominatorCurrentIndex = index;
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);

    });

    function calculateSixteenthDivisions() {

        self.sixteenthsPerBeat = 16 / parseInt(denominatorNumber.innerHTML);
        self.sixteenthsPerBar = self.sixteenthsPerBeat * parseInt(numeratorNumber.innerHTML);
    }

    this.setChangedCallback = function(callback) {

        self.changedCallback = callback;
    };

    this.getTimeSignature = function() {

        const numerator = parseInt(numeratorNumber.innerHTML);
        const denominator = parseInt(denominatorNumber.innerHTML);
        return {numerator:numerator, denominator:denominator};
    };
}

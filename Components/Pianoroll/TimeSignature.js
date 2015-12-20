/* exported TimeSignature */

function TimeSignature (defaultTimeSignature) {

    "use strict";


    const numerator = document.getElementById("NumeratorButton");
    numerator.innerHTML = defaultTimeSignature.numerator;
    numerator.value = defaultTimeSignature.numerator;


    numerator.limitFunction = function(n) {return n < 1 ? 1 : n;};
    numerator.valueFunction = function (n) { return n;};

    const denominator = document.getElementById("DenominatorButton");
    denominator.innerHTML = defaultTimeSignature.denominator;
    denominator.value = Math.sqrt(defaultTimeSignature.denominator);

    denominator.valueFunction = function(n) {return Math.pow(2, n);};
    denominator.limitFunction = function(n) {return n < 0 ? 0 : n > 4 ? 4 : n;};

    const valueStepSize = 20;

    numerator.addEventListener('mousedown', changeTimeSignature);
    denominator.addEventListener('mousedown', changeTimeSignature);

    const changedCallbacks = [];

    function changeTimeSignature(event){

        const startPosition = event.clientY;
        const timeElement = event.currentTarget;
        const numeratorCurrentValue = timeElement.value;

        function mouseMove(event) {

            const deltaY = startPosition - event.clientY;
            let value = Math.round(deltaY / valueStepSize) + numeratorCurrentValue;

            value = timeElement.limitFunction(value);

            timeElement.innerHTML = timeElement.valueFunction(value);
            timeElement.value = value;

            changedCallbacks.forEach(function(callback) {

                callback({numerator:parseInt(numerator.valueFunction(numerator.value)), denominator:parseInt(denominator.valueFunction(denominator.value))});
            });
        }

        function mouseUp() {

            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }

        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', mouseUp);
    }

    this.pushChangedCallback = function(callback) {

        changedCallbacks.push(callback);
    };
}

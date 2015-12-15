/* exported TimeSignature */

function TimeSignature (timeSignatureDiv, defaultTimeSignature) {

    "use strict";

    const labelDiv = document.createElement("div");
    labelDiv.innerHTML = "Time Signature";
    labelDiv.id = "TimeSignatureLabel";
    labelDiv.className = "label label-default";
    timeSignatureDiv.appendChild(labelDiv);

    const groupDiv = document.createElement("div");
    groupDiv.className = "btn-group";
    groupDiv.id = "ButtonOverride";

    timeSignatureDiv.appendChild(groupDiv);

    const numerator = instantiateNumberDiv(defaultTimeSignature.numerator);
    numerator.textDiv.innerHTML = defaultTimeSignature.numerator;

    groupDiv.appendChild(numerator);

    numerator.limitFunction = function(n) {return n < 1 ? 1 : n;};
    numerator.valueFunction = function (n) { return n;};

    const denominator = instantiateNumberDiv(Math.sqrt(defaultTimeSignature.denominator));
    denominator.textDiv.innerHTML = defaultTimeSignature.denominator;
    groupDiv.appendChild(denominator);

    denominator.valueFunction = function(n) {return Math.pow(2, n);};
    denominator.limitFunction = function(n) {return n < 0 ? 0 : n > 4 ? 4 : n;};

    const valueStepSize = 20;

    numerator.addEventListener('mousedown', changeTimeSignature);
    denominator.addEventListener('mousedown', changeTimeSignature);

    const changedCallbacks = [];


    function instantiateNumberDiv(numberText) {

        const numberDiv = document.createElement("div");
        numberDiv.className = "btn btn-default btn-sm";
        const numberTextDiv = document.createElement("div");
        numberTextDiv.className = "NumberDiv";
        numberTextDiv.innerHTML = numberText;
        numberDiv.appendChild(numberTextDiv);
        numberDiv.value = numberText;
        numberDiv.textDiv = numberTextDiv;

        return numberDiv;
    }

    function changeTimeSignature(event){

        const startPosition = event.clientY;
        const timeElement = event.currentTarget;
        const numeratorCurrentValue = timeElement.value;

        function mouseMove(event) {

            const deltaY = startPosition - event.clientY;
            let value = Math.round(deltaY / valueStepSize) + numeratorCurrentValue;

            value = timeElement.limitFunction(value);

            timeElement.textDiv.innerHTML = timeElement.valueFunction(value);
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

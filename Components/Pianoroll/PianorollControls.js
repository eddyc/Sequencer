(function (){

    "use strict";

    function initialise(self) {

        const pianoroll = document.getElementById("Pianoroll");
        const timeSignatureControl = new TimeSignatureControl(self.$.Numerator, self.$.Denominator);
        const timeRangeControl = new TimeRangeControl(timeSignatureControl, self.$.StartTimeRange, self.$.EndTimeRange, timeRangeChangedCallback);
        timeSignatureControl.setChangedCallback(timeRangeControl.timeSignatureChanged);
        function timeRangeChangedCallback(timeSignature, startTimeRange, endTimeRange) {
            pianoroll.timePropertyChanged(timeSignature, startTimeRange, endTimeRange);
        }
    }

    Polymer({

        is: 'piano-roll-controls',
        ready: function () {

            initialise(this);
        },

    });
})();

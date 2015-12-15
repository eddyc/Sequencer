(function () {

    "use strict";

    function initialise(self) {

        const horizontalZoomBounds = {offsetX:100, height:40};
        const defaultTimeSignature = {numerator:4, denominator:4};
        const defaultStartTime = {bar:0, beat:0, sixteenth:0, totalSixteenths:0};
        const defaultEndTime = {bar:1, beat:0, sixteenth:0, totalSixteenths:16};
        const defaultTimeRange = {start:defaultStartTime, end:defaultEndTime};

        const timeSignatureControl = new TimeSignature(self.$.TimeSignature, defaultTimeSignature);
        const timeRangeControl = new TimeRange(self.$.TimeRange, defaultTimeRange, defaultTimeSignature);
        timeSignatureControl.pushChangedCallback(timeRangeControl.timeSignatureChanged);


    }

    Polymer({

        is: 'piano-roll',
        timePropertyChanged:null,
        properties: {
            width:Number,
            height:Number
        },
        ready: function () {

            initialise(this);
        },

    });
})();

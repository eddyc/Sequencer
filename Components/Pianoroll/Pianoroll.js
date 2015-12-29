(function () {

    "use strict";
    function initialise() {

        const self = this;
        const horizontalZoomBounds = {offsetX:100, height:40};
        const defaultTimeSignature = {numerator:4, denominator:4};
        const defaultStartTime = {bar:0, beat:0, sixteenth:0, totalSixteenths:0};
        const defaultEndTime = {bar:1, beat:0, sixteenth:0, totalSixteenths:16};
        const defaultTimeRange = {start:defaultStartTime, end:defaultEndTime};
        const octaveBounds = {count:8, normalisedVisible:2};

        const timeSignatureControl = new TimeSignature(defaultTimeSignature);
        const timeRangeControl = new TimeRange(self.$.TimeRange, defaultTimeRange, defaultTimeSignature);
        timeSignatureControl.pushChangedCallback(timeRangeControl.timeSignatureChanged);
        timeSignatureControl.pushChangedCallback(timeSignatureChanged);
        timeRangeControl.pushChangedCallback(timeRangeChanged);

        const frequencyAxis = new FrequencyAxis(self.$.FrequencyAxisMask, self.$.FrequencyAxisGroup, horizontalZoomBounds, self.$.Pianoroll, octaveBounds);

        const timeAxis = new TimeAxis(self.$.TimeAxisMask, self.$.TimeAxisGroup, horizontalZoomBounds, self.$.Pianoroll, defaultTimeSignature, defaultTimeRange);
        timeAxis.setSize();

        const interaction = new Interaction(self.$.TransformState, horizontalZoomBounds,  self.$.Pianoroll, onInteraction, onDoubleClick, onMouseMove, octaveBounds, defaultTimeRange);

        const noteLayer = new NoteLayer(self.$.NoteLayerMask, self.$.NoteLayerGroup, horizontalZoomBounds, self.$.Pianoroll);

        self.setSize = function() {

            timeAxis.setSize();
            interaction.setSize();
            frequencyAxis.rescale();
        };

        function timeSignatureChanged(timeSignature) {

            timeAxis.setTimeProperties(timeSignature);
        }

        function timeRangeChanged(timeRange) {

            interaction.setTimeRange(timeRange);
        }

        function onInteraction(matrix) {

            timeAxis.transform(matrix);
            frequencyAxis.transform(matrix);
        }

        function onDoubleClick(position) {

            const frequency = frequencyAxis.getFrequencyPosition();
            const time = timeAxis.getTimePosition(position);
            const quantisedZoom = timeAxis.getZoomLevel();
            noteLayer.pushNote(frequency, time, quantisedZoom);
        }

        function onMouseMove(position, isNoteRect) {

            frequencyAxis.onMouseMove(position);

            if (isNoteRect) {

                timeAxis.onMouseMove(position);
            }
        }

        self.setSize();
    }

    Polymer({

        is: 'piano-roll',
        properties: {
            width:Number,
            height:Number
        },
        initialise:initialise,

    });
})();

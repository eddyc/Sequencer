(function (){

    "use strict";

    function initialise(self) {

        const horizontalZoomBounds = {offsetX:100, height:40};

        const resizableDiv = new ResizableDiv(self.parentElement, self.$.ResizableDiv, self.width, self.height, self.x, self.y, onResize);

        const timeAxis = new TimeAxis(self.$.TimeAxisParent, self.$.TimeAxisGroup, horizontalZoomBounds, resizableDiv);

        const octaveBounds = {count:3, normalisedVisible:2};

        const frequencyAxis = new FrequencyAxis(self.$.FrequencyAxisParent, self.$.FrequencyAxisGroup, horizontalZoomBounds, resizableDiv, octaveBounds);

        const interaction = new Interaction(self.$.InteractionParent, self.$.TransformState, horizontalZoomBounds, resizableDiv, onInteraction, octaveBounds);

        timeAxis.setSize();
        frequencyAxis.setSize();

        function onResize() {

            timeAxis.setSize();
            frequencyAxis.rescale();
            interaction.setSize();
        }

        function onInteraction(matrix) {

            timeAxis.transform(matrix);
            frequencyAxis.transform(matrix);
        }


        self.timePropertyChanged = function(timeSignature, startTimeRange, endTimeRange) {

            timeAxis.setTimeProperties(timeSignature, startTimeRange, endTimeRange);

        };

        onResize();
    }

    Polymer({

        is: 'piano-roll',
        timePropertyChanged:null,
        properties: {
            width:Number,
            height:Number,
            x:Number,
            y:Number
        },

        ready: function () {

            initialise(this);
        },

    });
})();

(function (){

    var self;

    function initialise() {

        var rootDiv = self.$.root;
        rootDiv.style.width = self.width + "px";
        rootDiv.style.height = self.height + "px";
        rootDiv.style.border = "1px solid black"

        var resizableDivWidth = 500;
        var resizableDivHeight = 500;
        var resizableDivElement = self.$.resizable;

        function onResize(resizableElement) {

            timeAxisNav.onResize(resizableElement);
            interaction.onResize(resizableElement);
        }

        function onInteraction(matrix) {

            noteAreaNav.transform(matrix);
            timeAxisNav.transform(matrix);
        }

        var horizontalZoomSize = {xOffset:80, height:40};
        var noteAreaSize = {xOffset:80, yOffset:40};

        var resizableDiv = new ResizableDiv(rootDiv, resizableDivElement, 50, 50, resizableDivWidth, resizableDivHeight, onResize);

        var noteAreaNav = new NoteArea(self.$.NoteAreaParent, self.$.NoteAreaGroup, noteAreaSize);

        var timeAxisNav = new TimeAxis(self.$.TimeAxisParent, self.$.TimeAxisGroup, horizontalZoomSize,  resizableDivWidth, resizableDivHeight);

        var interaction = new Interaction(self.$.InteractionParent, resizableDivWidth, resizableDivHeight, horizontalZoomSize, noteAreaSize, onInteraction);
    }

    Polymer({

        is: 'piano-roll',

        properties: {
            width:Number,
            height:Number,
        },

        ready: function () {

            self = this;
            initialise();
        },

    });
})()

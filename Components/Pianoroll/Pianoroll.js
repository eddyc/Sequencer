(function (){

    var self;

    function initialise() {

        var viewport = self.$.viewport;
        viewport.innerHTML = "  <circle cx=\"250\" cy=\"250\" r=\"20\" stroke=\"black\" stroke-width=\"3\" fill=\"red\" />";
        var svgParent = self.$.svgParent;
        var viewportNav = new SVGNavigation(svgParent, viewport, self.width, self.height, interactionCallback);

        var timeAxis = self.$.timeAxis;
        var timeAxisNav = new TimeAxis(svgParent, timeAxis, self.width, self.height);

        function interactionCallback(matrix) {

            timeAxisNav.transform(matrix);
            return matrix;
        }
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

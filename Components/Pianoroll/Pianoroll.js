(function (){

    var self;

    function initialise() {

        var timeAxisNavArea = {x:0, y:0, width:self.width, height:30};
        var standardNavArea = {x:0, y:30, width:self.width, height:self.height - 30};

        var interaction = self.$.interaction;
        var svgParent = self.$.svgParent;
        var interactionNav = new SVGNavigation(svgParent, interaction, self.width, self.height, interactionCallback, standardNavArea, timeAxisNavArea);

        var timeAxis = self.$.timeAxis;

        var timeAxisNav = new TimeAxis(svgParent, timeAxis, self.width, self.height, timeAxisNavArea);

        var noteArea = self.$.noteArea;
        var noteAreaNav = new NoteArea(svgParent, noteArea, self.width, self.height);
        // noteArea.innerHTML = "<rect x='300' y ='300' width='300' height='100' style='fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)' />";

        function interactionCallback(matrix) {

            timeAxisNav.transform(matrix);
            noteAreaNav.transform(matrix);
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

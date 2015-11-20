(function (){

    var self;
    function initialise() {

        var svgNavigation = self.$.svgNavigation;
        var timeAxisLayer = new TimeAxisLayer(self.width, self.height, svgNavigation.$.viewport);
        svgNavigation.receivedInteraction = function(matrix) {

            // console.log(matrix);
            matrix = constrainMatrix(matrix);
            if (matrix.render === true) {

                timeAxisLayer.draw(matrix.a, matrix.e);
            }
            return matrix;
        };
    }

    function constrainMatrix(matrix) {

        console.log("a:%f, b:%f, c:%f, d:%f, e:%f, f:%f", matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
        console.log(self.height * matrix.a);
        var scaledHeight = self.height * matrix.a;
        if (matrix.a < 1) {

            matrix.render = false;
        }

        if (matrix.a > 128) {

            matrix.render = false;
        }


        if (scaledHeight + matrix.f < self.height) {

            matrix.f = - (scaledHeight - self.height);
        }

        if (matrix.f > 0) {

            matrix.f = 0;
        }

        return matrix;
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

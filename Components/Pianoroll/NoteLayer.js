/* exported NoteLayer */
function NoteLayer (mask, element, horizontalZoomBounds, svgParent) {

    "use strict";

    let offsetX = 0;
    let offsetY = 0;
    let zoomX = 1;
    let zoomY = 1;

    this.setSize = function() {


    };

    this.transform = function(matrix) {


    };


    this.pushNote = function(frequency, time, zoom) {

        console.log("%s %f %f", frequency, time, zoom);
    };
}

/* exported NoteLayer */
function NoteLayer (mask, element, horizontalZoomBounds, svgParent, noteAddedCallback, octaveBounds, defaultTimeRange) {

    "use strict";

    const maskParent = createSVGElement('defs');
    const clipPath = createSVGElement('clipPath');
    clipPath.id = "noteLayerMask";
    maskParent.appendChild(clipPath);
    const maskRectangle = createSVGElement('rect', {x:horizontalZoomBounds.offsetX + 1, y:horizontalZoomBounds.height, width:svgParent.clientWidth - horizontalZoomBounds.offsetX, height:svgParent.clientHeight - horizontalZoomBounds.height});
    clipPath.appendChild(maskRectangle);
    mask.appendChild(maskParent);

    mask.setAttribute('clip-path', 'url(#' + clipPath.id + ')');

    element.setAttribute('transform', 'translate(' + horizontalZoomBounds.offsetX + ', ' + horizontalZoomBounds.height + ')');

    const defaultGraphWidth = svgParent.clientWidth - horizontalZoomBounds.offsetX;
    const normalisedHeight = svgParent.clientHeight - horizontalZoomBounds.height;
    const normalisedOctaveSpacing = normalisedHeight / octaveBounds.normalisedVisible;
    const normalisedNoteHeight = normalisedOctaveSpacing / 12;
    const noteName = ['B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#', 'C'];
    const notePositions = {};


    for (let i = 0; i < octaveBounds.count; ++i) {

        for (let j = 0; j < 12; ++j) {

            notePositions[(noteName[j] + (octaveBounds.count - i - 1))] = (normalisedNoteHeight * 12 * i) + normalisedNoteHeight * j;
        }
    }
    let offsetX = 0;
    let offsetY = 0;
    let zoomX = 1;
    let zoomY = 1;

    this.setSize = function() {

        maskRectangle.setAttribute('height', svgParent.clientHeight - horizontalZoomBounds.height);
        maskRectangle.setAttribute('width', svgParent.clientWidth - horizontalZoomBounds.offsetX);
    };

    this.transform = function(matrix) {

        zoomX = matrix.a;
        zoomY = matrix.d;
        offsetX = matrix.e;
        offsetY = matrix.f;
        element.setAttribute('transform', "translate(" + (offsetX + horizontalZoomBounds.offsetX) + ", " + (offsetY + horizontalZoomBounds.height)  + ") scale(" + zoomX + "," + zoomY + ")");

    };

    function createNoteSVG(frequency, time) {

        const height = notePositions[frequency];
        const x = time * defaultGraphWidth;
        const noteRect = createSVGElement('rect', {x:x, y:height, width:normalisedNoteHeight, height:normalisedNoteHeight, 'vector-effect':'non-scaling-stroke', fill:'red'});
        noteRect.frequency = frequency;
        noteRect.time = time;
        noteRect.isNoteRect = true;
        element.appendChild(noteRect);
        console.log(height);
    }

    this.pushNote = function(frequency, time) {

        createNoteSVG(frequency, time);
        noteAddedCallback(frequency, time);
    };
}

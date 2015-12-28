/* exported FrequencyAxis */

function FrequencyAxis(mask, element, horizontalZoomBounds, svgParent, octaveBounds) {

    "use strict";

    const maskParent = createSVGElement('defs');
    const clipPath = createSVGElement('clipPath');
    clipPath.id = "frequencyRangeMask";
    maskParent.appendChild(clipPath);
    const maskRectangle = createSVGElement('rect', {x:0, y:horizontalZoomBounds.height, width:svgParent.clientWidth, height:svgParent.clientHeight - horizontalZoomBounds.height});
    clipPath.appendChild(maskRectangle);
    mask.appendChild(maskParent);

    mask.setAttribute('clip-path', 'url(#' + clipPath.id + ')');

    element.setAttribute('transform', 'translate(0, ' + horizontalZoomBounds.height + ')');


    const noteIsBlack = [false, true, false, true, false, true, false, false, true, false, true, false];
    const noteName = ['B', 'A#', 'A', 'G#', 'G', 'F#', 'F', 'E', 'D#', 'D', 'C#', 'C'];


    const defaultGraphWidth = svgParent.clientWidth - horizontalZoomBounds.offsetX;
    const normalisedHeight = svgParent.clientHeight - horizontalZoomBounds.height;
    const normalisedOctaveSpacing = normalisedHeight / octaveBounds.normalisedVisible;
    const noteAxisGroupOffsetX = horizontalZoomBounds.offsetX * 0.3;
    const normalisedNoteHeight = normalisedOctaveSpacing / 12;

    const freqAxisNoteTickGroup = createSVGElement('g');
    const freqAxisNoteTickLine = createSVGElement('line', {x1:noteAxisGroupOffsetX / 2, x2:noteAxisGroupOffsetX, y1:0, y2:0, 'vector-effect':'non-scaling-stroke'});
    freqAxisNoteTickGroup.appendChild(freqAxisNoteTickLine);
    const freqAxisNoteTickText = createSVGElement('text', {x:noteAxisGroupOffsetX / 3, y:-3, 'text-anchor':'right', 'font-family':'Helvetica', 'font-weight':'normal', 'font-size':10, fill:'black', stroke:'none'});
    freqAxisNoteTickGroup.appendChild(freqAxisNoteTickText);
    element.appendChild(freqAxisNoteTickGroup);

    const octaves = [];
    let offsetY = 0;
    let zoomY = 1;
    let widthZoom = 1;
    let activeNoteNumber = null;

    for (let i = 0; i < octaveBounds.count; ++i) {

        octaves.push(createOctave(i));
    }

    function createOctave(octaveNumber) {

        const octaveGroup = createSVGElement('g');

        const scalingGroup = createSVGElement('g', {transform:"scale(1, 1)",  'vector-effect':'non-scaling-stroke'});

        const noteAxisGroup = createSVGElement('g', {transform:"scale(1, 1)",  'vector-effect':'non-scaling-stroke'});

        const noteGraphGroup = createSVGElement('g', {transform:"translate(" + horizontalZoomBounds.offsetX + ", 0) scale(" + widthZoom + ", 1)",  'vector-effect':'non-scaling-stroke'});

        scalingGroup.appendChild(noteAxisGroup);
        scalingGroup.appendChild(noteGraphGroup);
        octaveGroup.appendChild(scalingGroup);

        for (let i = 0; i < 12; ++i) {

            const graphColour = noteIsBlack[i] ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0)';
            const axisColour = noteIsBlack[i] ? 'black' : 'white';

            const noteString = noteName[i] + (octaveBounds.count - octaveNumber - 1);

            const freqAxisRect = createSVGElement('rect', {width:horizontalZoomBounds.offsetX + 1 - noteAxisGroupOffsetX, height:normalisedNoteHeight, x:noteAxisGroupOffsetX,  y:normalisedNoteHeight * i, fill:axisColour, 'vector-effect':'non-scaling-stroke', 'stroke-alignment':'inside'});
            freqAxisRect.isAxisPoint = true;
            freqAxisRect.isNotePoint = true;
            freqAxisRect.noteString = noteString;

            const freqGraphRect = createSVGElement('rect', {width:svgParent.clientWidth - horizontalZoomBounds.offsetX, height:normalisedNoteHeight, y:normalisedNoteHeight * i, stroke:'rgba(0, 0, 0, 0.2)' , fill:graphColour, transform:'scale(1, 1)',  'vector-effect':'non-scaling-stroke', 'stroke-alignment':'inside'});
            freqGraphRect.isAxisPoint = false;
            freqGraphRect.isNotePoint = true;
            freqGraphRect.noteString = noteString;

            noteAxisGroup.appendChild(freqAxisRect);
            noteGraphGroup.appendChild(freqGraphRect);

            freqAxisRect.setActive = freqGraphRect.setActive = function () {

                freqAxisNoteTickGroup.setAttribute('transform', "translate(0, " + ((normalisedNoteHeight * (i + 1) + (octaveNumber * normalisedOctaveSpacing)) + ")"));
                freqAxisNoteTickText.innerHTML = noteString;
                activeNoteNumber = noteString;
            };
        }

        const octaveObject = {mainGroup:octaveGroup, scalingGroup:scalingGroup,  noteGraphGroup:noteGraphGroup};
        octaveGroup.setAttribute('transform', "translate(0, " + (octaveNumber * normalisedOctaveSpacing) + ")");
        element.appendChild(octaveGroup);

        return octaveObject;
    }

    function resizeMask(height, width) {

        maskRectangle.setAttribute('height', height);
        maskRectangle.setAttribute('width', width);
    }

    function setOctaveWidths() {

        let newGraphWidth = svgParent.clientWidth - horizontalZoomBounds.offsetX;

        widthZoom = newGraphWidth / defaultGraphWidth;

        for (let i = 0; i < octaves.length; ++i) {

            octaves[i].noteGraphGroup.setAttribute('transform', "translate(" + horizontalZoomBounds.offsetX + ",0) scale(" + widthZoom + ", 1)");
        }
    }

    this.rescale = function() {

        setOctaveWidths();
        resizeMask(svgParent.clientHeight - horizontalZoomBounds.height, svgParent.clientWidth);
        freqAxisNoteTickText.setAttribute('transform', "scale(1, " + (1/zoomY) + ")");
    };

    this.transform = function(matrix) {

        zoomY = matrix.d;
        offsetY = matrix.f;

        element.setAttribute('transform', "translate(0, " + (offsetY + horizontalZoomBounds.height)  + ") scale(1," + zoomY + ")");
        freqAxisNoteTickText.setAttribute('transform', "scale(1, " + (1/zoomY) + ")");
    };

    this.onMouseMove = function(position) {

        const noteElement = getNoteElement(position);

        if (typeof noteElement !== "undefined") {

            noteElement.setActive();
        }
    };

    function getNoteElement(position) {

        const rpos = svgParent.createSVGRect();
        rpos.x = position.x;
        rpos.y = position.y;
        rpos.width = rpos.height = 0;
        const list = svgParent.getIntersectionList(rpos, null);

        let noteElement = null;

        for (let i = 0; i < list.length; i++) {

            if (list[i].isHoverOver === true) {

                noteElement = list[i];
                return noteElement;
            }
        }

        for (let i = 0; i < list.length; i++) {

            if (list[i].isNotePoint === true) {

                noteElement = list[i];
                return noteElement;
            }
        }
    }

    this.getFrequencyPosition = function() {

        return activeNoteNumber;
    };
}

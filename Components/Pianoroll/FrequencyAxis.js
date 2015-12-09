/* exported FrequencyAxis */

function FrequencyAxis(frequencyAxisParent, element, horizontalZoomBounds, resizableDiv, octaveBounds) {

    "use strict";

    frequencyAxisParent.style.top = horizontalZoomBounds.height + 'px';
    frequencyAxisParent.style.height = 'calc(100% - ' + (horizontalZoomBounds.height + 1) + 'px)';

    const noteIsBlack = [false, true, false, true, false, true, false, false, true, false, true, false];
    const defaultGraphWidth = resizableDiv.width - horizontalZoomBounds.offsetX;
    const normalisedHeight = resizableDiv.height - horizontalZoomBounds.height;
    const normalisedOctaveSpacing = normalisedHeight / octaveBounds.normalisedVisible;
    const noteAxisGroupOffsetX = horizontalZoomBounds.offsetX * 0.3;

    let octaves = [];
    let offsetY = 0;
    let zoomY = 1;
    let widthZoom = 1;

    this.setSize = function() {

        const height = resizableDiv.height - horizontalZoomBounds.height;

        const octaveSpacing = normalisedOctaveSpacing * zoomY;
        const octaveCount = Math.ceil(height / octaveSpacing) + 1;
        const octavesAdjusted = adjustOctaveCount(octaveCount);
        setOctaveWidths();


        if (octavesAdjusted === true) {

            setOctavePositions(octaveSpacing);
            return true;
        }
        else {

            return false;
        }
    };

    this.rescale = function() {

        setOctaveWidths();
    };

    this.transform = function(matrix) {

        zoomY = matrix.d;
        offsetY = matrix.f;

        const height = resizableDiv.height - horizontalZoomBounds.height;

        const octaveSpacing = normalisedOctaveSpacing * zoomY;
        const octaveCount = Math.ceil(height / octaveSpacing) + 1;

        adjustOctaveCount(octaveCount);

        setOctavePositions(octaveSpacing);
    };

    function createOctave() {

        const octaveGroup = createSVGElement('g');

        const scalingGroup = createSVGElement('g', {transform:"scale(1, 1)",  'vector-effect':'non-scaling-stroke'});

        const noteAxisGroup = createSVGElement('g', {transform:"scale(1, 1)",  'vector-effect':'non-scaling-stroke'});

        const noteGraphGroup = createSVGElement('g', {transform:"translate(" + horizontalZoomBounds.offsetX + ", 0) scale(" + widthZoom + ", 1)",  'vector-effect':'non-scaling-stroke'});

        scalingGroup.appendChild(noteAxisGroup);
        scalingGroup.appendChild(noteGraphGroup);
        octaveGroup.appendChild(scalingGroup);

        const noteHeight = normalisedOctaveSpacing / 12;

        for (let i = 0; i < 12; ++i) {

            const graphColour = noteIsBlack[i] ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0)';
            const axisColour = noteIsBlack[i] ? 'black' : 'white';

            const freqAxisRect = createSVGElement('rect', {width:horizontalZoomBounds.offsetX + 1 - noteAxisGroupOffsetX, height:noteHeight, x:noteAxisGroupOffsetX,  y:noteHeight * i, fill:axisColour, 'vector-effect':'non-scaling-stroke'});

            const freqGraphRect = createSVGElement('rect', {width:resizableDiv.width - horizontalZoomBounds.offsetX, height:noteHeight, y:noteHeight * i, stroke:'rgba(0, 0, 0, 0.2)' , fill:graphColour, transform:'scale(1, 1)',  'vector-effect':'non-scaling-stroke'});

            noteAxisGroup.appendChild(freqAxisRect);
            noteGraphGroup.appendChild(freqGraphRect);
        }

        element.appendChild(octaveGroup);
        return {mainGroup:octaveGroup, scalingGroup:scalingGroup,  noteGraphGroup:noteGraphGroup};
    }

    function adjustOctaveCount(newOctaveCount) {

        let octaveCountAdjusted = false;
        const octaveCurrentCount = octaves.length;

        if (newOctaveCount > octaveCurrentCount) {

            for (let i = 0; i < newOctaveCount - octaveCurrentCount; ++i) {

                const octave = createOctave();
                octaves.push(octave);
            }

            octaveCountAdjusted = true;
        }
        else if (newOctaveCount < octaveCurrentCount && newOctaveCount > 0) {

            for (let i = 0; i < octaveCurrentCount - newOctaveCount; ++i) {

                element.removeChild(octaves[octaves.length - 1].mainGroup);
                octaves.pop();
            }

            octaveCountAdjusted = true;
        }

        return octaveCountAdjusted;
    }

    function setOctaveWidths() {

        let newGraphWidth = resizableDiv.width - horizontalZoomBounds.offsetX;

        widthZoom = newGraphWidth / defaultGraphWidth;

        for (let i = 0; i < octaves.length; ++i) {

            octaves[i].noteGraphGroup.setAttribute('transform', "translate(" + horizontalZoomBounds.offsetX + ",0) scale(" + widthZoom + ", 1)");
        }
    }

    function setOctavePositions(octaveSpacing) {

        let offsetModSpacing = offsetY % octaveSpacing;
        offsetModSpacing = (offsetModSpacing > 0) ? offsetModSpacing - octaveSpacing : offsetModSpacing;

        let firstOctaveY = (offsetY - offsetModSpacing);
        const octaveStart = firstOctaveY / octaveSpacing;

        for (let i = 0; i < octaves.length; ++i) {

            const octave = octaves[i];
            const octaveOffsetY = ((i - octaveStart) * octaveSpacing + offsetY);
            octave.scalingGroup.setAttribute('transform', "translate(0, " + octaveOffsetY + ") scale(1," + zoomY + ")");

            firstOctaveY -= octaveSpacing;
        }
    }
}

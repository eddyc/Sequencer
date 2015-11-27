var FrequencyAxis = function(frequencyAxisParent, element, horizontalZoomSize, resizableDivWidth, resizableDivHeight) {

    var frequencyAxisYOffset = horizontalZoomSize.height;
    var frequencyAxisNavHeight = horizontalZoomSize.height;
    frequencyAxisParent.style.top = frequencyAxisYOffset + 'px';
    frequencyAxisParent.style.height = 'calc(100% - ' + (frequencyAxisYOffset + 1) + 'px)';

    var height = resizableDivHeight - horizontalZoomSize.height;
    var width = resizableDivWidth;
    var freqGraphRectWidth = width - horizontalZoomSize.xOffset;
    var freqGraphRectZoom = 1;
    var octaves = [];
    var octaveCount = 3;
    var startOctaveSpacing = height / (octaveCount - 1);
    var octaveSpacing = startOctaveSpacing;

    var offsetY = 0;
    var zoomY = 1;

    var noteIsBlack = [false, true, false, true, false, true, false, false, true, false, true, false];

    function createOctave() {

        var octaveGroup = createSVGElement('g');
        var noteHeight = startOctaveSpacing / 12;
        var noteAxisGroup = createSVGElement('g', {transform:"scale(1, 1)",  'vector-effect':'non-scaling-stroke'});

        var noteGraphGroup = createSVGElement('g', {transform:"translate(" + horizontalZoomSize.xOffset + ", 0) scale(" + freqGraphRectZoom + ", 1)",  'vector-effect':'non-scaling-stroke'});

        octaveGroup.appendChild(noteAxisGroup);
        octaveGroup.appendChild(noteGraphGroup);

        for (var i = 0; i < 12; ++i) {

            var isBlack = noteIsBlack[i];

            var graphColour = isBlack ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0)';
            var axisColour = isBlack ? 'black' : 'white';

            var freqAxisRect = createSVGElement('rect', {width:horizontalZoomSize.xOffset + 1, height:noteHeight, x:0,  y:noteHeight * i, fill:axisColour, 'vector-effect':'non-scaling-stroke'});

            var freqGraphRect = createSVGElement('rect', {width:resizableDivWidth - horizontalZoomSize.xOffset, height:noteHeight, y:noteHeight * i, stroke:'rgba(0, 0, 0, 0.2)' , fill:graphColour, transform:'scale(1, 1)',  'vector-effect':'non-scaling-stroke'});

            noteAxisGroup.appendChild(freqAxisRect);
            noteGraphGroup.appendChild(freqGraphRect);
        }

        return {mainGroup:octaveGroup, noteGraphGroup:noteGraphGroup};
    }

    for (var i = 0; i < octaveCount; ++i) {

        var octave = createOctave();
        octave.mainGroup.setAttribute('transform', 'translate(0,' +  (i * octaveSpacing) + ')');
        octaves.push(octave);

        element.appendChild(octave.mainGroup);
    }

    this.onResize = function(resizableElement) {

        height = resizableElement.clientHeight - horizontalZoomSize.height;
        width = resizableElement.clientWidth;

        var newFreqGraphRectWidth = width - horizontalZoomSize.xOffset;

        freqGraphRectZoom = newFreqGraphRectWidth / freqGraphRectWidth;

        for (var i = 0; i < octaves.length; ++i) {

            octaves[i].noteGraphGroup.setAttribute('transform', "translate(" + horizontalZoomSize.xOffset + ",0) scale(" + freqGraphRectZoom + ", 1)");
        }


        octaveSpacing = startOctaveSpacing * zoomY;
        var newOctaveCount = Math.ceil(height / octaveSpacing) + 1;

        if (newOctaveCount != octaveCount) {

            adjustOctaveCount(newOctaveCount);
            redrawOctavePositions(octaveSpacing);
            octaveCount = newOctaveCount;
        }
    }

    function adjustOctaveCount(newOctaveCount) {

        if (newOctaveCount > octaveCount) {

            for (var i = 0; i < newOctaveCount - octaveCount; ++i) {
                var octave = createOctave();
                element.appendChild(octave.mainGroup);
                octaves.push(octave);
            }
        }
        else if (newOctaveCount < octaveCount && newOctaveCount > 0) {

            for (var i = 0; i < octaveCount - newOctaveCount; ++i) {

                element.removeChild(octaves[octaves.length - 1].mainGroup);
                octaves.pop();
            }
        }
    }

    this.transform = function(matrix) {

        zoomY = matrix.d;
        offsetY = matrix.f;

        octaveSpacing = startOctaveSpacing * zoomY;
        var newOctaveCount = Math.ceil(height / octaveSpacing) + 1;

        if (newOctaveCount != octaveCount) {

            adjustOctaveCount(newOctaveCount);
            octaveCount = newOctaveCount;
        }

        redrawOctavePositions(octaveSpacing);
    };

    function redrawOctavePositions(octaveSpacing) {

        var offsetModSpacing = offsetY % octaveSpacing;
        offsetModSpacing = (offsetModSpacing >= 0) ? offsetModSpacing - octaveSpacing : offsetModSpacing;

        var firstOctaveY = (offsetY - offsetModSpacing);
        var octaveStart = firstOctaveY / octaveSpacing;

        for (var i = 0; i < octaves.length; ++i) {

            var octave = octaves[i];
            var octaveOffsetY = ((i - octaveStart) * octaveSpacing + offsetY);
            var tickOffsetX = (-firstOctaveY + offsetY);
            octave.mainGroup.setAttribute('transform', "translate(0, " + octaveOffsetY + ") scale(1," + zoomY + ")");

            firstOctaveY -= octaveSpacing;
        }


    }
};

/* exported TimeAxis */
function TimeAxis(mask, element, horizontalZoomBounds, svgParent, defaultTimeSignature, defaultTimeRange) {

    "use strict";

    const maskParent = createSVGElement('defs');
    const clipPath = createSVGElement('clipPath');
    clipPath.id = "timeRangeMask";
    maskParent.appendChild(clipPath);
    const maskRectangle = createSVGElement('rect', {x:horizontalZoomBounds.offsetX, y:0, width:svgParent.clientWidth - horizontalZoomBounds.offsetX, height:svgParent.clientHeight});
    clipPath.appendChild(maskRectangle);
    mask.appendChild(maskParent);

    mask.setAttribute('clip-path', 'url(#' + clipPath.id + ')');

    element.setAttribute('transform', 'translate(' + horizontalZoomBounds.offsetX + ', 0)');

    const axisLineHeight = 10;
    const axisLineY = horizontalZoomBounds.height - axisLineHeight;
    const axisLine = createSVGElement('rect', {height:axisLineHeight, y:axisLineY, fill:'black'});
    element.appendChild(axisLine);
    const normalisedTimeWidth = svgParent.clientWidth - horizontalZoomBounds.offsetX;
    const unityZoomTickWidth = normalisedTimeWidth / (defaultTimeRange.end.totalSixteenths - defaultTimeRange.start.totalSixteenths);

    let offsetX = 0;
    let zoomX = 1;

    let timeSignature = defaultTimeSignature;
    const ticks = [];

    this.setTimeProperties = function(timeSignatureIn) {

        timeSignature = timeSignatureIn;

        const quantisedZoom = getQuantisedZoom();
        const tickSpacing = getTickSpacing(quantisedZoom);
        setTickPositions(tickSpacing, quantisedZoom);
    };


    this.setSize = function() {

        const width = svgParent.clientWidth - horizontalZoomBounds.offsetX;
        axisLine.setAttribute('width', width);

        const calculated = calculateTickCount();

        const ticksAdjusted = adjustTickCount(calculated.tickCount);
        setTickHeights();
        setMaskSize();

        if (ticksAdjusted) {

            setTickPositions(calculated.tickSpacing, calculated.quantisedZoom);
        }

    };

    this.transform = function(matrix) {

        zoomX = matrix.a;
        offsetX = matrix.e;

        const calculated = calculateTickCount();

        adjustTickCount(calculated.tickCount);

        setTickPositions(calculated.tickSpacing, calculated.quantisedZoom);
    };

    function getQuantisedZoom() {

        const quantisedZoom = (Math.pow(2, Math.floor(Math.log(zoomX)/Math.log(2))));
        return quantisedZoom;
    }


    function getTickSpacing(quantisedZoom) {

        const tickSpacing = (unityZoomTickWidth / quantisedZoom) * zoomX;
        return tickSpacing;
    }

    function calculateTickCount() {

        const width = svgParent.clientWidth - horizontalZoomBounds.offsetX;
        const quantisedZoom = getQuantisedZoom();
        const tickSpacing = getTickSpacing(quantisedZoom);
        const tickCount = Math.ceil(width / tickSpacing) + 1;
        return {tickCount:tickCount, quantisedZoom:quantisedZoom, tickSpacing:tickSpacing};
    }

    function createTick() {

        const height = svgParent.clientHeight;
        const tickGroup = createSVGElement('g');
        const line = createSVGElement('line', {x1:0, x2:0, y2:height, 'vector-effect':'inherit'});
        const text = createSVGElement('text', {y:17, x:2, 'text-anchor':'right', 'font-family':'Helvetica', 'font-weight':'normal', 'font-size':11, fill:'black', stroke:'none'});

        tickGroup.appendChild(line);
        tickGroup.appendChild(text);
        element.appendChild(tickGroup);

        return {group:tickGroup, text:text, line:line};
    }

    function adjustTickCount(newTicksCount) {

        let tickCountAdjusted = false;
        const ticksCurrentCount = ticks.length;

        if (newTicksCount > ticksCurrentCount) {


            for (let i = 0; i < newTicksCount - ticksCurrentCount; ++i) {

                const tick = createTick();
                ticks.push(tick);
            }

            tickCountAdjusted = true;
        }
        else if (newTicksCount < ticksCurrentCount && newTicksCount > 0) {

            for (let i = 0; i < ticksCurrentCount - newTicksCount; ++i) {

                element.removeChild(ticks[ticks.length - 1].group);
                ticks.pop();
            }

            tickCountAdjusted = true;
        }

        return tickCountAdjusted;
    }

    function setTickHeights() {

        for (let tick of ticks) {

            tick.line.setAttribute('y2', svgParent.clientHeight);
        }
    }

    function setMaskSize() {

        maskRectangle.setAttribute('width', svgParent.clientWidth - horizontalZoomBounds.offsetX);
        maskRectangle.setAttribute('height', svgParent.clientHeight);
    }

    function getTickNumbers(sixteenthIndex) {

        const sixteenthsPerBeat = (16 / timeSignature.denominator);
        const sixteenthsPerBar = sixteenthsPerBeat * timeSignature.numerator;

        const bar = Math.floor(sixteenthIndex / sixteenthsPerBar);
        sixteenthIndex -= bar * sixteenthsPerBar;
        const beat = Math.floor(sixteenthIndex / sixteenthsPerBeat);
        sixteenthIndex -= beat * sixteenthsPerBeat;

        return {bar:bar, beat:beat, sixteenth:sixteenthIndex};
    }

    function setTickBar(tick) {

        tick.line.setAttribute('y1', horizontalZoomBounds.height * 0.4);
        tick.line.setAttribute('stroke-dasharray', "0");
        tick.line.setAttribute('stroke', "black");
    }

    function setTickBeat(tick) {

        tick.line.setAttribute('y1', horizontalZoomBounds.height * 0.5);
        tick.line.setAttribute('stroke-dasharray', "0");
        tick.line.setAttribute('stroke', "rgba(0, 0, 0, 0.5)");

    }

    function setTickSixteenth(tick) {

        tick.line.setAttribute('y1', horizontalZoomBounds.height * 0.6);
        tick.line.setAttribute('stroke-dasharray', "0");
        tick.line.setAttribute('stroke', "rgba(0, 0, 0, 0.25)");

    }

    function setTickMinor(tick) {

        tick.line.setAttribute('y1', horizontalZoomBounds.height);
        tick.line.setAttribute('stroke-dasharray', "1, 1");
        tick.line.setAttribute('stroke', "rgba(0, 0, 0, 0.25)");
    }

    function formatTick(tick, tickIndex, tick16thIndex, quantisedZoom) {

        const tickNumbers = getTickNumbers(tick16thIndex);

        if (tickNumbers.sixteenth !== Math.floor(tickNumbers.sixteenth)) {

            setTickMinor(tick);
            tick.text.innerHTML = "";
            return;
        }

        let renderLabel = false;
        const modulus = 2 / quantisedZoom;

        if (tick16thIndex % modulus === 0) {

            renderLabel = true;
        }

        if (tickNumbers.beat === 0 && tickNumbers.sixteenth === 0) {

            setTickBar(tick);

            if (renderLabel === true) {

                tick.text.innerHTML = "" + tickNumbers.bar;
            }
        }
        else if (tickNumbers.sixteenth === 0) {

            setTickBeat(tick);

            if (renderLabel === true) {

                tick.text.innerHTML = "" + tickNumbers.bar + "." + tickNumbers.beat;
            }
        }
        else {

            setTickSixteenth(tick);

            if (renderLabel === true) {

                tick.text.innerHTML = "" + tickNumbers.bar + "." + tickNumbers.beat + "." + tickNumbers.sixteenth;
            }
        }

        if (renderLabel === false) {

            tick.text.innerHTML = "";
        }
    }


    function setTickPositions(tickSpacing, quantisedZoom) {

        let offsetModSpacing = offsetX % tickSpacing;
        let firstTickX = (offsetX - offsetModSpacing);
        const tickStart = Math.round(firstTickX / tickSpacing);
        ticks.forEach(function(tick, i) {

            const tickOffsetX = (-firstTickX + offsetX);

            tick.group.setAttribute('transform', "translate(" + tickOffsetX + ", 0)");
            const tickIndex = (-tickStart + i);
            const tick16thIndex = tickIndex / quantisedZoom;
            formatTick(tick, tickIndex, tick16thIndex, quantisedZoom);

            firstTickX -= tickSpacing;
        });
    }

    this.onMouseMove = function(position) {

        const positionX = position.x - horizontalZoomBounds.offsetX;
        const width = normalisedTimeWidth * zoomX;
        const time = (-offsetX + positionX) / width;

        return time;
    };

    this.getTimePosition = function(position) {

        return this.onMouseMove(position);
    };

    this.getZoomLevel = function() {

        return getQuantisedZoom();
    };
}

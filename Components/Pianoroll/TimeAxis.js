/* exported TimeAxis */

function TimeAxis(timeAxisParent, element, horizontalZoomBounds, resizableDiv) {

    "use strict";
    timeAxisParent.style.left = horizontalZoomBounds.offsetX + 'px';
    timeAxisParent.style.width = 'calc(100% - ' + (horizontalZoomBounds.offsetX + 1) + 'px)';

    const axisLineHeight = 10;
    const axisLineY = horizontalZoomBounds.height - axisLineHeight;
    const axisLine = createSVGElement('rect', {height:axisLineHeight, y:axisLineY, fill:'black'});
    element.appendChild(axisLine);


    const ticks = [];
    const unityZoomTickWidth = (resizableDiv.width - horizontalZoomBounds.offsetX) / 16;

    const defaultTimeSignature = {numerator:4, denominator:4};
    const defaultStartTime = {bars:0, beats:0, sixteenths:0, totalSixteenths:0};
    const defaultEndTime = {bars:1, beats:0, sixteenths:0, totalSixteenths:16};

    let offsetX = 0;
    let zoomX = 1;


    let timeSignature = defaultTimeSignature;
    let startTime = defaultStartTime;
    let endTime = defaultEndTime;

    this.setTimeProperties = function(timeSignatureIn, startTimeIn, endTimeIn) {

        timeSignature = timeSignatureIn;
        startTime = startTimeIn;
        endTime = endTimeIn;

        const quantisedZoom = getQuantisedZoom();
        const tickSpacing = getTickSpacing(quantisedZoom);
        setTickPositions(tickSpacing, quantisedZoom);
    };


    this.setSize = function() {

        const width = resizableDiv.width - horizontalZoomBounds.offsetX;
        axisLine.setAttribute('width', width);

        const calculated = calculateTickCount();

        const ticksAdjusted = adjustTickCount(calculated.tickCount);
        setTickHeights();

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

        const width = resizableDiv.width - horizontalZoomBounds.offsetX;
        const quantisedZoom = getQuantisedZoom();
        const tickSpacing = getTickSpacing(quantisedZoom);
        const tickCount = Math.ceil(width / tickSpacing) + 1;
        return {tickCount:tickCount, quantisedZoom:quantisedZoom, tickSpacing:tickSpacing};
    }

    function createTick() {

        const height = resizableDiv.height;
        const tickGroup = createSVGElement('g');
        const line = createSVGElement('line', {x1:0, x2:0, y2:height, 'vector-effect':'inherit'});
        const text = createSVGElement('text', {y:17, x:2, 'text-anchor':'right', 'font-family':'Verdana', 'font-size':10, fill:'black'});

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

            tick.line.setAttribute('y2', resizableDiv.height);
        }
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

        tick.line.setAttribute('y1', 0);
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
        offsetModSpacing = (offsetModSpacing >= 0) ? offsetModSpacing - tickSpacing : offsetModSpacing;
        let firstTickX = (offsetX - offsetModSpacing);
        const tickStart = Math.floor(offsetX / tickSpacing);

        ticks.forEach(function(tick, i) {

            const tickOffsetX = (-firstTickX + offsetX);
            tick.group.setAttribute('transform', "translate(" + tickOffsetX + ", 0)");
            const tickIndex = (-tickStart + i - 1);
            const tick16thIndex = tickIndex / quantisedZoom;
            formatTick(tick, tickIndex, tick16thIndex, quantisedZoom);

            firstTickX -= tickSpacing;
        });
    }
}

var TimeAxis = function(timeAxisParent, element, horizontalZoomSize, resizableDivWidth, resizableDivHeight) {

    var timeAxisXOffset = horizontalZoomSize.xOffset;
    var timeAxisNavHeight = horizontalZoomSize.height;
    timeAxisParent.style.position = 'absolute';
    timeAxisParent.style.top = '-1px';
    timeAxisParent.style.left = timeAxisXOffset + 'px';
    timeAxisParent.style.width = 'calc(100% - ' + (timeAxisXOffset + 1) + 'px)';
    timeAxisParent.style.height = '100%';

    var width = resizableDivWidth - timeAxisXOffset;
    var height = resizableDivHeight;
    var visibleoffsetX = 0;
    var quantisedZoom = 1;
    var ticks = [];
    var tickCount = 4;
    var minorTickCount = 3;
    var startTickSpacing = width / tickCount;
    var startMinorTickSpacing = startTickSpacing / (minorTickCount + 1);

    var offsetX = 0;
    var zoomX = 1;
    var quantisedZoom = 1;

    var rectangle = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rectangleHeight = 10;
    rectangleY = timeAxisNavHeight - rectangleHeight;
    rectangle.setAttribute('width', width);
    rectangle.setAttribute('height',rectangleHeight);
    rectangle.setAttribute('y',rectangleY);
    rectangle.setAttribute('fill', 'black');
    element.appendChild(rectangle);


    var tickY1 = timeAxisNavHeight / 2;

    for (var i = 0; i < tickCount; i++) {

        var tick = createTick();
        tick.text.innerHTML = i;
        tick.group.setAttribute('transform', "translate(" + (i * startTickSpacing) + ", 0)");

        for (var j = 0; j < minorTickCount; j++) {

            tick.minorTicks[j].setAttribute('transform', "translate(" + (j * startMinorTickSpacing + startMinorTickSpacing) + ", 0)");
        }

        element.appendChild(tick.group);
        ticks.push(tick);
    }


    function createTick() {

        function createMinorTicks(group) {

            var minorTicks = [];
            for (var i = 0; i < minorTickCount; i++) {

                var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
                line.setAttribute('y1', tickY1 + 5);
                line.setAttribute('y2', height);
                line.setAttribute('vector-effect', 'inherit');
                line.setAttribute('stroke', 'rgba(0, 0, 0, 0.3)');
                group.appendChild(line);
                minorTicks.push(line);
            }
            return minorTicks;
        }

        var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute('y1', tickY1);
        line.setAttribute('y2', height);
        line.setAttribute('vector-effect', 'inherit');
        line.setAttribute('fill', 'black');

        element.appendChild(line);

        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        text.setAttribute('y', 17);
        text.setAttribute('x', 2);
        text.setAttribute('text-anchor', 'right');
        text.setAttribute('font-family', 'Verdana');
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', 'black');
        group.appendChild(line);
        group.appendChild(text);
        var minorTicks = createMinorTicks(group);
        return {group:group, text:text, line:line, minorTicks:minorTicks};
    }

    this.onResize = function(resizableElement) {

        width = resizableElement.clientWidth - timeAxisXOffset;
        height = resizableElement.clientHeight;

        rectangle.setAttribute('width', width);

        for (var i = 0; i < tickCount; i++) {

            ticks[i].line.setAttribute('y2', height);

            for (var j = 0; j < minorTickCount; ++j) {

                ticks[i].minorTicks[j].setAttribute('y2', height);
            }
        }

        var tickSpacing = getTickSpacing(zoomX);
        var newTickCount = Math.ceil(width / tickSpacing) + 1;

        if (newTickCount != tickCount) {

            adjustTickCount(newTickCount);
            redrawTickPositions(tickSpacing);
            tickCount = newTickCount;
        }
    };

    function adjustTickCount(newTickCount) {

        if (newTickCount > tickCount) {

            for (var i = 0; i < newTickCount - tickCount; i++) {

                var tick = createTick();
                element.appendChild(tick.group);
                ticks.push(tick);
            }
        }
        else if (newTickCount < tickCount && newTickCount > 0) {

            for (var i = 0; i < tickCount - newTickCount; i++) {

                element.removeChild(ticks[ticks.length - 1].group);
                ticks.pop();
            }
        }
    }


    function getTickSpacing(zoomX) {

        var newQuantisedZoom = (Math.pow(2, Math.floor(Math.log(zoomX)/Math.log(2))));

        if (newQuantisedZoom != quantisedZoom) {

            quantisedZoom = newQuantisedZoom;
        }

        var tickSpacing = (startTickSpacing / quantisedZoom) * zoomX;
        return tickSpacing;
    }


    this.transform = function(matrix) {

        zoomX = matrix.a;
        offsetX = matrix.e;

        var tickSpacing = getTickSpacing(zoomX);
        var newTickCount = Math.ceil(width / tickSpacing) + 1;

        if (newTickCount != tickCount) {

            adjustTickCount(newTickCount);
            tickCount = newTickCount;
        }

        redrawTickPositions(tickSpacing);
    }


    function redrawTickPositions(tickSpacing) {

        var offsetModSpacing = offsetX % tickSpacing;
        offsetModSpacing = (offsetModSpacing >= 0) ? offsetModSpacing - tickSpacing : offsetModSpacing;
        var firstTickX = (offsetX - offsetModSpacing);
        var tickStart = firstTickX / tickSpacing;
        var minorTickSpacing = tickSpacing / (minorTickCount + 1);

        for (var i = 0; i < ticks.length; ++i) {

            var tick = ticks[i];
            var tickOffsetX = ((i - tickStart) * tickSpacing + offsetX);
            tick.group.setAttribute('transform', "translate(" + tickOffsetX + ", 0)");

            for (var j = 0; j < minorTickCount; ++j) {

                tick.minorTicks[j].setAttribute('transform', "translate(" + (minorTickSpacing * (j + 1)) + ", 0)");
            }

            var tickText = Math.round(((i - tickStart) / quantisedZoom) * 1000000) / 1000000;
            tick.text.innerHTML = tickText;
        }
    }


};

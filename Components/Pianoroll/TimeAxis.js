var TimeAxis = function(svgParent, element, width, height) {

    var visibleOffsetY = 0;
    var quantisedZoom = 1;
    var ticks = [];
    var tickCount = 9;
    var startTickspacing = width / (tickCount - 1);
    var tickSpacing = startTickspacing;
    var tickHeight = 20;

    var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line.setAttribute('y1', tickHeight + 5);
    line.setAttribute('y2', tickHeight + 5);
    line.setAttribute('x1', 0);
    line.setAttribute('x2', width);
    element.appendChild(line);

    var rectangle = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rectangle.setAttribute('width', width);
    rectangle.setAttribute('height', 20);
    rectangle.setAttribute('fill', 'black');
    element.appendChild(rectangle);
    for (var i = 0; i < tickCount; i++) {

        var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
        var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute('y1', tickHeight);
        line.setAttribute('y2', height);
        line.setAttribute('vector-effect', 'inherit');
        element.appendChild(line);

        var text = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        text.setAttribute('y', 17);
        text.setAttribute('x', 2);
        text.setAttribute('text-anchor', 'right');
        text.setAttribute('font-family', 'Verdana');
        text.setAttribute('font-size', '10');
        text.setAttribute('fill', 'black');
        text.innerHTML = i;
        group.setAttribute('transform', "translate(" + (i * tickSpacing) + ", 0)")
        group.appendChild(line);
        group.appendChild(text);
        element.appendChild(group);
        ticks.push(group);
    }
    //


    this.transform = function(matrix) {

        if (matrix.render === true) {

            // var transform = svgParent.createSVGTransformFromMatrix(matrix);
            // element.transform.baseVal.initialize(transform);

            for (var i = 0; i < ticks.length; ++i) {

                var group = ticks[i];
                group.setAttribute('transform', "translate(" + (i * tickSpacing * matrix.a + matrix.e) + ", 0)")
                // console.log("%f", i * tickSpacing - visibleOffsetY);
            }
            // draw(matrix.a, matrix.e);
        }
    }


    var visibleOffsetY = 0;
    var quantisedZoom = 1;

    function draw(zoomX, offsetY) {

        var scaledOffset = offsetY / zoomX;

        var modOffset = scaledOffset % tickSpacing;
        var quantisedOffset = scaledOffset - modOffset;

        if (quantisedOffset != visibleOffsetY) {

            visibleOffsetY = quantisedOffset;
            changeTickPositions();
            console.log("offset:%f", visibleOffsetY);
        }

        var newQuantisedZoom = (Math.pow(2, Math.floor(Math.log(zoomX)/Math.log(2))));

        if (newQuantisedZoom != quantisedZoom) {

            quantisedZoom = newQuantisedZoom;
            tickSpacing = startTickspacing / quantisedZoom;
            changeTickPositions();
        }

        function changeTickPositions() {

            for (var i = 0; i < ticks.length; ++i) {

                var tick = ticks[i];
                tick.line.setAttribute('x1', i * tickSpacing * zoomX - quantisedOffset);
                tick.line.setAttribute('x2', i * tickSpacing * zoomX - quantisedOffset);

                // console.log("%f", i * tickSpacing - visibleOffsetY);
            }
        }

    };

};

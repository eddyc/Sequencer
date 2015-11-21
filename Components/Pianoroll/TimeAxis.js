var TimeAxis = function(svgParent, element, width, height) {

    var visibleOffsetY = 0;
    var quantisedZoom = 1;
    var ticks = [];
    var tickCount = 9;
    var startTickSpacing = width / (tickCount - 1);
    var tickSpacing = startTickSpacing;
    var tickHeight = 20;

    // var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    // line.setAttribute('y1', tickHeight + 5);
    // line.setAttribute('y2', tickHeight + 5);
    // line.setAttribute('x1', 0);
    // line.setAttribute('x2', width);
    // element.appendChild(line);

    var rectangle = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    rectangle.setAttribute('width', width);
    rectangle.setAttribute('height', 10);
    rectangle.setAttribute('y', 25);
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
        ticks.push({group:group, text:text});
    }
    //

    var visibleOffsetY = 0;
    var quantisedZoom = 1;

    this.transform = function(matrix) {

        var zoomX = matrix.a;
        var offsetY = matrix.e;
        
        var scaledOffset = offsetY / zoomX;

        var modOffset = scaledOffset % tickSpacing;
        var quantisedOffset = scaledOffset - modOffset;

        if (quantisedOffset != visibleOffsetY) {

            visibleOffsetY = quantisedOffset;
            // console.log("offset:%f", visibleOffsetY);
            // console.log("offset:%f", offsetY);
        }

        var newQuantisedZoom = (Math.pow(2, Math.floor(Math.log(zoomX)/Math.log(2))));

        if (newQuantisedZoom != quantisedZoom) {

            quantisedZoom = newQuantisedZoom;
        }

        tickSpacing = (startTickSpacing / quantisedZoom) * zoomX;
        tickStart = (offsetY - (offsetY % tickSpacing)) / tickSpacing;
        console.log(tickStart);

        for (var i = 0; i < ticks.length; ++i) {

            var tick = ticks[i];
            tick.group.setAttribute('transform', "translate(" + ((i - tickStart) * tickSpacing + offsetY) + ", 0)")
            var tickText = Math.round(((i - tickStart) / quantisedZoom) * 1000000) / 1000000;
            tick.text.innerHTML = tickText;
        }
    }



    function draw(zoomX, offsetY) {



    };

};

var TimeAxisLayer = function(width, height, viewport) {

    var visibleOffsetY = 0;
    var quantisedZoom = 1;
    var lines = [];
    var lineCount = 9;
    var lineSpacing = 0;
    var startLineSpaceing;


    startLineSpacing = width / (lineCount - 1);
    lineSpacing = startLineSpacing;

    for (var i = 0; i < lineCount; i++) {

        var line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
        line.setAttribute('x1', i * lineSpacing);
        line.setAttribute('y1', 0);
        line.setAttribute('x2', i * lineSpacing);
        line.setAttribute('y2', height);
        line.setAttribute('vector-effect', 'inherit');
        viewport.appendChild(line);
        lines.push(line);
    }

    svgNavigation.receivedInteraction = function(matrix) {

        console.log(matrix);
        draw(matrix.a, matrix.e);
        return matrix;
    };

    this.draw = function(zoomX, offsetY) {

        var scaledOffset = offsetY / zoomX;

        var modOffset = scaledOffset % lineSpacing;
        var quantisedOffset = scaledOffset - modOffset;

        if (quantisedOffset != visibleOffsetY) {

            visibleOffsetY = quantisedOffset;
            changeLinePositions();
            console.log("offset:%f", visibleOffsetY);
        }

        var newQuantisedZoom = (Math.pow(2, Math.floor(Math.log(zoomX)/Math.log(2))));

        if (newQuantisedZoom != quantisedZoom) {

            quantisedZoom = newQuantisedZoom;
            lineSpacing = startLineSpacing / quantisedZoom;
            changeLinePositions();
        }

        function changeLinePositions() {

            console.log("drawing:")
            for (var i = 0; i < lines.length; ++i) {

                var line = lines[i];
                line.setAttribute('x1', i * lineSpacing - quantisedOffset);
                line.setAttribute('x2', i * lineSpacing - quantisedOffset);
            }
        }
    }
};

var NoteArea = function(svgParent, element, width, height) {

    var rectangle = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    var rectWidth = width / 8;
    var rectHeight = 100;
    var rectX = width / 8;
    var rectY = 100;
    rectangle.setAttribute('width', width / 8);
    rectangle.setAttribute('height',rectHeight);
    rectangle.setAttribute('x', rectX);
    rectangle.setAttribute('y', rectY);
    rectangle.setAttribute('fill', 'black');

    rectangle.setAttribute('transform', "translate(0, 0)" )
    rectangle.setAttribute('vector-effect', 'inherit');
    element.appendChild(rectangle);

    this.transform = function(matrix) {

        var transform = svgParent.createSVGTransformFromMatrix(matrix);
        element.transform.baseVal.initialize(transform);
        // var zoomX = matrix.a;
        // var zoomY = matrix.d;
        // var offsetY = matrix.e;
        // var offsetX = matrix.f;
        //
        // rectangle.setAttribute('width', rectWidth * zoomX);
        // rectangle.setAttribute('height', rectHeight * zoomY);
        // rectangle.setAttribute('x', rectX * zoomX + offsetY);
        // rectangle.setAttribute('y', rectY * zoomY + offsetX);



    }
};

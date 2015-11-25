var NoteArea = function(noteAreaParent, element, noteAreaSize) {

    noteAreaParent.style.position = 'absolute';
    noteAreaParent.style.top = noteAreaSize.yOffset + 'px';
    noteAreaParent.style.left = noteAreaSize.xOffset + 'px';
    noteAreaParent.style.width = 'calc(100% - ' + (noteAreaSize.xOffset + 1) + 'px)';
    noteAreaParent.style.height = 'calc(100% - ' + (noteAreaSize.yOffset + 1) + 'px)';

    var rectangle = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    var rectWidth =  80;
    var rectHeight = 80;
    var rectX =  100;
    var rectY = 100;
    rectangle.setAttribute('width', rectWidth);
    rectangle.setAttribute('height',rectHeight);
    rectangle.setAttribute('x', rectX);
    rectangle.setAttribute('y', rectY);
    rectangle.setAttribute('fill', 'black');

    rectangle.setAttribute('transform', "translate(0, 0)" )
    rectangle.setAttribute('vector-effect', 'inherit');
    element.appendChild(rectangle);

    this.transform = function(matrix) {

        var transform = noteAreaParent.createSVGTransformFromMatrix(matrix);
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

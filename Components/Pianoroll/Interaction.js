var Interaction = function(interactionParent, width, height, horizontalZoomSize, noteAreaSize, interactionCallback) {

    interactionParent.style.position = 'absolute';
    interactionParent.style.width = '100%';
    interactionParent.style.height = '100%';

    var transformState = document.createElementNS("http://www.w3.org/2000/svg", 'g');
    interactionParent.appendChild(transformState);

    var timeNavigationRect = createInteractionRectangle(horizontalZoomSize.xOffset, 0, width - horizontalZoomSize.xOffset, horizontalZoomSize.height, 'rgba(62, 227, 255, 0.26)')
    var noteNavigationRect = createInteractionRectangle(horizontalZoomSize.xOffset, horizontalZoomSize.height, width - horizontalZoomSize.xOffset, height - horizontalZoomSize.height, 'rgba(2, 27, 255, 0.26)')

    timeNavigationRect.addEventListener('wheel', onWheel);
    noteNavigationRect.addEventListener('wheel', onWheel);

    this.onResize = function(resizableElement) {

        var newWidth = resizableElement.clientWidth - horizontalZoomSize.xOffset;
        var noteNavigationHeight = resizableElement.clientHeight - horizontalZoomSize.height;
        timeNavigationRect.setAttribute('width', newWidth);
        noteNavigationRect.setAttribute('width', newWidth);
        noteNavigationRect.setAttribute('height', noteNavigationHeight);


    };

    function createInteractionRectangle(x, y, rectWidth, rectHeight, colour) {

        var rectangle = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        rectangle.setAttribute('width', rectWidth);
        rectangle.setAttribute('height', rectHeight);
        rectangle.setAttribute('x', x);
        rectangle.setAttribute('y', y);
        rectangle.setAttribute('fill', colour);
        interactionParent.appendChild(rectangle);
        return rectangle;
    };

    function mousePosition(element, event) {

        var offsetX = event.offsetX || event.layerX || 0;
        var offsetY = event.offsetY || event.layerY || 0;
        var position = {x: offsetX, y: offsetY};

        return position;
    };


    function onWheel(event) {

        var matrix = transformState.getCTM();
        var destination = interactionParent.createSVGPoint();

        if (event.currentTarget === timeNavigationRect) {

            var temp = mousePosition(timeNavigationRect, event);
            destination.x = temp.x - horizontalZoomSize.xOffset;
            destination.y = temp.y;
            var focus = destination.matrixTransform(matrix.inverse());

            var zoomFactor = Math.pow(1.1, event.wheelDeltaY / 56);
            var d = matrix.d;
            var f = matrix.f;

            matrix = matrix.scale(zoomFactor);

            focus.x -= (event.wheelDeltaX / 4) / matrix.a;
            matrix.d = d;
            matrix.f = f;

            pan(destination, focus, matrix)
        }
        else if (event.currentTarget === noteNavigationRect) {

            var temp = mousePosition(interactionParent, event);
            destination.x = temp.x;
            destination.y = temp.y;
            var focus = destination.matrixTransform(matrix.inverse());
            focus.x -= (event.wheelDeltaX / 4) / matrix.a;
            focus.y -= (event.wheelDeltaY / 4) / matrix.d;

            pan(destination, focus, matrix)
        }


    };

    function pan(destination, origin, matrix) {

        var beta = (matrix.a * (destination.y - matrix.d * origin.y - matrix.f) - matrix.b * (destination.x - matrix.c * origin.y - matrix.e)) / (matrix.a * matrix.d - matrix.b * matrix.c);
        var alpha = (destination.x - matrix.a * origin.x - matrix.c * origin.y - matrix.e - matrix.c * beta) / matrix.a;

        matrix = matrix.translate(alpha, beta);

        interactionCallback(matrix);
        var transform = interactionParent.createSVGTransformFromMatrix(matrix);

        transformState.transform.baseVal.initialize(transform);
    }

}

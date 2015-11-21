var SVGNavigation = function(svgParent, element, width, height, interactionCallback) {

    var self = this;
    var mouseDown = false;
    var panstart;
    self.interactionCallback = interactionCallback;

    svgParent.addEventListener('mousedown', onMouseDown);
    svgParent.addEventListener('mouseup', onMouseUp);
    svgParent.addEventListener('mousewheel', onMouseWheel);

    function onMouseDown(e) {

        if (e.button === 0) {

            element.setAttribute('stroke','red');
            mouseDown = true;
            panStart = svgParent.createSVGPoint();
            var temp = mousePosRelElement(svgParent, e);

            panStart.x = temp.x;
            panStart.y = temp.y;
            panStart = panStart.matrixTransform(element.getCTM().inverse());
            svgParent.addEventListener('mousemove', onMouseMove);
        }
    };

    function mousePosRelElement(elem, e) {

        var offsetX = e.offsetX || e.layerX || 0;
        var offsetY = e.offsetY || e.layer || 0;
        var loc = {x: offsetX, y: offsetY};

        return loc;
    };

    function onMouseUp(e) {

        if (mouseDown === true) {

            mouseDown = false;
            element.setAttribute('stroke','black');
            removeEventListener('mousemove', onMouseMove);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    };

    function onMouseMove(e) {

        if (mouseDown === true) {

            var matrix = element.getCTM();
            var destination = mousePosRelElement(svgParent, e);
            pan(destination, panStart, matrix);

            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    };

    function onMouseWheel (e) {

        var zoomFactor = Math.pow(1.1, e.wheelDeltaY / 56);
        var matrix = element.getCTM();
        var temp = mousePosRelElement(svgParent, e);
        var destination = svgParent.createSVGPoint();
        destination.x = temp.x;
        destination.y = temp.y;
        var focus = destination.matrixTransform(matrix.inverse());
        matrix = matrix.scale(zoomFactor);
        // matrix.d = 1;
        pan(destination, focus,  matrix);
        e.preventDefault();
        e.stopPropagation();
        return false;
    };

    function pan(destination, origin, matrix) {

        var beta = (matrix.a * (destination.y - matrix.d * origin.y - matrix.f) - matrix.b * (destination.x - matrix.c * origin.y - matrix.e)) / (matrix.a * matrix.d - matrix.b * matrix.c);
        var alpha = (destination.x - matrix.a * origin.x - matrix.c * origin.y - matrix.e - matrix.c * beta) / matrix.a;
        // beta = 0;

        matrix = matrix.translate(alpha, beta);
        matrix.render = true;
        matrix = constrainMatrix(matrix);
        self.interactionCallback(matrix);

        if (matrix.render === true) {

            var transform = svgParent.createSVGTransformFromMatrix(matrix);
            element.transform.baseVal.initialize(transform);

            // console.log("%f, %f", matrix.a, matrix.e);
            // console.log("%f, %f", alpha, beta);
            // draw(matrix.a, matrix.e);

        }
    };

    function constrainMatrix(matrix) {

        // console.log("a:%f, b:%f, c:%f, d:%f, e:%f, f:%f", matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
        // console.log(height * matrix.a);
        var scaledHeight = height * matrix.a;
        if (matrix.a < 1 || matrix.a > 128) {

            matrix.render = false
        }

        if (scaledHeight + matrix.f < height) {

            matrix.f = - (scaledHeight - height);
        }

        if (matrix.f > 0) {

            matrix.f = 0;
        }

        return matrix;
    }
};

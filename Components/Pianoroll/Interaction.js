/* exported Interaction */

function Interaction(transformState, horizontalZoomBounds, svgParent, interactionCallback, doubleClickCallback, mouseMoveCallback, octaveBounds, defaultTimeRange) {

    "use strict";

    const noteNavigationRect = createSVGElement('rect', {x: horizontalZoomBounds.offsetX, y:horizontalZoomBounds.height, fill:'rgba(2, 27, 255, 0.26)'});
    svgParent.appendChild(noteNavigationRect);
    noteNavigationRect.addEventListener('wheel', onWheel);
    const timeNavigationRect = createSVGElement('rect', {x:horizontalZoomBounds.offsetX, y:0, height:horizontalZoomBounds.height, fill:'rgba(62, 227, 255, 0.26)'});
    const freqNavigationRect = createSVGElement('rect', {x:0, y:horizontalZoomBounds.height, width:horizontalZoomBounds.offsetX, fill:'rgba(150, 50, 10, 0.26)'});
    const initialFrequencyAxisHeight = svgParent.clientHeight - horizontalZoomBounds.height;
    const normalisedOctaveHeight = initialFrequencyAxisHeight / octaveBounds.normalisedVisible;
    const normalisedOctaveTotalHeight = normalisedOctaveHeight * octaveBounds.count;
    const initialTimeAxisWidth = (svgParent.clientWidth - horizontalZoomBounds.offsetX);
    const initial16thsCount = 16;
    const normalised16thWidth = initialTimeAxisWidth / initial16thsCount;

    svgParent.appendChild(timeNavigationRect);
    svgParent.appendChild(freqNavigationRect);

    timeNavigationRect.addEventListener('wheel', onWheel);
    freqNavigationRect.addEventListener('wheel', onWheel);

    svgParent.addEventListener('mousemove', function(event) {

        const position = mousePosition(svgParent, event);
        mouseMoveCallback(position);
    });

    svgParent.addEventListener('dblclick', function(evt) {

        const position = mousePosition(svgParent, evt);

        doubleClickCallback(position);
    });

    svgParent.addEventListener('click', function() {

    });

    svgParent.addEventListener('mousedown', function() {

    });

    svgParent.addEventListener('wheel', function() {

    });

    const minFrequencyScale = 1/2;
    const maxFrequencyScale = 8;

    let pianorollHeight = svgParent.clientHeight;
    let pianorollWidth = svgParent.clientWidth;
    let timeRange = defaultTimeRange;

    this.setTimeRange = function () {

        const valid = checkTimeRangeValid();

        if (valid.endValid === false || valid.startValid === false) {

            zoomToTimeRange(valid);
        }
    };

    this.setSize = function () {

        function resizeInteractionRectangle(rectangle, width, height) {

            rectangle.setAttribute('width', width);
            rectangle.setAttribute('height', height);
        }

        resizeInteractionRectangle(noteNavigationRect, svgParent.clientWidth - horizontalZoomBounds.offsetX, svgParent.clientHeight - horizontalZoomBounds.height);
        timeNavigationRect.setAttribute('width', svgParent.clientWidth - horizontalZoomBounds.offsetX);
        freqNavigationRect.setAttribute('height', svgParent.clientHeight - horizontalZoomBounds.height);

        let matrix = transformState.getCTM();

        const heightMultiple = (svgParent.clientHeight - horizontalZoomBounds.height) / (pianorollHeight - horizontalZoomBounds.height);
        const widthMultiple = (svgParent.clientWidth - horizontalZoomBounds.offsetX) / (pianorollWidth - horizontalZoomBounds.offsetX);

        const destination = svgParent.createSVGPoint();

        destination.x = 0;
        destination.y = 0;

        const focus = destination.matrixTransform(matrix.inverse());

        const a = matrix.a;

        let matrixCopy = matrix;

        matrixCopy = matrixCopy.scale(heightMultiple);

        if (matrixCopy.d > minFrequencyScale && matrixCopy.d < maxFrequencyScale) {

            matrix = matrixCopy;
        }

        matrix.a = a;

        const d = matrix.d;

        matrix = matrix.scale(widthMultiple);

        matrix.d = d;

        pan(destination, focus, matrix);
        pianorollHeight = svgParent.clientHeight;
        pianorollWidth = svgParent.clientWidth;
    };

    function mousePosition(element, event) {

        const offsetX = event.offsetX || event.layerX || 0;
        const offsetY = event.offsetY || event.layerY || 0;
        const position = {x: offsetX, y: offsetY};

        return position;
    }

    function onWheel(event) {

        let matrix = transformState.getCTM();
        const destination = svgParent.createSVGPoint();
        let focus = destination.matrixTransform(matrix.inverse());

        if (event.currentTarget === noteNavigationRect) {

            const temp = mousePosition(svgParent, event);
            destination.x = temp.x;
            destination.y = temp.y;
            focus = destination.matrixTransform(matrix.inverse());
            focus.x -= (event.wheelDeltaX / 4) / matrix.a;
            focus.y -= (event.wheelDeltaY / 4) / matrix.d;
        }
        else if (event.currentTarget === timeNavigationRect) {

            const temp = mousePosition(timeNavigationRect, event);
            destination.x = temp.x - horizontalZoomBounds.offsetX;
            destination.y = temp.y;
            focus = destination.matrixTransform(matrix.inverse());

            const zoomFactor = Math.pow(1.1, event.wheelDeltaY / 56);
            const d = matrix.d;

            matrix = matrix.scale(zoomFactor);

            focus.x -= (event.wheelDeltaX / 4) / matrix.a;
            matrix.d = d;
        }
        else if (event.currentTarget === freqNavigationRect) {

            const temp = mousePosition(freqNavigationRect, event);
            destination.x = temp.x;
            destination.y = temp.y - horizontalZoomBounds.height;

            focus = destination.matrixTransform(matrix.inverse());
            // console.log("%f %f %f", matrix.d, minFrequencyScale, maxFrequencyScale);
            const zoomFactor = Math.pow(1.1, event.wheelDeltaX / 56);
            let matrixCopy = matrix;

            const a = matrixCopy.a;

            matrixCopy = matrixCopy.scale(zoomFactor);

            if (matrixCopy.d > minFrequencyScale && matrixCopy.d < maxFrequencyScale) {

                matrix = matrixCopy;
            }

            focus.y -= (event.wheelDeltaY / 4) / matrix.d;
            matrix.a = a;
        }

        pan(destination, focus, matrix);
        const position = mousePosition(svgParent, event);
        mouseMoveCallback(position);
    }

    function pan(destination, origin, matrix) {

        const beta = (matrix.a * (destination.y - matrix.d * origin.y - matrix.f) - matrix.b * (destination.x - matrix.c * origin.y - matrix.e)) / (matrix.a * matrix.d - matrix.b * matrix.c);
        const alpha = (destination.x - matrix.a * origin.x - matrix.c * origin.y - matrix.e - matrix.c * beta) / matrix.a;
        matrix = matrix.translate(alpha, beta);

        setFrequencyBounds(matrix);
        setTimeBounds(matrix);

        interactionCallback(matrix);
        const transform = svgParent.createSVGTransformFromMatrix(matrix);
        // console.log("%f %f %f %f %f %f", matrix.a, matrix.b, matrix.c, matrix.d, matrix.e,matrix.f);
        transformState.transform.baseVal.initialize(transform);
    }

    function setFrequencyBounds(matrix) {

        const offsetLimit = (svgParent.clientHeight - horizontalZoomBounds.height) - normalisedOctaveTotalHeight * matrix.d;

        if (matrix.f >= 0) {

            matrix.f = 0;
        }
        else if (matrix.f < offsetLimit) {

            matrix.f =  offsetLimit;
        }

        const heightRatio = (svgParent.clientHeight - horizontalZoomBounds.height) / initialFrequencyAxisHeight;
        const zoomLimit = (octaveBounds.normalisedVisible / octaveBounds.count) * heightRatio;

        if (matrix.d < zoomLimit) {

            matrix.d = zoomLimit;
        }
    }

    function setTimeBounds(matrix) {

        const sixteenthsCount = timeRange.end.totalSixteenths - timeRange.start.totalSixteenths;
        const widthRatio = (svgParent.clientWidth - horizontalZoomBounds.offsetX) / initialTimeAxisWidth;
        const zoomLimit = (initial16thsCount / sixteenthsCount) * widthRatio;

        if (matrix.a < zoomLimit) {

            matrix.a = zoomLimit;
        }

        const sixteenthWidth = normalised16thWidth * matrix.a;
        const startTimeOffset = -timeRange.start.totalSixteenths * sixteenthWidth;
        const endTimeOffset = (svgParent.clientWidth - horizontalZoomBounds.offsetX) - (timeRange.end.totalSixteenths * sixteenthWidth) ;

        if (matrix.e > startTimeOffset) {

            matrix.e = startTimeOffset;
        }

        if (matrix.e < endTimeOffset) {

            matrix.e = endTimeOffset;
        }
    }

    function checkTimeRangeValid() {

        let startValid = true;
        let endValid = true;

        const matrix = transformState.getCTM();
        const offsetX = matrix.e;
        const zoomX = matrix.a;


        const startTimeOffset = -timeRange.start.totalSixteenths * normalised16thWidth * zoomX;

        if (startTimeOffset < offsetX) {

            startValid = false;
        }
        const timeAxisWidth = (svgParent.clientWidth - horizontalZoomBounds.offsetX);
        const endTimeOffset = -timeRange.end.totalSixteenths * normalised16thWidth * zoomX + timeAxisWidth;

        if (endTimeOffset > offsetX ) {

            endValid = false;
        }

        return {startValid:startValid, startTime:startTimeOffset, endValid:endValid, endTime:endTimeOffset};
    }

    function zoomToTimeRange(valid) {

        let matrix = transformState.getCTM();
        const timeAxisWidth = (svgParent.clientWidth - horizontalZoomBounds.offsetX);
        const offsetX = matrix.e;
        const zoomX = matrix.a;

        let widthMultiple, sixteenthPosition;
        let destination = svgParent.createSVGPoint();

        function doPan() {

            destination.y = 0;
            widthMultiple =  timeAxisWidth / sixteenthPosition;


            const focus = destination.matrixTransform(matrix.inverse());

            const d = matrix.d;

            matrix = matrix.scale(widthMultiple);

            matrix.d = d;

            pan(destination, focus, matrix);

        }

        if (valid.endValid === false) {

            sixteenthPosition = timeRange.end.totalSixteenths * normalised16thWidth * zoomX + offsetX;
            destination.x = 0;
            doPan();
        }

        if (valid.startValid === false) {

            sixteenthPosition = timeAxisWidth - (timeRange.start.totalSixteenths * normalised16thWidth * zoomX + offsetX);
            destination.x = timeAxisWidth;
            doPan();
        }
    }
}

/* exported Interaction */

function Interaction(interactionParent, transformState, horizontalZoomBounds, resizableDiv,  interactionCallback, octaveBounds, initialTimeBounds) {

    "use strict";

    interactionParent.style.position = 'absolute';
    interactionParent.style.width = '100%';
    interactionParent.style.height = '100%';

    const noteNavigationRect = createSVGElement('rect', {x: horizontalZoomBounds.offsetX, y:horizontalZoomBounds.height, fill:'rgba(2, 27, 255, 0.26)'});
    interactionParent.appendChild(noteNavigationRect);
    noteNavigationRect.addEventListener('wheel', onWheel);

    const timeNavigationRect = createSVGElement('rect', {x:horizontalZoomBounds.offsetX, y:0, height:horizontalZoomBounds.height, fill:'rgba(62, 227, 255, 0.26)'});
    const freqNavigationRect = createSVGElement('rect', {x:0, y:horizontalZoomBounds.height, width:horizontalZoomBounds.offsetX, fill:'rgba(150, 50, 10, 0.26)'});
    const initialFrequencyAxisHeight = resizableDiv.height - horizontalZoomBounds.height;
    const normalisedOctaveHeight = initialFrequencyAxisHeight / octaveBounds.normalisedVisible;
    const normalisedOctaveTotalHeight = normalisedOctaveHeight * octaveBounds.count;
    const initialTimeAxisHeight = (resizableDiv.width - horizontalZoomBounds.offsetX);
    const initial16thsCount = 16;
    const normalised16thWidth = initialTimeAxisHeight / initial16thsCount;

    interactionParent.appendChild(timeNavigationRect);
    interactionParent.appendChild(freqNavigationRect);

    timeNavigationRect.addEventListener('wheel', onWheel);
    freqNavigationRect.addEventListener('wheel', onWheel);

    let pianorollHeight = resizableDiv.height;
    let pianorollWidth = resizableDiv.width;

    this.setSize = function () {

        function resizeInteractionRectangle(rectangle, width, height) {

            rectangle.setAttribute('width', width);
            rectangle.setAttribute('height', height);
        }

        resizeInteractionRectangle(noteNavigationRect, resizableDiv.width - horizontalZoomBounds.offsetX, resizableDiv.height - horizontalZoomBounds.height);
        timeNavigationRect.setAttribute('width', resizableDiv.width - horizontalZoomBounds.offsetX);
        freqNavigationRect.setAttribute('height', resizableDiv.height - horizontalZoomBounds.height);

        let matrix = transformState.getCTM();

        const heightMultiple = (resizableDiv.height - horizontalZoomBounds.height) / (pianorollHeight - horizontalZoomBounds.height);
        const widthMultiple = (resizableDiv.width - horizontalZoomBounds.offsetX) / (pianorollWidth - horizontalZoomBounds.offsetX);

        const destination = interactionParent.createSVGPoint();

        destination.x = 0;
        destination.y = 0;

        const focus = destination.matrixTransform(matrix.inverse());

        const a = matrix.a;

        matrix = matrix.scale(heightMultiple);

        matrix.a = a;

        const d = matrix.d;

        matrix = matrix.scale(widthMultiple);

        matrix.d = d;

        pan(destination, focus, matrix);
        pianorollHeight = resizableDiv.height;
        pianorollWidth = resizableDiv.width;
    };


    function mousePosition(element, event) {

        const offsetX = event.offsetX || event.layerX || 0;
        const offsetY = event.offsetY || event.layerY || 0;
        const position = {x: offsetX, y: offsetY};

        return position;
    }


    function onWheel(event) {

        let matrix = transformState.getCTM();
        const destination = interactionParent.createSVGPoint();
        let focus = destination.matrixTransform(matrix.inverse());

        if (event.currentTarget === noteNavigationRect) {

            const temp = mousePosition(interactionParent, event);
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

            const zoomFactor = Math.pow(1.1, event.wheelDeltaX / 56);
            const a = matrix.a;

            matrix = matrix.scale(zoomFactor);

            focus.y -= (event.wheelDeltaY / 4) / matrix.d;
            matrix.a = a;
        }

        pan(destination, focus, matrix);

    }

    function pan(destination, origin, matrix) {

        const beta = (matrix.a * (destination.y - matrix.d * origin.y - matrix.f) - matrix.b * (destination.x - matrix.c * origin.y - matrix.e)) / (matrix.a * matrix.d - matrix.b * matrix.c);
        const alpha = (destination.x - matrix.a * origin.x - matrix.c * origin.y - matrix.e - matrix.c * beta) / matrix.a;
        matrix = matrix.translate(alpha, beta);

        setFrequencyBounds(matrix);
        setTimeBounds(matrix);

        interactionCallback(matrix);
        const transform = interactionParent.createSVGTransformFromMatrix(matrix);

        transformState.transform.baseVal.initialize(transform);
    }

    function setFrequencyBounds(matrix) {

        const offsetLimit = (resizableDiv.height - horizontalZoomBounds.height) - normalisedOctaveTotalHeight * matrix.d;

        if (matrix.f >= 0) {

            matrix.f = 0;
        }
        else if (matrix.f < offsetLimit) {

            matrix.f =  offsetLimit;
        }

        const heightRatio = (resizableDiv.height - horizontalZoomBounds.height) / initialFrequencyAxisHeight;
        const zoomLimit = (octaveBounds.normalisedVisible / octaveBounds.count) * heightRatio;

        if (matrix.d < zoomLimit) {

            matrix.d = zoomLimit;
        }
    }

    function setTimeBounds(matrix) {

        const sixteenthWidth = normalised16thWidth * matrix.a;
        const startTimeOffset = initialTimeBounds.start.totalSixteenths * sixteenthWidth;
        const endTimeOffset = (resizableDiv.width - horizontalZoomBounds.offsetX) - (initialTimeBounds.end.totalSixteenths * sixteenthWidth) ;

        if (matrix.e > startTimeOffset) {

            matrix.e = startTimeOffset;
        }
        else if (matrix.e < endTimeOffset) {

            matrix.e = endTimeOffset;
        }

        const sixteenthsCount = initialTimeBounds.end.totalSixteenths - initialTimeBounds.start.totalSixteenths;
        const widthRatio = (resizableDiv.width - horizontalZoomBounds.offsetX) / initialTimeAxisHeight;
        const zoomLimit = (sixteenthsCount / initial16thsCount) * widthRatio;

        if (matrix.a < zoomLimit) {

            matrix.a = zoomLimit;
        }
    }
}

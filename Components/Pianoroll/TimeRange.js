/* exported TimeRange */

function TimeRange(interactionParent, mask, element, horizontalZoomBounds, resizableDiv, initialTimeBounds) {

    "use strict";

    const rangeLineHeight = 10;
    const rangeLineY = horizontalZoomBounds.height - rangeLineHeight;
    const rangeLine = createSVGElement('rect', {height:rangeLineHeight, y:rangeLineY, fill:'red'});
    const startLine = createSVGElement('line', {y1:horizontalZoomBounds.height - rangeLineHeight, y2:resizableDiv.height, stroke:'red', 'stroke-width':'1', 'vector-effect':'non-scaling-stroke'});
    const endLine = createSVGElement('line', {y1:horizontalZoomBounds.height - rangeLineHeight, y2:resizableDiv.height, stroke:'red', 'stroke-width':'1', 'vector-effect':'non-scaling-stroke'});
    element.appendChild(rangeLine);
    element.appendChild(startLine);
    element.appendChild(endLine);

    const initial16thsCount = initialTimeBounds.end.totalSixteenths - initialTimeBounds.start.totalSixteenths;
    const normalised16thWidth = (resizableDiv.width - horizontalZoomBounds.offsetX)/initial16thsCount;
    const positions = getNormalisedRangePositions(initialTimeBounds);
    const width = positions.end - positions.start;
    rangeLine.setAttribute('width', width);
    startLine.setAttribute('x1', positions.start);
    startLine.setAttribute('x2', positions.start);
    endLine.setAttribute('x1', positions.end);
    endLine.setAttribute('x2', positions.end);
    element.setAttribute('transform', 'translate(' + horizontalZoomBounds.offsetX + ', 0)');


    const maskParent = createSVGElement('defs');
    const clipPath = createSVGElement('clipPath');
    clipPath.id = "timeRangeMask";
    maskParent.appendChild(clipPath);
    const maskRectangle = createSVGElement('rect', {x:horizontalZoomBounds.offsetX, y:0, width:resizableDiv.width - horizontalZoomBounds.offsetX, height:resizableDiv.height});
    clipPath.appendChild(maskRectangle);
    mask.appendChild(maskParent);

    mask.setAttribute('clip-path', 'url(#' + clipPath.id + ')');


    this.setTimeBounds = function(timeBoundsIn) {

        const positions = getNormalisedRangePositions(timeBoundsIn);
        const width = positions.end - positions.start;
        rangeLine.setAttribute('x', positions.start);
        rangeLine.setAttribute('width', width);
        startLine.setAttribute('x1', positions.start);
        startLine.setAttribute('x2', positions.start);
        endLine.setAttribute('x1', positions.end);
        endLine.setAttribute('x2', positions.end);
    };

    this.transform = function (matrix) {

        startLine.setAttribute('y2', resizableDiv.height);
        endLine.setAttribute('y2', resizableDiv.height);
        maskRectangle.setAttribute('height', resizableDiv.height);
        maskRectangle.setAttribute('width', resizableDiv.width - horizontalZoomBounds.offsetX);

        element.setAttribute('transform', 'translate(' + (horizontalZoomBounds.offsetX + matrix.e) + ', 0)' + 'scale(' + matrix.a + ', 1)');
    };

    function getNormalisedRangePositions(timeBoundsIn) {

        const startPosition = timeBoundsIn.start.totalSixteenths * normalised16thWidth;
        const endPosition = timeBoundsIn.end.totalSixteenths * normalised16thWidth;
        return {start:startPosition, end:endPosition};
    }
}

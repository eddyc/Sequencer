/* exported PlayheadLayer */
function PlayheadLayer(mask, element, horizontalZoomBounds, svgParent) {

    "use strict";

    const maskParent = createSVGElement('defs');
    const clipPath = createSVGElement('clipPath');
    clipPath.id = "noteLayerMask";
    maskParent.appendChild(clipPath);
    const maskRectangle = createSVGElement('rect', {x:horizontalZoomBounds.offsetX + 1, y:horizontalZoomBounds.height, width:svgParent.clientWidth - horizontalZoomBounds.offsetX, height:svgParent.clientHeight - horizontalZoomBounds.height});
    clipPath.appendChild(maskRectangle);
    mask.appendChild(maskParent);

    mask.setAttribute('clip-path', 'url(#' + clipPath.id + ')');

    element.setAttribute('transform', 'translate(' + horizontalZoomBounds.offsetX + ', ' + horizontalZoomBounds.height + ')');

    const playheadLine = createSVGElement('line', {x1:10, x2:10, y1:0, y2:svgParent.clientHeight - horizontalZoomBounds.height, stroke:'red', 'vector-effect':'non-scaling-stroke'});
    element.appendChild(playheadLine);

    let offsetX = 0;
    let offsetY = 0;
    let zoomX = 1;
    let zoomY = 1;

    this.setSize = function() {

        maskRectangle.setAttribute('height', svgParent.clientHeight - horizontalZoomBounds.height);
        maskRectangle.setAttribute('width', svgParent.clientWidth - horizontalZoomBounds.offsetX);
    };

    this.transform = function(matrix) {

        zoomX = matrix.a;
        zoomY = matrix.d;
        offsetX = matrix.e;
        offsetY = matrix.f;
        element.setAttribute('transform', "translate(" + (offsetX + horizontalZoomBounds.offsetX) + ", " + (offsetY + horizontalZoomBounds.height)  + ") scale(" + zoomX + "," + zoomY + ")");
    };

    this.tick = function(time) {

        // console.log(time);
    };
}

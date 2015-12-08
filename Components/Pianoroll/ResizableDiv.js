/* exported ResizableDiv */

function ResizableDiv(parentDiv, resizableDiv, initialWidth, initialHeight, initialX, initialY, onResize) {

    "use strict";
    const self = this;
    self.width = initialWidth;
    self.height = initialHeight;
    self.x = initialX;
    self.y = initialY;

    const minWidth = 120;
    const minHeight = 120;
    const marginWidth = 4;

    resizableDiv.style.width = initialWidth + 'px';
    resizableDiv.style.height = initialHeight + 'px';
    resizableDiv.style.left = initialX + 'px';
    resizableDiv.style.top = initialY + 'px';

    let clickProperties = null;

    parentDiv.addEventListener('mousemove', onMouseMove);
    parentDiv.addEventListener('mouseup', onMouseUp);
    resizableDiv.addEventListener('mousedown', onMouseDown);

    function calculatePosition(event) {

        const bounds = resizableDiv.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        const onTopEdge = y < marginWidth;
        const onLeftEdge = x < marginWidth;
        const onRightEdge = x >= bounds.width - marginWidth;
        const onBottomEdge = y >= bounds.height - marginWidth;


        if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {

            resizableDiv.style.cursor = 'nwse-resize';
        }
        else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {

            resizableDiv.style.cursor = 'nesw-resize';
        }
        else if (onRightEdge || onLeftEdge) {

            resizableDiv.style.cursor = 'ew-resize';
        }
        else if (onBottomEdge || onTopEdge) {

            resizableDiv.style.cursor = 'ns-resize';
        }
        else {

            resizableDiv.style.cursor = 'default';
        }

        return {bounds:bounds, x:x, y:y, onTopEdge:onTopEdge, onLeftEdge:onLeftEdge, onRightEdge:onRightEdge, onBottomEdge:onBottomEdge};
    }

    function onMouseMove(event) {

        const calculated = calculatePosition(event);

        if (clickProperties !== null) {

            if (clickProperties.onRightEdge) {

                self.width = Math.max(calculated.x, minWidth);
                resizableDiv.style.width = self.width + 'px';
            }

            if (clickProperties.onBottomEdge) {

                self.height = Math.max(calculated.y, minHeight);
                resizableDiv.style.height = self.height + 'px';
            }

            if (clickProperties.onLeftEdge) {

                const currentWidth = Math.max(clickProperties.cx - event.clientX  + clickProperties.w, minWidth);

                if (currentWidth > minWidth) {

                    self.width = currentWidth;
                    resizableDiv.style.width = self.width + 'px';
                    self.x = event.clientX;
                    resizableDiv.style.left = self.x + 'px';
                }
            }

            if (clickProperties.onTopEdge) {

                const currentHeight = Math.max(clickProperties.cy - event.clientY  + clickProperties.h, minHeight);

                if (currentHeight > minHeight) {

                    self.height = currentHeight;
                    resizableDiv.style.height = self.height + 'px';
                    self.y = event.clientY;
                    resizableDiv.style.top = self.y + 'px';
                }
            }

            onResize(resizableDiv);
        }
    }

    function onMouseUp() {

        clickProperties = null;
    }

    function onMouseDown(event) {

        const calculated = calculatePosition(event);

        clickProperties = {
            x: calculated.x,
            y: calculated.y,
            cx: event.clientX,
            cy: event.clientY,
            w: calculated.bounds.width,
            h: calculated.bounds.height,
            onTopEdge: calculated.onTopEdge,
            onLeftEdge: calculated.onLeftEdge,
            onRightEdge: calculated.onRightEdge,
            onBottomEdge: calculated.onBottomEdge
        };
    }
}

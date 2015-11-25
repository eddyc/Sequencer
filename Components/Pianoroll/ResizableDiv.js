var ResizableDiv = function(rootElement, resizableElement, x, y, width, height, onResize) {

    resizableElement.style.border = "1px solid black"
    var minWidth = 60;
    var minHeight = 40;

    var MARGINS = 4;

    var clicked = null;
    var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

    rootElement.addEventListener('mousemove', onMove);
    rootElement.addEventListener('mouseup', onUp);

    resizableElement.style.position = 'absolute';
    setBounds(resizableElement, x,y,width,height);

    resizableElement.addEventListener('mousedown', onMouseDown);
    resizableElement.addEventListener('mouseenter', function(event) {
        var x = window.scrollX;
        var y = window.scrollY;
        window.onscroll=function(){window.scrollTo(x, y);};
        console.log("mouseenter");
    });
    resizableElement.addEventListener('mouseleave', function(event) {
        window.onscroll=function(){};
        console.log("mouseleave");
    });

    function setBounds(element, x, y, w, h) {
        element.style.left = x + 'px';
        element.style.top = y + 'px';
        element.style.width = w + 'px';
        element.style.height = h + 'px';
    }

    function onUp(e) {

        clicked = null;
    }

    function onMouseDown(e) {

        var calculated = calculate(e);

        var isResizing = calculated.onRightEdge || calculated.onBottomEdge || calculated.onTopEdge || calculated.onLeftEdge;

        clicked = {
            x: calculated.x,
            y: calculated.y,
            cx: e.clientX,
            cy: e.clientY,
            w: calculated.b.width,
            h: calculated.b.height,
            isResizing: isResizing,
            isMoving: !isResizing,
            onTopEdge: calculated.onTopEdge,
            onLeftEdge: calculated.onLeftEdge,
            onRightEdge: calculated.onRightEdge,
            onBottomEdge: calculated.onBottomEdge
        };
    }

    function calculate(e) {

        var b = resizableElement.getBoundingClientRect();
        var x = e.clientX - b.left;
        var y = e.clientY - b.top;

        var onTopEdge = y < MARGINS;
        var onLeftEdge = x < MARGINS;
        var onRightEdge = x >= b.width - MARGINS;
        var onBottomEdge = y >= b.height - MARGINS;

        if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge) {
            resizableElement.style.cursor = 'nwse-resize';
        } else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge) {
            resizableElement.style.cursor = 'nesw-resize';
        } else if (onRightEdge || onLeftEdge) {
            resizableElement.style.cursor = 'ew-resize';
        } else if (onBottomEdge || onTopEdge) {
            resizableElement.style.cursor = 'ns-resize';
        } else {
            resizableElement.style.cursor = 'default';
        }
        return {b:b, x:x, y:y, onTopEdge:onTopEdge, onLeftEdge:onLeftEdge, onRightEdge:onRightEdge, onBottomEdge:onBottomEdge};
    }

    function onMove(e) {

        var calculated = calculate(e);
        if (clicked && clicked.isResizing) {

            if (clicked.onRightEdge) resizableElement.style.width = Math.max(calculated.x, minWidth) + 'px';
            if (clicked.onBottomEdge) resizableElement.style.height = Math.max(calculated.y, minHeight) + 'px';

            if (clicked.onLeftEdge) {
                var currentWidth = Math.max(clicked.cx - e.clientX  + clicked.w, minWidth);
                if (currentWidth > minWidth) {
                    resizableElement.style.width = currentWidth + 'px';
                    resizableElement.style.left = e.clientX + 'px';
                }
            }

            if (clicked.onTopEdge) {
                var currentHeight = Math.max(clicked.cy - e.clientY  + clicked.h, minHeight);
                if (currentHeight > minHeight) {
                    resizableElement.style.height = currentHeight + 'px';
                    resizableElement.style.top = e.clientY + 'px';
                }
            }

            onResize(resizableElement);
        }
    }

};

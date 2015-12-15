/* exported ResizablePanes */

function ResizablePanes() {

    "use strict";
    const rootPane = document.getElementById("RootPane");
    const top = 52;
    const bottom = 12;
    rootPane.style.top = top + 'px';
    rootPane.style.bottom = bottom + 'px';
    const topPane = document.getElementById("TopPane");
    const bottomPane = document.getElementById("BottomPane");
    const leftPane = document.getElementById("LeftPane");
    const rightPane = document.getElementById("RightPane");

    const marginWidth = 1;
    let horizontalCentre = 20;
    let verticalCentre = 60;

    leftPane.style.width = horizontalCentre + "%";
    rightPane.style.width = (100 - horizontalCentre) + "%";
    topPane.style.height = verticalCentre + "%";
    bottomPane.style.height = (100 - verticalCentre) + "%";

    let mouseDown = false;
    let calculated = {horizontal:false, vertical:false};

    function calculatePosition(percentWidth, percentHeight) {

        const onHorizontalMidPoint = percentWidth > horizontalCentre - marginWidth && percentWidth < horizontalCentre + marginWidth && percentHeight < verticalCentre;
        const onVerticalMidPoint = percentHeight > verticalCentre - marginWidth && percentHeight < verticalCentre + marginWidth;

        return {horizontal:onHorizontalMidPoint, vertical:onVerticalMidPoint};
    }

    rootPane.addEventListener("mousemove", function(event) {

        const percentWidth = (event.clientX / rootPane.clientWidth) * 100;
        const percentHeight = ((event.clientY - top) / (rootPane.clientHeight)) * 100;


        if (mouseDown === false) {

            calculated = calculatePosition(percentWidth, percentHeight);
            if (calculated.horizontal === true && calculated.vertical === false) {

                rootPane.style.cursor = 'ew-resize';
            }
            else if (calculated.horizontal === false && calculated.vertical === true) {

                rootPane.style.cursor = 'ns-resize';

            }
            else if (calculated.horizontal === true && calculated.vertical === true) {

                rootPane.style.cursor = 'nwse-resize';
            }
            else {

                rootPane.style.cursor = 'default';
            }
        }
        else {

            if (calculated.horizontal === true && calculated.vertical === false) {
                horizontalCentre = percentWidth;
                leftPane.style.width = horizontalCentre + "%";
                rightPane.style.width = (100 - horizontalCentre) + "%";
            }
            else if (calculated.horizontal === false && calculated.vertical === true) {

                verticalCentre = percentHeight;
                topPane.style.height = verticalCentre + "%";
                bottomPane.style.height = (100 - verticalCentre) + "%";
            }
            else if (calculated.horizontal === true && calculated.vertical === true) {

                verticalCentre = percentHeight;
                horizontalCentre = percentWidth;
                leftPane.style.width = horizontalCentre + "%";
                rightPane.style.width = (100 - horizontalCentre) + "%";
                topPane.style.height = verticalCentre + "%";
                bottomPane.style.height = (100 - verticalCentre) + "%";
            }
        }

    });

    rootPane.addEventListener('mousedown', function() {

        if (calculated.horizontal === true || calculated.vertical === true) {

            mouseDown = true;
        }
    });
    rootPane.addEventListener('mouseup', function() {

        rootPane.style.cursor = 'default';
        mouseDown = false;
    });

}

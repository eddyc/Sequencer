
Polymer({

    is: 'svg-navigation',

    properties: {
        width:Number,
        height:Number,
        mouseDown:false,
        panStart:{},
        receivedInteraction:function(matrix){return matrix;}
    },

    listeners: {

        mousedown:'onMouseDown',
        mouseup:'onMouseUp',
        mousewheel:'onMouseWheel'
    },

    onMouseDown: function(e) {

        if (e.button === 0) {

            viewport.setAttribute('stroke','red');
            mouseDown = true;
            panStart = svgParent.createSVGPoint();
            var temp = this.mousePosRelElement(svgParent, e);

            panStart.x = temp.x;
            panStart.y = temp.y;
            panStart = panStart.matrixTransform(viewport.getCTM().inverse());
            this.addEventListener('mousemove', this.onMouseMove);
        }
    },

    mousePosRelElement:function (elem, e) {

        var style = getComputedStyle(elem,null);
        var borderTop = style.getPropertyValue("border-top-width");
        var borderLeft = style.getPropertyValue("border-left-width");
        var paddingTop = style.getPropertyValue("padding-top");
        var paddingLeft = style.getPropertyValue("padding-left");
        var offsetX = e.offsetX || e.layerX || 0;
        var offsetY = e.offsetY || e.layer || 0;
        var loc = {x: offsetX, y: offsetY};

        return loc;
    },

    onMouseUp: function (e) {

        if (mouseDown === true) {

            mouseDown = false;
            viewport.setAttribute('stroke','black');
            this.removeEventListener('mousemove', this.onMouseMove);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    },

    onMouseMove: function (e) {

        if (mouseDown === true) {

            var matrix = viewport.getCTM();
            var destination = this.mousePosRelElement(svgParent, e);
            this.pan(destination, panStart, matrix);

            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    },

    onMouseWheel: function (e) {

        var zoomFactor = Math.pow(1.1, e.wheelDeltaY / 56);
        var matrix = viewport.getCTM();
        var temp = this.mousePosRelElement(svgParent, e);
        var destination = svgParent.createSVGPoint();
        destination.x = temp.x;
        destination.y = temp.y;
        var focus = destination.matrixTransform(matrix.inverse());
        matrix = matrix.scale(zoomFactor);
        // matrix.d = 1;
        this.pan(destination, focus,  matrix);
        e.preventDefault();
        e.stopPropagation();
        return false;
    },

    pan: function (destination, origin, matrix) {

        var beta = (matrix.a * (destination.y - matrix.d * origin.y - matrix.f) - matrix.b * (destination.x - matrix.c * origin.y - matrix.e)) / (matrix.a * matrix.d - matrix.b * matrix.c);
        var alpha = (destination.x - matrix.a * origin.x - matrix.c * origin.y - matrix.e - matrix.c * beta) / matrix.a;
        // beta = 0;

        matrix = matrix.translate(alpha, beta);
        matrix.render = true;
        matrix = this.receivedInteraction(matrix);

        if (matrix.render === true) {

            var transform = svgParent.createSVGTransformFromMatrix(matrix);
            viewport.transform.baseVal.initialize(transform);

            console.log("%f, %f", matrix.a, matrix.e);
            // draw(matrix.a, matrix.e);

        }
    }

});

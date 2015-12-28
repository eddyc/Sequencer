/* exported NoteLayer */
function NoteLayer (mask, element, horizontalZoomBounds, svgParent) {

    "use strict";

    let offsetX = 0;
    let offsetY = 0;
    let zoomX = 1;
    let zoomY = 1;

    this.setSize = function() {


    };

    this.transform = function(matrix) {


    };

    this.onMouseMove = function(position) {

        const noteElement = getNoteElement(position);
        noteElement.setActive();
    };

    function getNoteElement(position) {

        const rpos = svgParent.createSVGRect();
        rpos.x = position.x;
        rpos.y = position.y;
        rpos.width = rpos.height = 0;
        const list = svgParent.getIntersectionList(rpos, null);

        let noteElement = null;

        for (let i = 0; i < list.length; i++) {

            if (list[i].isHoverOver === true) {

                noteElement = list[i];
                return noteElement;
            }
        }

        for (let i = 0; i < list.length; i++) {

            if (list[i].isNotePoint === true) {

                noteElement = list[i];
                return noteElement;
            }
        }
    }

    this.pushNote = function(position) {

        const noteElement = getNoteElement(position);
        noteElement.setActive();
        console.log(noteElement.noteString);

        if (noteElement.isAxisPoint === false ) {

            const noteTime = getNoteTime(position);
            console.log(noteTime);
        }
    };
}

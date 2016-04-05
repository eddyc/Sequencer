(function () {

    "use strict";

    function moduleDidLoad(self) {

        console.log("module loaded");

        csound.Play();
        csound.CompileOrc("instr 1 \n" +
        "icps = 440\n" +
        "chnset icps, \"freq\" \n" +
        "a1 oscili 0.01, icps\n" +
        "outs a1,a1 \n" +"endin");

    }

    function receivedEvent(delay) {

        csound.Event("i 1 " + delay + " .5");
    }

    Polymer({

        is: 'csound-engine',
        properties: {
        },
        moduleDidLoad:function() {

            moduleDidLoad(this);
        },
        receivedEvent:receivedEvent,
    });
})();

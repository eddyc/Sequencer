(function () {

    "use strict";

    function moduleDidLoad() {

        console.log("module loaded");

        csound.Play();
        csound.CompileOrc("instr 1 \n" +
        "icps = 440\n" +
        "chnset icps, \"freq\" \n" +
        "a1 oscili 0.1, icps\n" +
        "outs a1,a1 \n" +"endin");

        // csound.Event("i 1 " + 0 + " .5");
    }

    Polymer({

        is: 'csound-engine',
        properties: {
        },
        moduleDidLoad:moduleDidLoad
    });
})();

/* exported Timer */
function Timer() {

    "use strict";

    const audioContext = new AudioContext();
    const timerWorker = new Worker("Components/Scheduler/MetronomeWorker.js");
    const tickCallbacks = [];

    timerWorker.postMessage("start");

    this.pushTickCallback = function(callback) {

        tickCallbacks.push(callback);
    };

    timerWorker.onmessage = function(e) {

        if (e.data == "tick") {

            tickCallbacks.forEach(function(tick) {

                tick(audioContext.currentTime);
            });
        }
        else {

            console.log("message: " + e.data);
        }
    };
}

/* exported ClipScheduler */
function ClipScheduler(defaultBPM) {

    "use strict";

    const timer = new Timer();
    const clips = [];
    let bpm = defaultBPM;

    this.addNewClip = function() {

        const clip = new Clip();
        timer.pushTickCallback(clip.tick);
        clips.push(clip);
        return clip;
    };

    this.setBPM = function(newBPM) {

        bpm = newBPM;
    };

}

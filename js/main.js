window.addEventListener("load", () => {

    const csoundEngine = document.getElementsByTagName("csound-engine")[0];
    const schedulerEngine = document.getElementsByTagName("scheduler-engine")[0];

    const resizablePanes = new ResizablePanes();
    const pianoroll = document.getElementsByTagName("piano-roll")[0];
    pianoroll.initialise(schedulerEngine.receivedEvent);
    schedulerEngine.initialise(csoundEngine.receivedEvent, pianoroll.tick);
    pianoroll.setTimeRangeChangedCallback(schedulerEngine.receivedTimeRange);
    resizablePanes.pushVerticalResizeCallback(pianoroll.setSize);
    window.addEventListener("resize", () => {

        pianoroll.setSize();
    });

});

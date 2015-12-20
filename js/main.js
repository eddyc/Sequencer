window.addEventListener("load", () => {

    const resizablePanes = new ResizablePanes();
    const pianorollComponent = document.getElementById("PianorollComponent");
    pianorollComponent.initialise();
    resizablePanes.pushVerticalResizeCallback(pianorollComponent.setSize);
    window.addEventListener("resize", () => {

        pianorollComponent.setSize();
    });
});

function createSVGElement(elementType, attributes) {

    var element = document.createElementNS('http://www.w3.org/2000/svg', elementType);

    for(property in attributes) {

        element.setAttribute(property, attributes[property]);
    }

    return element;
};

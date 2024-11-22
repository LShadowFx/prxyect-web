function toggleVisibility(elementId) {
    var element = document.getElementById(elementId);
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
}

function toggleModoOscuro(elementId) {
    document.body.classList.toggle('modo-oscuro');
}
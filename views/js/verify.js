window.onload = function() {
    const token = localStorage.getItem('authToken');

    if (!token) {
        alert("No estas autenticado. Volviendo a inicio");
        window.location.href = '../../index.html'
    }
}
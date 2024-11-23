document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
        localStorage.setItem('accessToken', token); // Guarda el token para futuras solicitudes
    }

    fetch('https://my-backend-lshadowfxs-projects.vercel.app/api/server', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('accessToken'),
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const serverList = document.getElementById('server-list');
        data.forEach(server => {
            const serverElement = document.createElement('li');
            serverElement.textContent = server.name;
            serverList.appendChild(serverElement);
        });
    })
    .catch(error => {
        console.error('Error al obtener los servidores:', error);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-discord');
    const serverListDiv = document.getElementById('server-list');
    const serversUl = serverListDiv.querySelector('ul');

    // Configuración de OAuth2
    const CLIENT_ID = '1095478254049177741';
    const REDIRECT_URI = 'https://lshadowfx.github.io/prxyect-web/dashboard/panel.html';
    const API_BASE = 'https://discord.com/api/oauth2/authorize';
    const SCOPE = 'identify guilds';
    const RESPONSE_TYPE = 'token';

    // Botón de inicio de sesión
    loginButton.addEventListener('click', () => {
        const authURL = `${API_BASE}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
            REDIRECT_URI
        )}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
        window.location.href = authURL;
    });

    // Función para obtener el token de la URL
    function getTokenFromUrl() {
        const params = new URLSearchParams(window.location.hash.replace('#', '?'));
        const token = params.get('access_token');
        console.log(`Token extraido: ${token}`);
        return token;
    }

    // Función para obtener servidores desde el backend
    async function fetchServers() {
        const token = getTokenFromUrl();

        if (!token) {
            alert('Token no encontrado. Asegúrate de haber iniciado sesión correctamente.');
            return;
        }

        try {
            const response = await fetch(
                `https://my-backend-git-main-lshadowfxs-projects.vercel.app/get-servers?token=${token}`
            );

            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status}`);
            }

            const servers = await response.json();

            serversUl.innerHTML = ''; // Limpiar lista previa

            // Crear elementos de la lista
            servers.forEach((server) => {
                const li = document.createElement('li');
                li.textContent = server.name;
                li.classList.add('server-item');
                li.addEventListener('click', () => {
                    // Cambiar de pestaña o recargar
                    window.location.href = `${REDIRECT_URI}?server_id=${server.id}`;
                });
                serversUl.appendChild(li);
            });

            // Mostrar lista de servidores
            serverListDiv.style.display = 'block';
        } catch (error) {
            console.error('Error al obtener los servidores:', error);
            alert('Hubo un problema al obtener los servidores. Por favor, intenta nuevamente más tarde.');
        }
    }

    // Verificar si se ha redirigido desde la autenticación y cargar los servidores
    if (window.location.hash) {
        fetchServers();
    }
});

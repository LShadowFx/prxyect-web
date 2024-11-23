document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-discord');
    const serverListDiv = document.getElementById('server-list');
    const serversUl = serverListDiv.querySelector('ul');
    const backendUrl = 'https://my-backend-git-main-lshadowfxs-projects.vercel.app'; // Cambia esto a tu URL de backend real

    // Configuración de OAuth2
    const REDIRECT_URI = 'https://lshadowfx.github.io/prxyect-web/dashboard/panel.html'; // URL de redirección
    const CLIENT_ID = '1095478254049177741'; 
    const SCOPE = 'identify guilds';

    // Función para obtener el token de la URL
    function getCodeFromUrl() {
        const params = new URLSearchParams(window.location.search); // Cambié de hash a search para acceder al query
        return params.get('code'); // Obtener el código de la URL
    }

    // Función para obtener el token de acceso desde el backend
    async function exchangeCodeForToken(code) {
        try {
            const response = await fetch(`${backendUrl}/auth/discord/callback?code=${code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const data = await response.json();
            if (data.access_token) {
                return data.access_token; // Retornar el token de acceso
            } else {
                throw new Error('Error al obtener el token');
            }
        } catch (error) {
            console.error('Error al intercambiar el código:', error);
            alert('Hubo un problema al obtener el token.');
            return null;
        }
    }

    // Función para obtener servidores usando el token
    async function fetchServers() {
        const code = getCodeFromUrl();
        const token = await exchangeCodeForToken(code); // Obtener el token del backend

        if (!token) {
            alert('No se pudo obtener el token de acceso.');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/get-servers?token=${token}`);

            if (!response.ok) {
                throw new Error(`Error en la respuesta del servidor: ${response.status}`);
            }

            const servers = await response.json();

            // Limpiar la lista previa
            serversUl.innerHTML = '';

            // Crear elementos de la lista
            servers.forEach((server) => {
                const li = document.createElement('li');
                li.textContent = server.name;
                li.classList.add('server-item');
                li.addEventListener('click', () => {
                    window.location.href = `${REDIRECT_URI}?server_id=${server.id}`;
                });
                serversUl.appendChild(li);
            });

            serverListDiv.style.display = 'block';  // Mostrar la lista de servidores
            loginButton.style.display = 'none';    // Ocultar el botón de login

        } catch (error) {
            console.error('Error al obtener los servidores:', error);
            alert('Hubo un problema al obtener los servidores.');
        }
    }

    // Al hacer clic en el botón de login
    loginButton.addEventListener('click', () => {
        const authURL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}`;
        window.location.href = authURL;
    });

    // Si hay un código en la URL, intercámbialo por un token y muestra los servidores
    if (getCodeFromUrl()) {
        fetchServers();  // Obtener los servidores si hay un código en la URL
    } else {
        // Si no hay código, mostrar el botón de login
        loginButton.style.display = 'block';
    }
});
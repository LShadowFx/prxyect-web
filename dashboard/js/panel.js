document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-discord');
    const serverListDiv = document.getElementById('server-list');
    const serversUl = serverListDiv.querySelector('ul');
    const backendUrl = 'http://localhost:3000'; 

    const CLIENT_ID = '1095478254049177741';
    const REDIRECT_URI = 'https://lshadowfx.github.io/prxyect-web/dashboard/panel.html';
    const SCOPE = 'identify guilds';

    function getCodeFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        console.log('getCodeFromUrl() - Code from URL:', code);
        return code;
    }

    async function exchangeCodeForToken(code) {
        try {
            console.log('Enviando código al backend...', code);
    
            const response = await fetch(`${backendUrl}/auth/discord/callback`, {  // Asegúrate de que esta URL sea correcta
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });
    
            console.log('Respuesta del backend:', response);
    
            // Si el servidor responde correctamente, tratamos de obtener el JSON
            const data = await response.json();
            console.log('Datos recibidos:', data);
    
            if (data.access_token) {
                return data.access_token;
            } else {
                throw new Error('No se pudo obtener el token de acceso');
            }
        } catch (error) {
            console.error('Error al procesar el código:', error);
            alert(`Error al procesar el código: ${error.message}`);
            return null;
        }
    }

    async function fetchServers() {
        const code = getCodeFromUrl();
        console.log('fetchServers() - Code from URL:', code);
        if (!code) return;

        const token = await exchangeCodeForToken(code);
        if (!token) return;

        try {
            console.log('fetchServers() - Fetching servers with token:', token);
            const response = await fetch(`${backendUrl}/get-servers?token=${token}`);
            console.log('fetchServers() - Response status:', response.status);

            if (!response.ok) throw new Error('Error al obtener servidores');

            const servers = await response.json();
            console.log('fetchServers() - Servers received:', servers);

            serversUl.innerHTML = '';
            servers.forEach(server => {
                const li = document.createElement('li');
                li.textContent = server.name;
                serversUl.appendChild(li);
            });

            serverListDiv.style.display = 'block';
            loginButton.style.display = 'none';
        } catch (error) {
            console.error('fetchServers() - Error:', error);
            alert('Error al cargar servidores.');
        }
    }

    loginButton.addEventListener('click', () => {
        console.log('loginButton - Redirecting to Discord OAuth');
        const authURL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}`;
        window.location.href = authURL;
    });

    const codeFromUrl = getCodeFromUrl();
    console.log('DOMContentLoaded - Code from URL:', codeFromUrl);
    if (codeFromUrl) fetchServers();
});
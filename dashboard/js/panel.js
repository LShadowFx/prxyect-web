document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-discord');
    const serverListDiv = document.getElementById('server-list');
    const serversUl = serverListDiv.querySelector('ul');
    const backendUrl = 'my-backend-git-main-lshadowfxs-projects.vercel.app'; 

    const CLIENT_ID = '1095478254049177741';
    const REDIRECT_URI = 'https://lshadowfx.github.io/prxyect-web/dashboard/panel.html';
    const SCOPE = 'identify guilds';

    function getCodeFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('code');
    }

    async function exchangeCodeForToken(code) {
        try {
            const response = await fetch(`${backendUrl}/auth/discord/callback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const data = await response.json();
            if (data.access_token) {
                return data.access_token;
            } else {
                throw new Error('No se pudo obtener el token de acceso');
            }
        } catch (error) {
            console.error(error);
            alert('Error al procesar el código.');
            return null;
        }
    }

    async function fetchServers() {
        const code = getCodeFromUrl();
        if (!code) return;

        const token = await exchangeCodeForToken(code);
        if (!token) return;

        try {
            const response = await fetch(`${backendUrl}/get-servers?token=${token}`);
            if (!response.ok) throw new Error('Error al obtener servidores');

            const servers = await response.json();
            serversUl.innerHTML = '';
            servers.forEach(server => {
                const li = document.createElement('li');
                li.textContent = server.name;
                serversUl.appendChild(li);
            });

            serverListDiv.style.display = 'block';
            loginButton.style.display = 'none';
        } catch (error) {
            console.error(error);
            alert('Error al cargar servidores.');
        }
    }

    loginButton.addEventListener('click', () => {
        const authURL = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPE)}`;
        window.location.href = authURL;
    });

    if (getCodeFromUrl()) fetchServers();
});
document.getElementById('login-discord').addEventListener('click', async () => {
    const clientId = '1095478254049177741';
    const redirectUri = 'https://my-backend-lshadowfxs-projects.vercel.app/login';
    const scope = 'identify guilds';

    // Redirige a Discord para iniciar la autenticación
    const authUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
    window.location.href = authUrl;
});
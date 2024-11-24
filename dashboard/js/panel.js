document.getElementById('login-discord').addEventListener('click', function () {
    window.location.href = 'https://lproyect-sv.vercel.app/login';
});

const urlParms = new URLSearchParams(window.location.search);
const token = urlParms.get('token');

if (token) {
    document.getElementById('login-discord').style.display = 'none';
    document.getElementById('login-message').style.display = 'none';

    // Fetch para obtener datos del usuario
    fetch('https://discord.com/api/v10/users/@me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(user => {
        // Mostrar datos del usuario
        const userInfo = document.getElementById('user-info');
        document.getElementById('user-avatar').src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        document.getElementById('user-welcome').innerText = `Bienvenido ${user.username}!`;
        userInfo.style.display = 'block';
    })
    .catch(error => {
        console.error('Error al obtener datos del usuario:', error);
    });

    // Fetch para obtener servidores del usuario
    fetch('https://discord.com/api/v10/users/@me/guilds', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(guilds => {
        // Mostrar lista de servidores en un menú desplegable
        const serverSelect = document.getElementById('server-select');
        guilds.forEach(guild => {
            const option = document.createElement('option');
            option.value = guild.id;
            option.textContent = guild.name;
            serverSelect.appendChild(option);
        });
        document.getElementById('server-list-container').style.display = 'block';
    })
    .catch(error => {
        console.error('Error al obtener los servidores:', error);
    });
} else {
    document.getElementById('login-discord').style.display = 'block';
}
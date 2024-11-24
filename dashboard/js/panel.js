document.getElementById('login-discord').addEventListener('click', function () {
    window.location.href = 'https://lproyect-sv.vercel.app/login';
});

const urlParms = new URLSearchParams(window.location.search);
const token = urlParms.get('token');

if (token) {
    document.getElementById('login-discord').style.display = 'none';

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
        // Mostrar lista de servidores
        const guildListElement = document.getElementById('guilds-list');
        guilds.forEach(guild => {
            const listItem = document.createElement('li');
            listItem.classList.add('guild-item');
            listItem.innerText = guild.name;
            guildListElement.appendChild(listItem);
        });
        document.getElementById('server-list').style.display = 'block';
    })
    .catch(error => {
        console.error('Error al obtener los servidores:', error);
    });
} else {
    document.getElementById('login-discord').style.display = 'block';
}
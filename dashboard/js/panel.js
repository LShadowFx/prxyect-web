document.getElementById('login-discord').addEventListener('click', function() {
    
    window.location.href = 'https://lproyect-sv.vercel.app/login';
});

const urlParms = new URLSearchParams(window.location.search);
const token = urlParms.get('token');

if (token) {
    document.getElementById('login-discord').style.display = 'none'

    fetch('https://discord.com/api/v10/users/@me/guilds', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(guilds => {
        // Mostrar los servidores del usuario
        const guildListElement = document.getElementById('guilds-list');
        guilds.forEach(guild => {
            // Crear un nuevo item de lista para cada servidor
            const listItem = document.createElement('li');
            listItem.classList.add('guild-item');
            listItem.innerText = guild.name;

            // Aquí puedes agregar más información como una imagen del servidor
            // listItem.innerHTML = `<img src="${guild.icon_url}" alt="${guild.name}">${guild.name}`;

            // Agregar el item al <ul>
            guildListElement.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Error al obtener los servidores:', error);
    });


    console.log("Usuario autenticado con el token: ", token);
} else {
    document.getElementById('login-discord').style.display = 'block';

    document.getElementById('login-discord').addEventListener('click', function() {
        window.location.href = 'https://discord.com/oauth2/authorize?client_id=1095478254049177741&response_type=code&redirect_uri=https%3A%2F%2Fmy-backend-lshadowfx-lshadowfxs-projects.vercel.app%2Flogin&scope=identify+guilds';
    });
}
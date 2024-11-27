// Crear constantes
const loginDiscord = document.getElementById('login-discord');
const loginMessage = document.getElementById('login-message');
const buttonLogin = document.getElementById('buton-login');
const logoutText = document.getElementById('log-out-text');
const logoutImg = document.getElementById('log-out-img');
const serverSelect = document.getElementById('server-select');
const displayOptions = document.getElementById('server-options');

// log in

if (loginDiscord) {
    loginDiscord.addEventListener('click', function () {
        window.location.href = 'https://lproyect-sv.vercel.app/login';
    });
}

if (buttonLogin) {
    buttonLogin.addEventListener('click', function () {
        window.location.href = 'https://lproyect-sv.vercel.app/login';
    });
}

const urlParms = new URLSearchParams(window.location.search);
const token = urlParms.get('token');

if (token) {

    loginDiscord.style.display = 'none';
    loginMessage.style.display = 'none';
    buttonLogin.style.display = 'none';
    
    serverSelect.style.display = 'block';
    logoutText.style.display = 'block';
    logoutImg.style.display = 'block';

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
    if (user.avatar) {
        
        const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
        logoutImg.src= avatarURL;
        
    } else {
            logoutImg.src = "https://cdn.discordapp.com/embed/avatars/0.png"
        }
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

        guilds.forEach(guild => {
            serverSelect.add(
                new Option(guild.name, guild.id, false)
            );
        });

        serverSelect.addEventListener('change', (event) => {

            displayOptions.style.display = 'block';
        })
        
    })
    .catch(error => {
        console.error('Error al obtener los servidores:', error);
    });

} else {
    document.getElementById('login-discord').style.display = 'block';

    if (logoutText) {
        logoutText.addEventListener('click', function () {
            const currentUrl = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, currentUrl);
        });
}};
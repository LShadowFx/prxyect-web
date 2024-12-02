window.addEventListener('load', function () {
    const urlParams = new URLSearchParams(window.location.search); 
    const token = urlParams.get('token');  
    if (token) {
        localStorage.setItem('authToken', token); 
        window.history.replaceState({}, document.title, window.location.pathname); 

        const authToken = localStorage.getItem('authToken');
        verifyAuthToken(authToken); 
    } else {
        const authToken = localStorage.getItem('authToken');
        verifyAuthToken(authToken);  
    }   
});

// Si el token existe, el usuario ya está autenticado
function verifyAuthToken(authToken) {

    const loginDiscord = document.getElementById('login-discord');
    const loginMessage = document.getElementById('login-message');
    const buttonLogin = document.getElementById('buton-login');
    const logoutText = document.getElementById('log-out-text');
    const logoutImg = document.getElementById('log-out-img');
    const serverSelect = document.getElementById('server-select');
    const displayOptions = document.getElementById('server-options');
    const musicbtn = document.getElementById('musica-btn');

    if (authToken) {
    loginDiscord.style.display = 'none';
    loginMessage.style.display = 'none';
    buttonLogin.style.display = 'none';

    // Mostrar el select de servidores y las opciones
    serverSelect.style.display = 'block';
    logoutText.style.display = 'block';
    logoutImg.style.display = 'block';

    // Fetch para obtener datos del usuario
    fetch('https://discord.com/api/v10/users/@me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => response.json())
    .then(user => {
        if (user.avatar) {
            const avatarURL = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
            logoutImg.src = avatarURL;
        } else {
            logoutImg.src = "https://cdn.discordapp.com/embed/avatars/0.png";
        }
    })
    .catch(error => {
        console.error('Error al obtener datos del usuario:', error);
    });

    // Fetch para obtener servidores del usuario

    fetch('https://discord.com/api/v10/users/@me/guilds', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => response.json())
    .then(async guilds => {


        for (const guild of guilds) {
            const botInSV = await checkBotInServer(guild.id);
            if (botInSV) {
                serverSelect.add(new Option(guild.name, guild.id));
            }
        }

        function enableOption(button) {
            button.disabled = false;
            button.classList.remove('disabled');
        }
        
        serverSelect.addEventListener('change', async (event) => {
            const serverId = event.target.value;
        
            const botInSV = await checkBotInServer(serverId);

            if (botInSV) {
                enableOption(musicbtn);
            } else {
                musicbtn.disabled = true;
                alert('El bot no esta en el servidor seleccionado.')
            }
        
            displayOptions.style.display = 'block';
        });

    })
    .catch(error => {
        console.error('Error al obtener los servidores:', error);
    });

    if (musicbtn) {
        musicbtn.addEventListener('click', function () {
            window.location.href = '../../views/boardmusic/player.html';  // Redirige al reproductor de música
        });
    }

    if (logoutText) {
        logoutText.addEventListener('click', function () {
            localStorage.removeItem('authToken'); // Eliminar el token
            window.location.href = 'https://lproyect-sv.vercel.app/logout';  // Redirigir al login
        });
    }
} else { 

    loginDiscord.style.display = 'block';
    loginMessage.style.display = 'block';
    buttonLogin.style.display = 'block';

    serverSelect.style.display = 'none';
    logoutText.style.display = 'none';
    logoutImg.style.display = 'none';

    if (loginDiscord) {
    loginDiscord.addEventListener('click', function () {

        window.location.href = 'https://lproyect-sv.vercel.app/login' // cambiar luego de actualizar
    })
}

    if (buttonLogin) {
        buttonLogin.addEventListener('click', function () {
            window.location.href = 'https://lproyect-sv.vercel.app/login'
        })
    }}
}

async function checkBotInServer(serverId) {
    try {
        const response = await fetch(`https://lproyect-sv.vercel.app/api/check-bot/${serverId}`);
        
        
        const data = await response.json();
        return data.botInServer;
    } catch (error) {
        console.error('Error al verificar si el bot está en el servidor:', error);
        return false;
    }
}
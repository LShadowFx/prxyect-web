document.getElementById('login-discord').addEventListener('click', function() {
    
    window.location.href = 'https://my-backend-lshadowfx-lshadowfxs-projects.vercel.app/login';
});

const urlParms = new URLSearchParams(window.location.search);
const token = urlParms.get('token');

if (token) {
    document.getElementById('login-discord').style.display = 'none'

    console.log("Usuario autenticado con el token: ", token);
} else {
    document.getElementById('login-discord').style.display = 'block';

    document.getElementById('login-discord').addEventListener('click', function() {
        window.location.href = 'https://my-backend-lshadowfx-lshadowfxs-projects.vercel.app/login';
    });
}
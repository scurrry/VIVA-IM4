document.addEventListener('DOMContentLoaded', async () => {
  const modal = document.getElementById('login-modal');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const showRegister = document.getElementById('show-register');
  const showLogin = document.getElementById('show-login');

  try {
    const res = await fetch('api/protected.php', {
      credentials: 'include' // 🔥 DAS IST ENTSCHEIDEND
    });
    const userData = await res.json();

    if (res.status === 200 && userData.user_id) {
      modal.remove(); // 🔓 Modal komplett entfernen
      startApp(userData.user_id);
    } else {
      modal.style.display = 'block';
    }
  } catch (err) {
    console.error('Fehler bei Session-Check:', err);
    modal.style.display = 'block';
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();

    try {
      const resp = await fetch('api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include', // 🟢 SESSION-Cookies MITSENDEN
        body: new URLSearchParams({ email, password })
      });

      const data = await resp.json();

      if (data.status === 'success') {
        modal.remove(); // 🟢 Modal schließen
        startApp(data.user_id); // 🟢 App starten
      } else {
        alert(data.message || 'Login fehlgeschlagen');
      }
    } catch (err) {
      console.error(err);
      alert('Fehler beim Login');
    }
  });

  showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  });

  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    try {
      const resp = await fetch('api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        credentials: 'include',
        body: new URLSearchParams({ email, password })
      });
      const data = await resp.json();

      if (data.status === 'success') {
        alert('Registrierung erfolgreich. Du kannst dich nun einloggen.');
        registerForm.reset();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
      } else {
        alert(data.message || 'Registrierung fehlgeschlagen');
      }
    } catch (err) {
      console.error(err);
      alert('Fehler bei der Registrierung');
    }
  });
});

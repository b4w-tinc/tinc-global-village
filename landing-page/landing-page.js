const loaderOverlay = document.getElementById('loaderOverlay');

// === BACK/FORWARD NAVIGATION FIX ===
if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
    loaderOverlay.classList.remove('active'); // hide loader immediately
}

// === BUTTON-CLICK LOADER ===
function attachButtonLoader(id, targetPage) {
    const btn = document.getElementById(id);
    if (!btn) return;

    btn.addEventListener('click', event => {
        event.preventDefault();
        loaderOverlay.classList.add('active'); // show loader
        setTimeout(() => {
            window.location.href = targetPage; // navigate after short delay
        }, 500);
    });
}

// Attach loader to Sign Up and Log In buttons
attachButtonLoader('goToSignup', '../sign-up/sign-up.html');
attachButtonLoader('goToLogin', '../log-in/log-in.html');

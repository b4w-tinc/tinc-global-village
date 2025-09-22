const loaderOverlay = document.getElementById('loaderOverlay');

document.getElementById('goToSignup')?.addEventListener('click', event => {
    event.preventDefault();
    loaderOverlay.classList.add('active');
    setTimeout(() => window.location.href = './sign-up.html', 500);
});

document.getElementById('goToLogin')?.addEventListener('click', event => {
    event.preventDefault();
    loaderOverlay.classList.add('active');
    setTimeout(() => window.location.href = './log-in.html', 500);
});

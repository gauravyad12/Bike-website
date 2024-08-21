function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function applyDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    applyDarkMode();
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});
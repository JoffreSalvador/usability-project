document.addEventListener('DOMContentLoaded', () => {
    const authArea = document.getElementById('authArea');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!authArea) return;

    if (user) {
        authArea.innerHTML = `
        <div class="user-info">
            <span class="user-icon">👤</span>
            <span class="user-name">${user.name}</span>
            <button id="logoutBtn" class="btn-outline">Logout</button>
        </div>
        `;

        document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'dashboard.html';
        });
    }
});
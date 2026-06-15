// Check authentication
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = './auth.html';
        return;
    }
    
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('sidebar-username').textContent = user.username || 'User';
    document.getElementById('sidebar-tier').textContent = user.tier || 'member';
});

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show selected page
        const pageName = link.getAttribute('data-page');
        const page = document.getElementById(`page-${pageName}`);
        if (page) {
            page.classList.add('active');
            document.getElementById('page-title').textContent = link.textContent.trim();
        }
    });
});

// Logout
document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './auth.html';
});

// Bot Controls
document.getElementById('btn-start').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/bot/start', { method: 'POST' });
        const data = await response.json();
        alert(data.message || 'Bot started');
        updateBotStatus();
    } catch (e) {
        alert('Error starting bot');
    }
});

document.getElementById('btn-stop').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/bot/stop', { method: 'POST' });
        const data = await response.json();
        alert(data.message || 'Bot stopped');
        updateBotStatus();
    } catch (e) {
        alert('Error stopping bot');
    }
});

document.getElementById('btn-restart').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/bot/restart', { method: 'POST' });
        const data = await response.json();
        alert(data.message || 'Bot restarted');
        updateBotStatus();
    } catch (e) {
        alert('Error restarting bot');
    }
});

// System Info
async function loadSystemInfo() {
    try {
        const response = await fetch('/api/system/status');
        const data = await response.json();
        document.getElementById('os-info').textContent = data.osInfo || 'Unknown';
    } catch (e) {
        console.error('[v0] Error loading system info:', e);
    }
}

async function updateBotStatus() {
    try {
        const response = await fetch('/api/bot/status');
        const data = await response.json();
        document.getElementById('bot-status').textContent = data.running ? 'Chạy' : 'Tắt';
    } catch (e) {
        console.error('[v0] Error updating bot status:', e);
    }
}

// Clear Cache
document.getElementById('btn-clear-cache').addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn xóa cache? Dữ liệu sẽ được khôi phục lại.')) {
        localStorage.clear();
        sessionStorage.clear();
        alert('Cache đã xóa');
        window.location.href = './auth.html';
    }
});

// Load initial data
loadSystemInfo();
updateBotStatus();

// Refresh status every 10 seconds
setInterval(updateBotStatus, 10000);

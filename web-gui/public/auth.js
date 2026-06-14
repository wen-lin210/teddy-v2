function switchForm(formType) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (formType === 'signup') {
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
    } else {
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
    }
    
    clearMessages();
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
}

function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.classList.add('active');
}

function clearMessages() {
    document.getElementById('error-message').classList.remove('active');
    document.getElementById('success-message').classList.remove('active');
}

// Login form
document.getElementById('login-fields').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = e.target.querySelector('.btn-submit');

    btn.disabled = true;
    btn.textContent = 'Đang xử lý...';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.error || 'Đăng nhập thất bại');
            return;
        }

        // Save token and redirect
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);

    } catch (error) {
        showError('Lỗi kết nối. Vui lòng thử lại.');
        console.error('[v0] Login error:', error);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Đăng Nhập';
    }
});

// Signup form
document.getElementById('signup-fields').addEventListener('submit', async (e) => {
    e.preventDefault();
    clearMessages();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const btn = e.target.querySelector('.btn-submit');

    // Validate
    if (password !== confirm) {
        showError('Mật khẩu không khớp');
        return;
    }

    if (password.length < 6) {
        showError('Mật khẩu phải ít nhất 6 ký tự');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Đang tạo...';

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username })
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.error || 'Đăng ký thất bại');
            return;
        }

        // Save token and redirect
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showSuccess('Đăng ký thành công! Đang chuyển hướng...');
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);

    } catch (error) {
        showError('Lỗi kết nối. Vui lòng thử lại.');
        console.error('[v0] Signup error:', error);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Tạo Tài Khoản';
    }
});

// Check if already logged in
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/dashboard.html';
    }
});

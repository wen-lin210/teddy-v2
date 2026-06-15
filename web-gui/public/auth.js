// Switch between login and signup forms
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

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('active');
    }
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.add('active');
    }
}

// Clear messages
function clearMessages() {
    const errorDiv = document.getElementById('error-message');
    const successDiv = document.getElementById('success-message');
    if (errorDiv) errorDiv.classList.remove('active');
    if (successDiv) successDiv.classList.remove('active');
}

// Handle login submission
async function handleLoginSubmit(e) {
    e.preventDefault();
    clearMessages();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = e.target.querySelector('.btn-submit');

    if (!email || !password) {
        showError('Vui lòng nhập email và mật khẩu');
        return;
    }

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
            btn.disabled = false;
            btn.textContent = 'Đăng Nhập';
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
            window.location.href = './dashboard.html';
        }, 1500);

    } catch (error) {
        showError('Lỗi kết nối: ' + error.message);
        console.error('[v0] Login error:', error);
        btn.disabled = false;
        btn.textContent = 'Đăng Nhập';
    }
}

// Handle signup submission
async function handleSignupSubmit(e) {
    e.preventDefault();
    clearMessages();

    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    const btn = e.target.querySelector('.btn-submit');

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showError('Vui lòng điền tất cả các trường');
        return;
    }

    if (password !== confirmPassword) {
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
            btn.disabled = false;
            btn.textContent = 'Tạo Tài Khoản';
            return;
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showSuccess('Đăng ký thành công! Đang chuyển hướng...');
        setTimeout(() => {
            window.location.href = './dashboard.html';
        }, 1500);

    } catch (error) {
        showError('Lỗi kết nối: ' + error.message);
        console.error('[v0] Signup error:', error);
        btn.disabled = false;
        btn.textContent = 'Tạo Tài Khoản';
    }
}

// Initialize when DOM is ready
function initializeAuth() {
    // Get forms
    const loginForm = document.getElementById('login-fields');
    const signupForm = document.getElementById('signup-fields');

    // Attach event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
        console.log('[v0] Login form listener attached');
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
        console.log('[v0] Signup form listener attached');
    }

    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = './dashboard.html';
    }
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}

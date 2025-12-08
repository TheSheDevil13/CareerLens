// Login functionality for Career Lens

// Hardcoded credentials
const HARDCODED_CREDENTIALS = {
    username: 'user',
    password: '123'
};

// Session configuration
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const APP_VERSION = '1.0.0'; // Increment this to force logout on all users

class LoginManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Check if already logged in
        if (this.isLoggedIn()) {
            this.redirectToDashboard();
            return;
        }
        
        // Initialize form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Focus on username field
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.focus();
        }
    }
    
    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        // Hide error message
        if (errorMessage) {
            errorMessage.classList.remove('show');
        }
        
        // Validate credentials
        if (username === HARDCODED_CREDENTIALS.username && password === HARDCODED_CREDENTIALS.password) {
            // Successful login
            this.setLoggedIn(true);
            this.redirectToDashboard();
        } else {
            // Show error message
            if (errorMessage && errorText) {
                errorText.textContent = 'Invalid username or password. Please check the credentials above.';
                errorMessage.classList.add('show');
            }
            
            // Shake animation
            const loginCard = document.querySelector('.login-card');
            if (loginCard) {
                loginCard.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    loginCard.style.animation = '';
                }, 500);
            }
        }
    }
    
    setLoggedIn(status) {
        if (status) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loginTime', Date.now().toString());
            localStorage.setItem('appVersion', APP_VERSION);
        } else {
            this.clearLoginData();
        }
    }
    
    clearLoginData() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('loginTime');
    }
    
    isLoggedIn() {
        // Check version first - if version changed, clear old data
        const storedVersion = localStorage.getItem('appVersion');
        if (storedVersion !== APP_VERSION) {
            this.clearLoginData();
            localStorage.setItem('appVersion', APP_VERSION);
            return false;
        }
        
        // Check if login flag exists
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            return false;
        }
        
        // Check session expiration
        const loginTime = localStorage.getItem('loginTime');
        if (!loginTime) {
            this.clearLoginData();
            return false;
        }
        
        const now = Date.now();
        const timeSinceLogin = now - parseInt(loginTime, 10);
        
        // If session expired, clear login data
        if (timeSinceLogin > SESSION_DURATION) {
            this.clearLoginData();
            return false;
        }
        
        return true;
    }
    
    redirectToDashboard() {
        // Redirect to index.html
        const currentPath = window.location.pathname;
        const basePath = currentPath.includes('pages/') ? '../' : '';
        window.location.href = `${basePath}index.html`;
    }
    
    static logout() {
        const loginManager = new LoginManager();
        loginManager.clearLoginData();
        // Determine correct path to login based on current location
        const currentPath = window.location.pathname;
        const basePath = currentPath.includes('pages/') ? '../' : '';
        window.location.href = `${basePath}login.html`;
    }
    
    static checkAuth() {
        // Create a temporary instance to use isLoggedIn method
        const loginManager = new LoginManager();
        const isLoggedIn = loginManager.isLoggedIn();
        const currentPath = window.location.pathname;
        const currentHref = window.location.href;
        const isLoginPage = currentPath.includes('login.html') || currentHref.includes('login.html');
        
        // If not on login page and not logged in, redirect to login
        if (!isLoginPage && !isLoggedIn) {
            // Determine correct path to login
            const basePath = currentPath.includes('pages/') ? '../' : '';
            window.location.href = `${basePath}login.html`;
            return false;
        }
        
        // If on login page and already logged in, redirect to dashboard
        if (isLoginPage && isLoggedIn) {
            const basePath = currentPath.includes('pages/') ? '' : '../';
            window.location.href = `${basePath}pages/dashboard.html`;
            return false;
        }
        
        return true;
    }
}

// Initialize login manager
if (document.getElementById('loginForm')) {
    new LoginManager();
}

// Add shake animation to CSS
if (!document.getElementById('loginShakeStyle')) {
    const style = document.createElement('style');
    style.id = 'loginShakeStyle';
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
}

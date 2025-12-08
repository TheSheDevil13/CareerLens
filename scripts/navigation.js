// Minimal Navigation for Dashboard - Only Home button
function createDashboardNavigation() {
    const basePath = '../';
    
    return `
        <nav class="navbar navbar-expand-lg navbar-dark glass-nav fixed-top dashboard-navbar">
            <div class="container">
                <a class="navbar-brand" href="${basePath}index.html">
                    <div class="brand-logo">
                        <i class="fas fa-binoculars"></i>
                        <span>Career<span class="gradient-text">Lens</span></span>
                    </div>
                </a>
                
                <div class="d-flex align-items-center">
                    <a href="${basePath}index.html" class="btn btn-gradient btn-sm">
                        <i class="fas fa-home me-1"></i>
                        Home
                    </a>
                </div>
            </div>
        </nav>
    `;
}

// Standard Navigation Component - Used across all pages
function createStandardNavigation(currentPage = '') {
    const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    const basePath = isHomePage ? '' : '../';
    
    const navItems = [
        { text: 'Home', href: isHomePage ? '#' : `${basePath}index.html`, id: 'home' },
        { text: 'Career Paths', href: `${basePath}pages/career-paths.html`, id: 'career-paths' },
        { text: 'Job Portal', href: `${basePath}pages/job-portal.html`, id: 'job-portal' },
        { text: 'Courses', href: `${basePath}pages/courses.html`, id: 'courses' },
        {
            text: 'Tools',
            id: 'tools',
            dropdown: [
                { text: 'Salary Estimator', href: `${basePath}pages/salary-estimator.html` },
                { text: 'CV Builder', href: `${basePath}pages/cv-builder.html` }
            ]
        },
    ];
    
    let navHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark glass-nav fixed-top">
            <div class="container">
                <a class="navbar-brand" href="${basePath}index.html">
                    <div class="brand-logo">
                        <i class="fas fa-binoculars"></i>
                        <span>Career<span class="gradient-text">Lens</span></span>
                    </div>
                </a>
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="mainNav">
                    <ul class="navbar-nav mx-auto">
    `;
    
    navItems.forEach(item => {
        if (item.dropdown) {
            navHTML += `
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle ${currentPage === item.id ? 'active' : ''}" href="#" id="toolsDropdown" role="button" data-bs-toggle="dropdown">
                                ${item.text}
                            </a>
                            <ul class="dropdown-menu">
            `;
            item.dropdown.forEach(dropItem => {
                navHTML += `<li><a class="dropdown-item" href="${dropItem.href}">${dropItem.text}</a></li>`;
            });
            navHTML += `
                            </ul>
                        </li>
            `;
        } else {
            const activeClass = currentPage === item.id ? 'active' : '';
            navHTML += `
                        <li class="nav-item">
                            <a class="nav-link ${activeClass}" href="${item.href}">${item.text}</a>
                        </li>
            `;
        }
    });
    
    navHTML += `
                    </ul>
                    
                    <div class="d-flex gap-2">
                        <a href="${basePath}pages/dashboard.html" class="btn btn-gradient">My Profile</a>
                        <button id="logoutBtn" class="btn btn-outline-danger">
                            <i class="fas fa-sign-out-alt me-1"></i>Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    return navHTML;
}

// Auto-inject navigation if nav element doesn't exist or is empty
function initNavigation() {
    const existingNav = document.querySelector('nav.navbar');
    // Determine current page
    const path = window.location.pathname;
    let currentPage = '';
    const isDashboard = path.includes('dashboard');
    
    if (path.includes('career-paths')) currentPage = 'career-paths';
    else if (path.includes('job-portal')) currentPage = 'job-portal';
    else if (path.includes('courses')) currentPage = 'courses';
    else if (isDashboard) currentPage = 'dashboard';
    else if (path.includes('salary-estimator')) currentPage = 'tools';
    else if (path.includes('interview-prep')) currentPage = 'tools';
    else if (path.includes('skill-assessment')) currentPage = 'tools';
    else if (path.includes('cv-builder')) currentPage = 'tools';
    else if (path === '/' || path.endsWith('index.html')) currentPage = 'home';
    
    // Use minimal navigation for dashboard, standard for other pages
    const navHTML = isDashboard ? createDashboardNavigation() : createStandardNavigation(currentPage);
    
    if (existingNav) {
        existingNav.outerHTML = navHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
    
    // Re-initialize Bootstrap dropdowns and collapse after navbar injection (only if not dashboard)
    if (typeof bootstrap !== 'undefined' && !isDashboard) {
        // Initialize dropdowns
        const dropdowns = document.querySelectorAll('.dropdown-toggle');
        dropdowns.forEach(dropdown => {
            new bootstrap.Dropdown(dropdown);
        });
        
        // Initialize collapse
        const collapseElements = document.querySelectorAll('[data-bs-toggle="collapse"]');
        collapseElements.forEach(element => {
            const target = element.getAttribute('data-bs-target');
            if (target) {
                const collapseElement = document.querySelector(target);
                if (collapseElement) {
                    new bootstrap.Collapse(collapseElement, { toggle: false });
                }
            }
        });
    }
    
    // Add logout button event listener
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const performLogout = () => {
                if (confirm('Are you sure you want to logout?')) {
                    if (typeof LoginManager !== 'undefined') {
                        LoginManager.logout();
                    } else {
                        // Clear localStorage and redirect manually
                        localStorage.removeItem('isLoggedIn');
                        localStorage.removeItem('loginTime');
                        const currentPath = window.location.pathname;
                        const basePath = currentPath.includes('pages/') ? '../' : '';
                        window.location.href = `${basePath}login.html`;
                    }
                }
            };
            
            // Try to load login.js if LoginManager is not available
            if (typeof LoginManager === 'undefined') {
                const script = document.createElement('script');
                const isInPages = window.location.pathname.includes('pages/');
                script.src = isInPages ? '../scripts/login.js' : 'scripts/login.js';
                script.onload = performLogout;
                script.onerror = performLogout; // Fallback to manual logout if script fails to load
                document.head.appendChild(script);
            } else {
                performLogout();
            }
        });
    }
}

// Run immediately when script loads
// Since script is at end of body, DOM is ready
(function() {
    // Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
    function runInit() {
        initNavigation();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInit);
    } else {
        // DOM already loaded - run immediately
        runInit();
    }
})();


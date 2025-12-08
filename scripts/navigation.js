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
                { text: 'Interview Prep', href: `${basePath}pages/interview-prep.html` },
                { text: 'Skill Assessment', href: `${basePath}pages/skill-assessment.html` },
                { text: 'CV Builder', href: `${basePath}pages/cv-builder.html` }
            ]
        },
        { text: 'Dashboard', href: `${basePath}pages/dashboard.html`, id: 'dashboard' }
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
                        <a href="${basePath}pages/dashboard.html" class="btn btn-gradient">Dashboard</a>
                        ${isHomePage ? '<a href="#department-selector" class="btn btn-outline-light">Get Started</a>' : ''}
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    return navHTML;
}

// Auto-inject navigation if nav element doesn't exist or is empty
document.addEventListener('DOMContentLoaded', () => {
    const existingNav = document.querySelector('nav.navbar');
    if (!existingNav || !existingNav.querySelector('.navbar-collapse')) {
        // Determine current page
        const path = window.location.pathname;
        let currentPage = '';
        
        if (path.includes('career-paths')) currentPage = 'career-paths';
        else if (path.includes('job-portal')) currentPage = 'job-portal';
        else if (path.includes('courses')) currentPage = 'courses';
        else if (path.includes('dashboard')) currentPage = 'dashboard';
        else if (path.includes('salary-estimator')) currentPage = 'tools';
        else if (path.includes('interview-prep')) currentPage = 'tools';
        else if (path.includes('skill-assessment')) currentPage = 'tools';
        else if (path.includes('cv-builder')) currentPage = 'tools';
        else if (path === '/' || path.endsWith('index.html')) currentPage = 'home';
        
        const navHTML = createStandardNavigation(currentPage);
        
        if (existingNav) {
            existingNav.outerHTML = navHTML;
        } else {
            document.body.insertAdjacentHTML('afterbegin', navHTML);
        }
    }
});


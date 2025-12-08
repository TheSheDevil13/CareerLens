// Career Lens Main Application - Home Page

class CareerLensApp {
    constructor() {
        this.currentTheme = 'light';
        this.userData = JSON.parse(localStorage.getItem('careerLensUser')) || this.createDefaultUser();
        this.currentSection = '';
        this.init();
    }

    init() {
        // Wait for DOM and data to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.initTheme();
        this.initNavigation();
        this.initCounters();
        this.initTypewriter();
        // Department grid moved to career-paths page
        // Only initialize if departmentGrid exists on this page
        if (document.getElementById('departmentGrid')) {
            this.initDepartmentGrid();
        }
        // Skip AI chatbot for now - will optimize later
        // this.initAI();
        this.init3DVisualization();
        // Comparison tool moved to career-paths page
        // this.initComparisons();
        this.initEventListeners();
        this.loadUserProgress();
    }

    // ==================== THEME MANAGEMENT ====================
    initTheme() {
        // Theme is now managed by theme-manager.js
        // Sync currentTheme with theme manager
        if (window.themeManager) {
            this.currentTheme = window.themeManager.currentTheme;
        } else {
            // Fallback if theme manager not loaded
            const savedTheme = localStorage.getItem('theme');
            this.currentTheme = savedTheme || 'light';
        }
    }

    applyTheme() {
        // Theme is managed by theme-manager.js
        // This method is kept for compatibility but delegates to theme manager
        if (window.themeManager) {
            this.currentTheme = window.themeManager.currentTheme;
        }
        
        // Update Three.js scene colors based on theme
        if (window.threeScene) {
            window.threeScene.updateTheme(this.currentTheme);
        }
    }

    // ==================== NAVIGATION ====================
    initNavigation() {
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href !== '#' && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const target = document.getElementById(targetId);
                    
                    if (target) {
                        // Close mobile menu if open
                        const navbarCollapse = document.getElementById('mainNav');
                        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                            if (bsCollapse) bsCollapse.hide();
                        }
                        
                        // Smooth scroll
                        const offset = 80; // Account for fixed navbar
                        const targetPosition = target.offsetTop - offset;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Update active nav item
                        this.updateActiveNavItem(targetId);
                    }
                }
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavOnScroll();
        });

        // Navbar brand click - scroll to top
        const navbarBrand = document.querySelector('.navbar-brand');
        if (navbarBrand) {
            navbarBrand.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    updateActiveNavItem(sectionId) {
        // Map section IDs to nav links
        const sectionMap = {
            'features': '#features',
            'department-selector': '#departments',
            'departments': '#departments',
            'ai-coach': '#ai-coach',
            'success-stories': '#success-stories',
            'path-comparison': '#path-comparison'
        };

        // Remove active class from all nav links
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to matching link
        const matchingLink = document.querySelector(`.navbar-nav .nav-link[href="${sectionMap[sectionId] || '#' + sectionId}"]`);
        if (matchingLink) {
            matchingLink.classList.add('active');
        }
    }

    updateActiveNavOnScroll() {
        const sections = ['features', 'department-selector', 'ai-coach', 'success-stories', 'path-comparison'];
        const scrollPos = window.scrollY + 100;

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                
                if (scrollPos >= top && scrollPos < bottom) {
                    this.updateActiveNavItem(sectionId);
                }
            }
        });
    }

    // ==================== COUNTERS ====================
    initCounters() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            if (isNaN(target)) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        this.animateCounter(counter, target);
                        observer.unobserve(counter);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(counter);
        });
    }

    animateCounter(counter, target) {
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }

    // ==================== TYPEWRITER ====================
    initTypewriter() {
        const typewriter = document.querySelector('.typewriter');
        if (!typewriter) return;

        const texts = JSON.parse(typewriter.dataset.text || '[]');
        if (texts.length === 0) return;

        let index = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentText = texts[index];
            
            if (isDeleting) {
                typewriter.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriter.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                index = (index + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, isDeleting ? 50 : 100);
            }
        };

        setTimeout(type, 1000);
    }

    // ==================== DEPARTMENT GRID ====================
    initDepartmentGrid() {
        const grid = document.getElementById('departmentGrid');
        if (!grid) return;
        
        // Wait for appData to be available
        const loadDepartments = () => {
            if (window.appData && window.appData.departments) {
                this.renderDepartments(window.appData.departments);
                this.initDepartmentFilters();
            } else {
                setTimeout(loadDepartments, 100);
            }
        };
        
        if (window.appData && window.appData.departments) {
            loadDepartments();
        } else {
            window.addEventListener('appDataLoaded', loadDepartments);
            loadDepartments();
        }
    }
    
    initDepartmentFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('departmentSearch');
        const departments = window.appData?.departments || [];
        
        if (departments.length === 0) {
            const grid = document.getElementById('departmentGrid');
            if (grid) {
                grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No departments available.</p></div>';
            }
            return;
        }
        
        // Filter functionality
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                const filtered = filter === 'all' 
                    ? departments 
                    : departments.filter(dept => dept.category === filter);
                
                this.renderDepartments(filtered);
            });
        });
        
        // Search functionality
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const query = e.target.value.toLowerCase();
                    const filtered = departments.filter(dept => 
                        dept.name.toLowerCase().includes(query) ||
                        dept.description.toLowerCase().includes(query) ||
                        dept.careerPaths.some(path => path.title.toLowerCase().includes(query))
                    );
                    this.renderDepartments(filtered);
                }, 300);
            });
        }
        
        // Load More button
        const loadMoreBtn = document.getElementById('loadMoreDepartments');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.showNotification('All departments are displayed!', 'info');
            });
        }
    }

    renderDepartments(departments) {
        const grid = document.getElementById('departmentGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        if (!departments || departments.length === 0) {
            grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No departments found matching your criteria.</p></div>';
            return;
        }
        
        departments.forEach(dept => {
            const card = this.createDepartmentCard(dept);
            grid.appendChild(card);
        });
    }

    createDepartmentCard(department) {
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 mb-4';
        
        const dept = {
            id: department.id || 0,
            name: department.name || 'Unknown Department',
            description: department.description || 'No description available',
            color: department.color || '#4A00E0',
            icon: department.icon || 'fas fa-graduation-cap',
            demandScore: department.demandScore || 0,
            avgEntrySalary: department.avgEntrySalary || 'N/A',
            careerPaths: department.careerPaths || []
        };
        
        card.innerHTML = `
            <div class="department-card-3d" data-dept-id="${dept.id}">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="card-icon" style="color: ${dept.color}">
                            <i class="${dept.icon} fa-3x"></i>
                        </div>
                        <h4>${dept.name}</h4>
                        <p class="text-muted">${dept.description.length > 80 ? dept.description.substring(0, 80) + '...' : dept.description}</p>
                        
                        <div class="department-stats">
                            <div class="stat">
                                <i class="fas fa-chart-line"></i>
                                <span>Demand: ${dept.demandScore}/100</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-dollar-sign"></i>
                                <span>${dept.avgEntrySalary}</span>
                            </div>
                        </div>
                        
                        <div class="card-tags">
                            ${dept.careerPaths.length > 0 
                                ? dept.careerPaths.slice(0, 2).map(path => 
                                    `<span class="tag">${path.title || 'Career Path'}</span>`
                                ).join('')
                                : '<span class="tag">Coming Soon</span>'
                            }
                        </div>
                        <button class="btn btn-sm btn-gradient explore-btn-front" 
                                onclick="window.app.exploreDepartment(${dept.id})">
                            <i class="fas fa-arrow-right me-2"></i>Explore Details
                        </button>
                    </div>
                    
                    <div class="card-back">
                        <h5>Career Paths</h5>
                        ${dept.careerPaths.length > 0 
                            ? `<ul>
                                ${dept.careerPaths.slice(0, 3).map(path => 
                                    `<li>${path.title || 'Career Path'}</li>`
                                ).join('')}
                                ${dept.careerPaths.length > 3 ? '<li class="text-muted small">+ ' + (dept.careerPaths.length - 3) + ' more</li>' : ''}
                            </ul>`
                            : '<p class="text-muted">No career paths available yet.</p>'
                        }
                        <button class="btn btn-sm btn-gradient explore-btn" 
                                onclick="window.app.exploreDepartment(${dept.id})">
                            <i class="fas fa-arrow-right me-2"></i>Explore Details
                        </button>
                    </div>
                </div>
                <div class="card-glow" style="background: ${dept.color}"></div>
            </div>
        `;
        
        // Add 3D hover effect
        card.addEventListener('mousemove', this.handleCard3DEffect.bind(this));
        card.addEventListener('mouseleave', this.resetCard3DEffect.bind(this));
        
        return card;
    }

    handleCard3DEffect(e) {
        const card = e.currentTarget;
        const cardInner = card.querySelector('.card-inner');
        const glow = card.querySelector('.card-glow');
        if (!cardInner) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10;
        
        cardInner.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(20px)`;
        
        if (glow) {
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
            glow.style.opacity = '0.3';
        }
    }

    resetCard3DEffect(e) {
        const card = e.currentTarget;
        const cardInner = card.querySelector('.card-inner');
        const glow = card.querySelector('.card-glow');
        
        if (cardInner) {
            cardInner.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
        }
        if (glow) {
            glow.style.opacity = '0';
        }
    }

    exploreDepartment(deptId) {
        window.location.href = `pages/career-paths.html?department=${deptId}`;
    }

    // ==================== 3D VISUALIZATION ====================
    init3DVisualization() {
        const container = document.getElementById('careerVisualization3D');
        if (!container || typeof THREE === 'undefined') return;
        
        // Wait for threejs-visualization.js to initialize
        setTimeout(() => {
            if (window.threeScene) {
                window.threeScene.updateTheme(this.currentTheme);
                this.init3DControls();
            }
        }, 500);
    }
    
    init3DControls() {
        const rotateBtn = document.getElementById('rotateView');
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        
        if (rotateBtn && window.threeScene?.camera) {
            rotateBtn.addEventListener('click', () => {
                if (window.threeScene.camera) {
                    const angle = Math.PI / 4;
                    const radius = Math.sqrt(
                        Math.pow(window.threeScene.camera.position.x, 2) +
                        Math.pow(window.threeScene.camera.position.y, 2) +
                        Math.pow(window.threeScene.camera.position.z, 2)
                    );
                    const currentAngle = Math.atan2(window.threeScene.camera.position.y, window.threeScene.camera.position.x);
                    const newAngle = currentAngle + angle;
                    
                    window.threeScene.camera.position.x = Math.cos(newAngle) * radius * 0.7;
                    window.threeScene.camera.position.y = Math.sin(newAngle) * radius * 0.7;
                    window.threeScene.camera.lookAt(0, 0, 0);
                }
            });
        }
        
        if (zoomInBtn && window.threeScene?.camera) {
            zoomInBtn.addEventListener('click', () => {
                if (window.threeScene.camera) {
                    window.threeScene.camera.position.z = Math.max(10, window.threeScene.camera.position.z - 5);
                }
            });
        }
        
        if (zoomOutBtn && window.threeScene?.camera) {
            zoomOutBtn.addEventListener('click', () => {
                if (window.threeScene.camera) {
                    window.threeScene.camera.position.z = Math.min(50, window.threeScene.camera.position.z + 5);
                }
            });
        }
    }

    // ==================== CAREER PATH COMPARISON ====================
    initComparisons() {
        const pathASelect = document.getElementById('pathASelect');
        const pathBSelect = document.getElementById('pathBSelect');
        
        if (!pathASelect || !pathBSelect) return;

        // Wait for appData
        const loadComparisons = () => {
            if (window.appData && window.appData.departments) {
                this.populateComparisonDropdowns();
                this.initComparisonChart();
            } else {
                setTimeout(loadComparisons, 100);
            }
        };

        if (window.appData && window.appData.departments) {
            loadComparisons();
        } else {
            window.addEventListener('appDataLoaded', loadComparisons);
            loadComparisons();
        }
    }

    populateComparisonDropdowns() {
        const pathASelect = document.getElementById('pathASelect');
        const pathBSelect = document.getElementById('pathBSelect');
        const departments = window.appData?.departments || [];

        if (!pathASelect || !pathBSelect || departments.length === 0) return;

        // Clear existing options (except first)
        pathASelect.innerHTML = '<option value="">Choose a career path</option>';
        pathBSelect.innerHTML = '<option value="">Choose a career path</option>';

        departments.forEach(dept => {
            dept.careerPaths.forEach(path => {
                const optionA = document.createElement('option');
                optionA.value = path.id;
                optionA.textContent = `${dept.name} - ${path.title}`;
                
                const optionB = optionA.cloneNode(true);
                pathASelect.appendChild(optionA);
                pathBSelect.appendChild(optionB);
            });
        });

        // Add change listeners
        pathASelect.addEventListener('change', (e) => this.updateComparison('A', e.target.value));
        pathBSelect.addEventListener('change', (e) => this.updateComparison('B', e.target.value));
    }

    updateComparison(side, pathId) {
        if (!pathId) {
            const container = document.getElementById(`path${side}Details`);
            if (container) container.innerHTML = '<p class="text-muted">Select a career path to see details.</p>';
            return;
        }

        const path = this.findCareerPathById(pathId);
        const container = document.getElementById(`path${side}Details`);
        
        if (!path || !container) return;
        
        container.innerHTML = `
            <h5>${path.title}</h5>
            <p>${path.description}</p>
            
            <div class="comparison-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <small>Time to Hire</small>
                        <strong>${path.timeToHire || 'N/A'}</strong>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-dollar-sign"></i>
                    <div>
                        <small>Entry Salary</small>
                        <strong>${path.salaryRange?.entry || 'N/A'}</strong>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-chart-line"></i>
                    <div>
                        <small>Senior Salary</small>
                        <strong>${path.salaryRange?.senior || 'N/A'}</strong>
                    </div>
                </div>
            </div>
            
            ${path.skills && path.skills.length > 0 ? `
                <h6 class="mt-3">Top Skills Required:</h6>
                <div class="skill-tags">
                    ${path.skills.slice(0, 5).map(skill => 
                        `<span class="skill-tag">${skill.name || skill}</span>`
                    ).join('')}
                </div>
            ` : ''}
        `;
        
        this.updateComparisonChart();
    }

    initComparisonChart() {
        const canvas = document.getElementById('comparisonChart');
        if (!canvas) return;
        
        // Wait for Chart.js to load
        if (typeof Chart === 'undefined') {
            setTimeout(() => this.initComparisonChart(), 100);
            return;
        }

        const ctx = canvas.getContext('2d');
        this.comparisonChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Salary', 'Demand', 'Growth', 'Learning Curve', 'Job Satisfaction'],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                }
            }
        });
    }

    updateComparisonChart() {
        if (!this.comparisonChart) return;

        const pathAId = document.getElementById('pathASelect')?.value;
        const pathBId = document.getElementById('pathBSelect')?.value;
        
        if (!pathAId || !pathBId) {
            this.comparisonChart.data.datasets = [];
            this.comparisonChart.update();
            return;
        }
        
        const pathA = this.findCareerPathById(pathAId);
        const pathB = this.findCareerPathById(pathBId);
        
        if (!pathA || !pathB) return;
        
        const dataA = [
            this.calculateSalaryScore(pathA.salaryRange),
            pathA.difficulty === 'Beginner' ? 85 : pathA.difficulty === 'Intermediate' ? 70 : 55,
            75,
            60,
            80
        ];
        
        const dataB = [
            this.calculateSalaryScore(pathB.salaryRange),
            pathB.difficulty === 'Beginner' ? 85 : pathB.difficulty === 'Intermediate' ? 70 : 55,
            65,
            70,
            75
        ];
        
        this.comparisonChart.data.datasets = [
            {
                label: pathA.title,
                data: dataA,
                backgroundColor: 'rgba(74, 0, 224, 0.2)',
                borderColor: 'rgba(74, 0, 224, 1)',
                borderWidth: 2
            },
            {
                label: pathB.title,
                data: dataB,
                backgroundColor: 'rgba(255, 142, 0, 0.2)',
                borderColor: 'rgba(255, 142, 0, 1)',
                borderWidth: 2
            }
        ];
        
        this.comparisonChart.update();
    }

    findCareerPathById(id) {
        const departments = window.appData?.departments || [];
        for (const dept of departments) {
            const path = dept.careerPaths.find(p => p.id === id);
            if (path) return path;
        }
        return null;
    }

    calculateSalaryScore(salaryRange) {
        if (!salaryRange || !salaryRange.entry) return 50;
        const entry = parseInt(salaryRange.entry.replace(/[^0-9]/g, ''));
        return Math.min(Math.floor(entry / 1000), 100);
    }

    // ==================== SUCCESS STORIES CAROUSEL ====================
    initEventListeners() {
        this.initSuccessStories();
        this.initNewsletter();
    }

    initSuccessStories() {
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const carouselContainer = document.querySelector('.carousel-container');
        
        if (!prevBtn || !nextBtn || !carouselContainer) return;

        // Add more stories if only one exists
        const existingStories = carouselContainer.querySelectorAll('.story-card');
        if (existingStories.length === 1) {
            this.addMoreStories();
        }

        const stories = carouselContainer.querySelectorAll('.story-card');
        if (stories.length === 0) return;

        let currentIndex = 0;

        const updateCarousel = () => {
            stories.forEach((story, index) => {
                story.classList.toggle('active', index === currentIndex);
            });
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + stories.length) % stories.length;
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % stories.length;
            updateCarousel();
        });

        // Auto-advance carousel every 5 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % stories.length;
            updateCarousel();
        }, 5000);
    }

    addMoreStories() {
        const carouselContainer = document.querySelector('.carousel-container');
        if (!carouselContainer) return;
        
        const moreStories = [
            {
                name: 'Michael Chen',
                role: 'Data Scientist at Microsoft',
                text: 'The skill assessment helped me identify gaps and the AI coach guided me through learning paths. Got hired within 2 months!',
                badge: 'Data Science Graduate',
                stats: { match: '92%', time: '2 Months' }
            },
            {
                name: 'Emily Rodriguez',
                role: 'Product Manager at Amazon',
                text: 'Career Lens showed me exactly what skills I needed for product management. The interview prep was invaluable!',
                badge: 'Marketing Graduate',
                stats: { match: '88%', time: '4 Months' }
            },
            {
                name: 'David Kim',
                role: 'Full Stack Developer at Netflix',
                text: 'The CV builder and job portal made my job search so much easier. Found my perfect role in 6 weeks!',
                badge: 'CSE Graduate',
                stats: { match: '90%', time: '6 Weeks' }
            }
        ];
        
        moreStories.forEach((story) => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';
            storyCard.innerHTML = `
                <div class="story-image">
                    <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #4A00E0, #8E2DE2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 36px; margin: 0 auto;">
                        ${story.name.charAt(0)}
                    </div>
                    <div class="story-badge">${story.badge}</div>
                </div>
                <div class="story-content">
                    <h4>${story.name}</h4>
                    <p class="story-role">${story.role}</p>
                    <p class="story-text">"${story.text}"</p>
                    <div class="story-stats">
                        <span><i class="fas fa-chart-line"></i> ${story.stats.match} Skill Match</span>
                        <span><i class="fas fa-clock"></i> ${story.stats.time}</span>
                    </div>
                </div>
            `;
            carouselContainer.appendChild(storyCard);
        });
    }

    // ==================== NEWSLETTER ====================
    initNewsletter() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (!newsletterForm) return;

        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input[type="email"]');
            const email = input?.value;
            
            if (email && this.validateEmail(email)) {
                this.showNotification('Subscribed successfully!', 'success');
                if (input) input.value = '';
            } else {
                this.showNotification('Please enter a valid email address.', 'info');
            }
        });
    }

    // ==================== UTILITY METHODS ====================
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        notification.querySelector('.close-btn').addEventListener('click', () => {
            notification.remove();
        });
    }

    createDefaultUser() {
        return {
            id: Date.now(),
            name: "New User",
            email: "",
            department: null,
            skills: [],
            completedCourses: [],
            savedJobs: [],
            progress: {},
            preferences: {
                theme: 'light',
                notifications: true
            }
        };
    }

    loadUserProgress() {
        const progress = JSON.parse(localStorage.getItem('userProgress'));
        if (progress) {
            this.userData = { ...this.userData, ...progress };
        }
    }
}

// Initialize app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new CareerLensApp();
    });
} else {
    window.app = new CareerLensApp();
}

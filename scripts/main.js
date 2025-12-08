// Career Lens Main Application

class CareerLensApp {
    constructor() {
        this.currentTheme = 'light';
        this.userData = JSON.parse(localStorage.getItem('careerLensUser')) || this.createDefaultUser();
        this.init();
    }

    init() {
        this.initTheme();
        this.initNavigation();
        this.initCounters();
        this.initTypewriter();
        this.initDepartmentGrid();
        this.initAI();
        this.init3DVisualization();
        this.initComparisons();
        this.initEventListeners();
        this.loadUserProgress();
    }

    // Theme Management
    initTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Set initial theme
        if (localStorage.getItem('theme')) {
            this.currentTheme = localStorage.getItem('theme');
        } else if (prefersDark.matches) {
            this.currentTheme = 'dark';
        }
        
        this.applyTheme();
        
        // Theme toggle event
        themeToggle.addEventListener('click', () => {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme();
            localStorage.setItem('theme', this.currentTheme);
        });
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Update Three.js scene colors based on theme
        if (window.threeScene) {
            window.threeScene.updateTheme(this.currentTheme);
        }
    }

    // Department Grid with Filtering
    initDepartmentGrid() {
        const grid = document.getElementById('departmentGrid');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('departmentSearch');
        
        // Load all departments
        this.renderDepartments(appData.departments);
        
        // Filter functionality
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                const filtered = filter === 'all' 
                    ? appData.departments 
                    : appData.departments.filter(dept => dept.category === filter);
                
                this.renderDepartments(filtered);
            });
        });
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = appData.departments.filter(dept => 
                dept.name.toLowerCase().includes(query) ||
                dept.description.toLowerCase().includes(query)
            );
            this.renderDepartments(filtered);
        });
    }

    renderDepartments(departments) {
        const grid = document.getElementById('departmentGrid');
        grid.innerHTML = '';
        
        departments.forEach(dept => {
            const card = this.createDepartmentCard(dept);
            grid.appendChild(card);
        });
    }

    createDepartmentCard(department) {
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 mb-4';
        card.innerHTML = `
            <div class="department-card-3d" data-dept-id="${department.id}">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="card-icon" style="color: ${department.color}">
                            <i class="${department.icon} fa-3x"></i>
                        </div>
                        <h4>${department.name}</h4>
                        <p class="text-muted">${department.description}</p>
                        
                        <div class="department-stats">
                            <div class="stat">
                                <i class="fas fa-chart-line"></i>
                                <span>Demand: ${department.demandScore}/100</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-dollar-sign"></i>
                                <span>${department.avgEntrySalary}</span>
                            </div>
                        </div>
                        
                        <div class="card-tags">
                            ${department.careerPaths.slice(0, 3).map(path => 
                                `<span class="tag">${path.title}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="card-back">
                        <h5>Career Paths</h5>
                        <ul>
                            ${department.careerPaths.slice(0, 4).map(path => 
                                `<li>${path.title}</li>`
                            ).join('')}
                        </ul>
                        <button class="btn btn-sm btn-gradient explore-btn" 
                                onclick="app.exploreDepartment(${department.id})">
                            Explore Details
                        </button>
                    </div>
                </div>
                
                <div class="card-glow" style="background: ${department.color}"></div>
            </div>
        `;
        
        // Add 3D hover effect
        card.addEventListener('mousemove', this.handleCard3DEffect);
        card.addEventListener('mouseleave', this.resetCard3DEffect);
        
        return card;
    }

    // 3D Card Effects
    handleCard3DEffect(e) {
        const card = e.currentTarget;
        const cardInner = card.querySelector('.card-inner');
        const rect = card.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = ((x - centerX) / centerX) * 10;
        const rotateX = ((centerY - y) / centerY) * 10;
        
        cardInner.style.transform = `
            rotateY(${rotateY}deg)
            rotateX(${rotateX}deg)
            translateZ(20px)
        `;
        
        // Update glow position
        const glow = card.querySelector('.card-glow');
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        glow.style.opacity = '0.3';
    }

    resetCard3DEffect(e) {
        const card = e.currentTarget;
        const cardInner = card.querySelector('.card-inner');
        const glow = card.querySelector('.card-glow');
        
        cardInner.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
        glow.style.opacity = '0';
    }

    // AI Career Coach
    initAI() {
        const chatInput = document.getElementById('aiChatInput');
        const sendBtn = document.getElementById('sendMessage');
        const quickOptions = document.querySelectorAll('.option-btn');
        
        // Quick option buttons
        quickOptions.forEach(option => {
            option.addEventListener('click', () => {
                const question = option.dataset.question;
                this.sendAIMessage(question);
            });
        });
        
        // Send message
        sendBtn.addEventListener('click', () => {
            if (chatInput.value.trim()) {
                this.sendAIMessage(chatInput.value);
                chatInput.value = '';
            }
        });
        
        // Enter key support
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && chatInput.value.trim()) {
                this.sendAIMessage(chatInput.value);
                chatInput.value = '';
            }
        });
    }

    sendAIMessage(question) {
        const messagesContainer = document.getElementById('aiChatMessages');
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'message user-message';
        userMsg.innerHTML = `
            <div class="message-content">
                ${question}
            </div>
        `;
        messagesContainer.appendChild(userMsg);
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai-message typing';
        typingIndicator.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingIndicator);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Simulate AI response after delay
        setTimeout(() => {
            typingIndicator.remove();
            const aiResponse = this.generateAIResponse(question);
            
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message ai-message';
            aiMsg.innerHTML = `
                <div class="message-content">
                    ${aiResponse}
                </div>
            `;
            messagesContainer.appendChild(aiMsg);
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 1500 + Math.random() * 1000);
    }

    generateAIResponse(question) {
        // Mock AI responses based on question type
        const responses = {
            "Career path suggestions": `
                Based on your profile, I recommend these career paths:
                <div class="ai-recommendations">
                    <div class="recommendation">
                        <strong>Full Stack Developer</strong>
                        <p>High demand, great growth opportunities. Required skills: JavaScript, React, Node.js</p>
                        <a href="pages/career-paths.html?path=cse-1" class="btn-link">View Roadmap →</a>
                    </div>
                    <div class="recommendation">
                        <strong>Data Scientist</strong>
                        <p>Excellent salary potential, growing field. Required skills: Python, ML, Statistics</p>
                        <a href="pages/career-paths.html?path=cse-2" class="btn-link">View Roadmap →</a>
                    </div>
                </div>
            `,
            "Skill gap analysis": `
                <h5>Your Skill Gap Analysis</h5>
                <div class="skill-gap-chart">
                    <div class="skill-item">
                        <span>JavaScript</span>
                        <div class="progress">
                            <div class="progress-bar" style="width: 65%">65%</div>
                        </div>
                    </div>
                    <div class="skill-item">
                        <span>React</span>
                        <div class="progress">
                            <div class="progress-bar" style="width: 40%">40%</div>
                        </div>
                    </div>
                    <div class="skill-item">
                        <span>Node.js</span>
                        <div class="progress">
                            <div class="progress-bar" style="width: 30%">30%</div>
                        </div>
                    </div>
                </div>
                <p class="mt-3">I recommend focusing on React and Node.js to become job-ready in 3 months.</p>
            `,
            // More responses...
        };
        
        return responses[question] || `
            I understand you're asking about "${question}". As an AI Career Coach, I can help you with:
            <ul>
                <li>Personalized career path recommendations</li>
                <li>Skill gap analysis and learning plans</li>
                <li>Resume optimization tips</li>
                <li>Interview preparation strategies</li>
                <li>Job search optimization</li>
            </ul>
            Could you be more specific about what you need help with?
        `;
    }

    // Career Path Comparison
    initComparisons() {
        const pathASelect = document.getElementById('pathASelect');
        const pathBSelect = document.getElementById('pathBSelect');
        
        // Populate dropdowns
        appData.departments.forEach(dept => {
            dept.careerPaths.forEach(path => {
                const optionA = document.createElement('option');
                optionA.value = path.id;
                optionA.textContent = `${dept.name} - ${path.title}`;
                pathASelect.appendChild(optionA.cloneNode(true));
                pathBSelect.appendChild(optionA);
            });
        });
        
        // Update comparison on selection
        pathASelect.addEventListener('change', (e) => this.updateComparison('A', e.target.value));
        pathBSelect.addEventListener('change', (e) => this.updateComparison('B', e.target.value));
        
        // Initialize comparison chart
        this.initComparisonChart();
    }

    updateComparison(side, pathId) {
        const path = this.findCareerPathById(pathId);
        const container = document.getElementById(`path${side}Details`);
        
        container.innerHTML = `
            <h5>${path.title}</h5>
            <p>${path.description}</p>
            
            <div class="comparison-details">
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <small>Time to Hire</small>
                        <strong>${path.timeToHire}</strong>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-dollar-sign"></i>
                    <div>
                        <small>Entry Salary</small>
                        <strong>${path.salaryRange.entry}</strong>
                    </div>
                </div>
                <div class="detail-item">
                    <i class="fas fa-chart-line"></i>
                    <div>
                        <small>Growth</small>
                        <strong>${path.salaryRange.senior}</strong>
                    </div>
                </div>
            </div>
            
            <h6>Top Skills Required:</h6>
            <div class="skill-tags">
                ${path.skills.slice(0, 5).map(skill => 
                    `<span class="skill-tag">${skill.name}</span>`
                ).join('')}
            </div>
        `;
        
        this.updateComparisonChart();
    }

    initComparisonChart() {
        const ctx = document.getElementById('comparisonChart').getContext('2d');
        this.comparisonChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Salary', 'Demand', 'Growth', 'Learning Curve', 'Job Satisfaction'],
                datasets: []
            },
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    updateComparisonChart() {
        // Get selected paths
        const pathAId = document.getElementById('pathASelect').value;
        const pathBId = document.getElementById('pathBSelect').value;
        
        if (!pathAId || !pathBId) return;
        
        const pathA = this.findCareerPathById(pathAId);
        const pathB = this.findCareerPathById(pathBId);
        
        // Generate comparison data
        const dataA = [
            this.calculateSalaryScore(pathA.salaryRange),
            pathA.difficulty === 'Beginner' ? 85 : pathA.difficulty === 'Intermediate' ? 70 : 55,
            75, // Growth
            60, // Learning curve
            80  // Job satisfaction
        ];
        
        const dataB = [
            this.calculateSalaryScore(pathB.salaryRange),
            pathB.difficulty === 'Beginner' ? 85 : pathB.difficulty === 'Intermediate' ? 70 : 55,
            65, // Growth
            70, // Learning curve
            75  // Job satisfaction
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

    // Utility Methods
    findCareerPathById(id) {
        for (const dept of appData.departments) {
            const path = dept.careerPaths.find(p => p.id === id);
            if (path) return path;
        }
        return null;
    }

    calculateSalaryScore(salaryRange) {
        const entry = parseInt(salaryRange.entry.replace(/[^0-9]/g, ''));
        return Math.min(Math.floor(entry / 1000), 100);
    }

    initCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start when in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    initTypewriter() {
        const typewriter = document.querySelector('.typewriter');
        const texts = JSON.parse(typewriter.dataset.text);
        let index = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function type() {
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
        }
        
        setTimeout(type, 1000);
    }

    exploreDepartment(deptId) {
        window.location.href = `pages/career-paths.html?department=${deptId}`;
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
        // Load user progress from localStorage
        const progress = JSON.parse(localStorage.getItem('userProgress'));
        if (progress) {
            this.userData = { ...this.userData, ...progress };
        }
    }

    initEventListeners() {
        // Story carousel
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');
        const stories = document.querySelectorAll('.story-card');
        let currentIndex = 0;
        
        prevBtn.addEventListener('click', () => {
            stories[currentIndex].classList.remove('active');
            currentIndex = (currentIndex - 1 + stories.length) % stories.length;
            stories[currentIndex].classList.add('active');
        });
        
        nextBtn.addEventListener('click', () => {
            stories[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % stories.length;
            stories[currentIndex].classList.add('active');
        });
        
        // Newsletter subscription
        const newsletterForm = document.querySelector('.newsletter-form');
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (this.validateEmail(email)) {
                this.showNotification('Subscribed successfully!', 'success');
                newsletterForm.reset();
            }
        });
    }

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
        
        // Auto remove
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
        
        // Close button
        notification.querySelector('.close-btn').addEventListener('click', () => {
            notification.remove();
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CareerLensApp();
});
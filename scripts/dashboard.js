// Dashboard Functionality for Career Lens

class Dashboard {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('careerLensUser')) || this.createDefaultUser();
        this.currentSection = 'overview';
        this.charts = {};
        
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.initCharts();
        this.initEventListeners();
        this.updateDashboard();
        this.loadRecentActivity();
        this.loadRecommendedCourses();
    }
    
    loadUserData() {
        // Update user profile
        document.getElementById('userName').textContent = this.userData.name;
        document.getElementById('userTitle').textContent = this.userData.title || 'Career Explorer';
        document.getElementById('userAvatar').src = this.userData.avatar || '../assets/images/avatars/default-avatar.png';
        
        // Update stats
        document.getElementById('skillMatch').textContent = `${this.userData.skillMatch || 65}%`;
        document.getElementById('jobMatches').textContent = this.userData.jobMatches || 12;
        document.getElementById('courseProgress').textContent = `${this.userData.courseProgress || 45}%`;
        document.getElementById('daysActive').textContent = this.userData.daysActive || 7;
    }
    
    initCharts() {
        this.initProgressChart();
        this.initSkillChart();
        this.initJobTrendChart();
        this.initSalaryChart();
    }
    
    initProgressChart() {
        const ctx = document.getElementById('progressChart').getContext('2d');
        this.charts.progress = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Skill Progress',
                    data: [30, 45, 60, 75, 85, 90, 95],
                    borderColor: '#4A00E0',
                    backgroundColor: 'rgba(74, 0, 224, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    initSkillChart() {
        const ctx = document.getElementById('skillChart').getContext('2d');
        this.charts.skill = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Technical', 'Communication', 'Leadership', 'Problem Solving', 'Creativity', 'Teamwork'],
                datasets: [
                    {
                        label: 'Your Skills',
                        data: [85, 70, 60, 90, 75, 80],
                        backgroundColor: 'rgba(74, 0, 224, 0.2)',
                        borderColor: '#4A00E0',
                        borderWidth: 2
                    },
                    {
                        label: 'Industry Average',
                        data: [75, 80, 70, 85, 65, 85],
                        backgroundColor: 'rgba(255, 142, 0, 0.2)',
                        borderColor: '#FF8E00',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
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
    
    initJobTrendChart() {
        const ctx = document.getElementById('jobTrendChart').getContext('2d');
        this.charts.jobTrend = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Frontend', 'Backend', 'Full Stack', 'Data Science', 'DevOps', 'Mobile'],
                datasets: [{
                    label: 'Job Openings',
                    data: [150, 120, 180, 90, 70, 60],
                    backgroundColor: [
                        'rgba(74, 0, 224, 0.7)',
                        'rgba(142, 45, 226, 0.7)',
                        'rgba(0, 184, 148, 0.7)',
                        'rgba(9, 132, 227, 0.7)',
                        'rgba(253, 203, 110, 0.7)',
                        'rgba(214, 48, 49, 0.7)'
                    ],
                    borderColor: [
                        '#4A00E0',
                        '#8E2DE2',
                        '#00b894',
                        '#0984e3',
                        '#fdcb6e',
                        '#d63031'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    initSalaryChart() {
        const ctx = document.getElementById('salaryChart').getContext('2d');
        this.charts.salary = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Base Salary', 'Bonus', 'Equity', 'Benefits'],
                datasets: [{
                    data: [65, 15, 15, 5],
                    backgroundColor: [
                        '#4A00E0',
                        '#8E2DE2',
                        '#00b894',
                        '#0984e3'
                    ],
                    borderWidth: 2,
                    borderColor: 'white'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }
    
    initEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.switchSection(section);
            });
        });
        
        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchDashboard(e.target.value);
        });
        
        // Notifications
        document.getElementById('notificationBtn').addEventListener('click', () => {
            this.showNotifications();
        });
        
        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                this.handleQuickAction(action);
            });
        });
        
        // Sidebar toggle for mobile
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            document.querySelector('.dashboard-sidebar').classList.toggle('active');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.dashboard-sidebar');
            const toggle = document.getElementById('sidebarToggle');
            
            if (window.innerWidth <= 1024 && 
                sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !toggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
    
    switchSection(section) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
        
        // Update section content
        document.querySelectorAll('.dashboard-section').forEach(sec => {
            sec.style.display = 'none';
        });
        document.getElementById(`${section}Section`).style.display = 'block';
        
        this.currentSection = section;
        
        // Update charts for specific sections
        if (section === 'skills') {
            this.updateSkillChart();
        } else if (section === 'jobs') {
            this.updateJobChart();
        }
    }
    
    searchDashboard(query) {
        const sections = document.querySelectorAll('.dashboard-section');
        const lowerQuery = query.toLowerCase();
        
        sections.forEach(section => {
            const elements = section.querySelectorAll('.searchable');
            let hasMatches = false;
            
            elements.forEach(el => {
                const text = el.textContent.toLowerCase();
                if (text.includes(lowerQuery)) {
                    hasMatches = true;
                    el.classList.add('highlight');
                } else {
                    el.classList.remove('highlight');
                }
            });
            
            // Show/hide sections based on matches
            if (query && !hasMatches && section.id !== 'overviewSection') {
                section.style.display = 'none';
            } else if (section.id === this.currentSection + 'Section') {
                section.style.display = 'block';
            }
        });
    }
    
    showNotifications() {
        const notifications = [
            {
                id: 1,
                title: 'New Job Match',
                message: 'Google is looking for Frontend Developers',
                time: '2 hours ago',
                read: false
            },
            {
                id: 2,
                title: 'Course Reminder',
                message: 'Complete React course by tomorrow',
                time: '1 day ago',
                read: true
            },
            {
                id: 3,
                title: 'Skill Assessment',
                message: 'Take your weekly skill assessment',
                time: '2 days ago',
                read: false
            }
        ];
        
        const container = document.createElement('div');
        container.className = 'notifications-panel';
        container.innerHTML = `
            <div class="notifications-header">
                <h4>Notifications</h4>
                <button class="close-btn">&times;</button>
            </div>
            <div class="notifications-list">
                ${notifications.map(notif => `
                    <div class="notification-item ${notif.read ? 'read' : 'unread'}">
                        <div class="notification-icon">
                            <i class="fas ${this.getNotificationIcon(notif.title)}"></i>
                        </div>
                        <div class="notification-content">
                            <h6>${notif.title}</h6>
                            <p>${notif.message}</p>
                            <small>${notif.time}</small>
                        </div>
                        ${!notif.read ? '<span class="unread-dot"></span>' : ''}
                    </div>
                `).join('')}
            </div>
            <div class="notifications-footer">
                <button class="btn btn-sm btn-outline-primary">Mark All as Read</button>
                <button class="btn btn-sm btn-gradient">View All</button>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Close button
        container.querySelector('.close-btn').addEventListener('click', () => {
            container.remove();
        });
        
        // Mark as read
        container.querySelectorAll('.notification-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                notifications[index].read = true;
                item.classList.remove('unread');
                item.classList.add('read');
            });
        });
    }
    
    getNotificationIcon(title) {
        const icons = {
            'New Job Match': 'fa-briefcase',
            'Course Reminder': 'fa-graduation-cap',
            'Skill Assessment': 'fa-chart-line',
            'Interview': 'fa-user-tie',
            'Message': 'fa-envelope'
        };
        
        for (const [key, icon] of Object.entries(icons)) {
            if (title.includes(key)) return icon;
        }
        return 'fa-bell';
    }
    
    handleQuickAction(action) {
        const actions = {
            'add-skill': () => this.addSkill(),
            'find-jobs': () => this.findJobs(),
            'take-course': () => this.takeCourse(),
            'update-cv': () => this.updateCV(),
            'schedule-interview': () => this.scheduleInterview(),
            'connect-mentor': () => this.connectMentor()
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }
    
    addSkill() {
        const skill = prompt('Enter a new skill to add:');
        if (skill) {
            this.userData.skills = this.userData.skills || [];
            this.userData.skills.push(skill);
            localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
            this.showNotification(`Added skill: ${skill}`, 'success');
            this.updateSkillChart();
        }
    }
    
    findJobs() {
        window.location.href = '../pages/job-portal.html';
    }
    
    takeCourse() {
        window.location.href = '../pages/courses.html';
    }
    
    updateCV() {
        window.location.href = '../pages/cv-builder.html';
    }
    
    scheduleInterview() {
        window.location.href = '../pages/interview-prep.html';
    }
    
    connectMentor() {
        window.location.href = '../pages/community.html';
    }
    
    loadRecentActivity() {
        const activities = [
            {
                icon: 'fa-graduation-cap',
                text: 'Completed React Fundamentals course',
                time: '2 hours ago'
            },
            {
                icon: 'fa-briefcase',
                text: 'Applied for Frontend Developer position at Google',
                time: '1 day ago'
            },
            {
                icon: 'fa-chart-line',
                text: 'Improved JavaScript skill from 70% to 85%',
                time: '2 days ago'
            },
            {
                icon: 'fa-user-tie',
                text: 'Scheduled mock interview with mentor',
                time: '3 days ago'
            }
        ];
        
        const container = document.getElementById('activityList');
        container.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas ${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-text">${activity.text}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }
    
    loadRecommendedCourses() {
        const courses = [
            {
                title: 'Advanced React Patterns',
                instructor: 'Sophie Wilson',
                rating: 4.8,
                duration: '8 hours',
                progress: 65
            },
            {
                title: 'System Design for Beginners',
                instructor: 'Michael Chen',
                rating: 4.7,
                duration: '12 hours',
                progress: 30
            },
            {
                title: 'Data Structures & Algorithms',
                instructor: 'Alex Johnson',
                rating: 4.9,
                duration: '20 hours',
                progress: 0
            }
        ];
        
        const container = document.getElementById('coursesGrid');
        container.innerHTML = courses.map(course => `
            <div class="course-card">
                <div class="course-image">
                    <span class="course-badge">${course.duration}</span>
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-instructor">By ${course.instructor}</p>
                    <div class="course-meta">
                        <span class="course-rating">
                            <i class="fas fa-star"></i> ${course.rating}
                        </span>
                        <span class="course-level">Intermediate</span>
                    </div>
                    <div class="course-progress">
                        <div class="progress-info">
                            <span>Progress</span>
                            <span>${course.progress}%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${course.progress}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    updateDashboard() {
        // Update progress bars
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
        
        // Update counters
        document.querySelectorAll('.counter-animate').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    setTimeout(updateCounter, 16);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    updateSkillChart() {
        // Refresh skill chart data
        if (this.charts.skill) {
            const newData = this.userData.skills ? this.userData.skills.length * 10 : 0;
            this.charts.skill.data.datasets[0].data[0] = Math.min(newData, 100);
            this.charts.skill.update();
        }
    }
    
    updateJobChart() {
        // Refresh job chart data
        if (this.charts.jobTrend) {
            // Add random variation to simulate new job postings
            this.charts.jobTrend.data.datasets[0].data = 
                this.charts.jobTrend.data.datasets[0].data.map(value => 
                    Math.max(10, value + Math.floor(Math.random() * 20) - 10)
                );
            this.charts.jobTrend.update();
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `dashboard-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        `;
        
        document.querySelector('.dashboard-main').appendChild(notification);
        
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
    
    createDefaultUser() {
        return {
            name: "John Doe",
            title: "Frontend Developer",
            avatar: "../assets/images/avatars/default-avatar.png",
            skillMatch: 65,
            jobMatches: 12,
            courseProgress: 45,
            daysActive: 7,
            skills: ["JavaScript", "React", "HTML/CSS"],
            completedCourses: [],
            appliedJobs: [],
            progress: {}
        };
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
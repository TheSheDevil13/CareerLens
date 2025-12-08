// Dashboard for Career Lens

class Dashboard {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('careerLensUser')) || this.createDefaultUser();
        this.currentSection = 'overview';
        this.skillsChart = null;
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeDashboard());
        } else {
            this.initializeDashboard();
        }
    }
    
    initializeDashboard() {
        this.loadUserData();
        this.renderUserProfile();
        this.renderStats();
        this.renderProgress();
        this.renderCourses();
        this.renderSavedJobs();
        this.renderSkills();
        this.renderActivity();
        this.initEventListeners();
        this.initCharts();
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
    
    loadUserData() {
        // Merge with any additional data from localStorage
        const savedProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
        const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
        
        this.userData = {
            ...this.userData,
            ...savedProgress,
            savedJobs: savedJobs.length > 0 ? savedJobs : this.userData.savedJobs,
            appliedJobs: appliedJobs
        };
        
        // Save updated data
        localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
    }
    
    renderUserProfile() {
        const name = this.userData.name || 'New User';
        const email = this.userData.email || '';
        const department = this.userData.department || null;
        
        // Avatar initial
        const initial = name.charAt(0).toUpperCase();
        const avatarElement = document.getElementById('avatarInitial');
        if (avatarElement) avatarElement.textContent = initial;
        
        // User name
        const nameElement = document.getElementById('userName');
        if (nameElement) nameElement.textContent = name;
        
        // User title
        const titleElement = document.getElementById('userTitle');
        if (titleElement) {
            if (department) {
                titleElement.textContent = this.getDepartmentName(department);
            } else {
                titleElement.textContent = 'Career Explorer';
            }
        }
        
        // Sidebar stats
        const coursesCount = this.userData.completedCourses?.length || 0;
        const jobsCount = this.userData.savedJobs?.length || 0;
        const skillsCount = this.userData.skills?.length || 0;
        
        const statCourses = document.getElementById('statCourses');
        const statJobs = document.getElementById('statJobs');
        const statSkills = document.getElementById('statSkills');
        
        if (statCourses) statCourses.textContent = coursesCount;
        if (statJobs) statJobs.textContent = jobsCount;
        if (statSkills) statSkills.textContent = skillsCount;
        
        // Badges
        const coursesBadge = document.getElementById('coursesBadge');
        const jobsBadge = document.getElementById('jobsBadge');
        if (coursesBadge) {
            coursesBadge.textContent = coursesCount;
            coursesBadge.style.display = coursesCount > 0 ? 'block' : 'none';
        }
        if (jobsBadge) {
            jobsBadge.textContent = jobsCount;
            jobsBadge.style.display = jobsCount > 0 ? 'block' : 'none';
        }
        
        // Settings form
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileDepartment = document.getElementById('profileDepartment');
        
        if (profileName) profileName.value = name;
        if (profileEmail) profileEmail.value = email;
        if (profileDepartment && department) {
            profileDepartment.value = department;
        }
    }
    
    getDepartmentName(deptId) {
        const departments = {
            'cse': 'Computer Science',
            'ece': 'Electronics',
            'mech': 'Mechanical Engineering',
            'civil': 'Civil Engineering',
            'business': 'Business',
            'it': 'Information Technology'
        };
        return departments[deptId] || 'Career Explorer';
    }
    
    renderStats() {
        const completedCourses = this.userData.completedCourses?.length || 0;
        const savedJobs = this.userData.savedJobs?.length || 0;
        const skills = this.userData.skills?.length || 0;
        const achievements = this.calculateAchievements();
        
        const statCompletedCourses = document.getElementById('statCompletedCourses');
        const statSavedJobs = document.getElementById('statSavedJobs');
        const statTotalSkills = document.getElementById('statTotalSkills');
        const statAchievements = document.getElementById('statAchievements');
        
        if (statCompletedCourses) statCompletedCourses.textContent = completedCourses;
        if (statSavedJobs) statSavedJobs.textContent = savedJobs;
        if (statTotalSkills) statTotalSkills.textContent = skills;
        if (statAchievements) statAchievements.textContent = achievements;
    }
    
    calculateAchievements() {
        let count = 0;
        const courses = this.userData.completedCourses?.length || 0;
        const jobs = this.userData.savedJobs?.length || 0;
        const skills = this.userData.skills?.length || 0;
        
        if (courses > 0) count++;
        if (courses >= 5) count++;
        if (jobs > 0) count++;
        if (skills >= 3) count++;
        if (skills >= 10) count++;
        
        return count;
    }
    
    renderProgress() {
        const progressBars = document.getElementById('progressBars');
        if (!progressBars) return;
        
        const progress = this.userData.progress || {};
        const courses = this.userData.completedCourses || [];
        
        if (courses.length === 0 && Object.keys(progress).length === 0) {
            progressBars.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">No progress tracked yet. Start a course to see your progress!</p>
                    <a href="courses.html" class="btn btn-gradient mt-2">Browse Courses</a>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        // Course progress
        courses.forEach((course, index) => {
            const courseProgress = progress[course.id] || progress[course] || 100; // Completed courses are 100%
            html += `
                <div class="progress-item">
                    <div class="progress-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="progress-details">
                        <div class="progress-info">
                            <span class="progress-label">${course.title || course.name || `Course ${index + 1}`}</span>
                            <span class="progress-percent">${courseProgress}%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${courseProgress}%"></div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Additional progress items
        Object.keys(progress).forEach(key => {
            if (!courses.some(c => (c.id || c) === key)) {
                const value = progress[key];
                html += `
                    <div class="progress-item">
                        <div class="progress-icon">
                            <i class="fas fa-tasks"></i>
                        </div>
                        <div class="progress-details">
                            <div class="progress-info">
                                <span class="progress-label">${this.formatProgressKey(key)}</span>
                                <span class="progress-percent">${value}%</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${value}%"></div>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        progressBars.innerHTML = html || '<p class="text-muted">No progress to display.</p>';
    }
    
    formatProgressKey(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
    }
    
    renderCourses() {
        const coursesGrid = document.getElementById('coursesGrid');
        if (!coursesGrid) return;
        
        const courses = this.userData.completedCourses || [];
        
        if (courses.length === 0) {
            coursesGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-book fa-3x text-muted mb-3"></i>
                    <p class="text-muted">You haven't enrolled in any courses yet.</p>
                    <a href="courses.html" class="btn btn-gradient mt-3">Browse Courses</a>
                </div>
            `;
            return;
        }
        
        let html = '';
        courses.forEach(course => {
            const progress = this.userData.progress?.[course.id || course] || 100;
            html += `
                <div class="course-card">
                    <div class="course-image">
                        <div class="course-badge">Completed</div>
                    </div>
                    <div class="course-content">
                        <h5 class="course-title">${course.title || course.name || 'Course'}</h5>
                        <p class="course-instructor">Career Lens</p>
                        <div class="course-meta">
                            <span><i class="fas fa-clock"></i> ${course.duration || 'Self-paced'}</span>
                            <span class="course-rating"><i class="fas fa-star"></i> ${course.rating || '4.5'}</span>
                        </div>
                        <div class="course-progress">
                            <div class="progress-info">
                                <span>Progress</span>
                                <span>${progress}%</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${progress}%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        coursesGrid.innerHTML = html;
    }
    
    renderSavedJobs() {
        const jobsGrid = document.getElementById('savedJobsGrid');
        if (!jobsGrid) return;
        
        const jobs = this.userData.savedJobs || [];
        
        if (jobs.length === 0) {
            jobsGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-briefcase fa-3x text-muted mb-3"></i>
                    <p class="text-muted">You haven't saved any jobs yet.</p>
                    <a href="job-portal.html" class="btn btn-gradient mt-3">Browse Jobs</a>
                </div>
            `;
            return;
        }
        
        let html = '';
        jobs.forEach(job => {
            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${job.title || job.name || 'Job Title'}</h5>
                            <p class="card-text text-muted">${job.company || 'Company'}</p>
                            <div class="mb-2">
                                <small class="text-muted">
                                    <i class="fas fa-map-marker-alt"></i> ${job.location || 'Location'}
                                </small>
                            </div>
                            <div class="mb-2">
                                <small class="text-muted">
                                    <i class="fas fa-dollar-sign"></i> ${job.salary || 'Competitive'}
                                </small>
                            </div>
                            <div class="d-flex gap-2 mt-3">
                                <a href="job-portal.html" class="btn btn-sm btn-gradient">View Details</a>
                                <button class="btn btn-sm btn-outline-danger" onclick="window.dashboard.removeJob('${job.id || job.title}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        jobsGrid.innerHTML = html;
    }
    
    renderSkills() {
        const skillsGrid = document.getElementById('skillsGrid');
        if (!skillsGrid) return;
        
        const skills = this.userData.skills || [];
        
        if (skills.length === 0) {
            skillsGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-code fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No skills tracked yet. Complete assessments to track your skills!</p>
                    <a href="skill-assessment.html" class="btn btn-gradient mt-3">Take Assessment</a>
                </div>
            `;
            return;
        }
        
        let html = '';
        skills.forEach(skill => {
            const skillName = skill.name || skill;
            const skillLevel = skill.level || skill.proficiency || 'Beginner';
            const progress = this.getSkillProgress(skillLevel);
            
            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${skillName}</h5>
                            <p class="text-muted mb-2">Level: ${skillLevel}</p>
                            <div class="progress-bar-container mb-2">
                                <div class="progress-bar" style="width: ${progress}%"></div>
                            </div>
                            <small class="text-muted">${progress}% proficiency</small>
                        </div>
                    </div>
                </div>
            `;
        });
        
        skillsGrid.innerHTML = html;
    }
    
    getSkillProgress(level) {
        const levels = {
            'Beginner': 25,
            'Intermediate': 50,
            'Advanced': 75,
            'Expert': 100
        };
        return levels[level] || 25;
    }
    
    renderActivity() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;
        
        const activities = this.generateActivityFeed();
        
        if (activities.length === 0) {
            activityList.innerHTML = '<p class="text-muted text-center py-3">No recent activity</p>';
            return;
        }
        
        let html = '';
        activities.forEach(activity => {
            html += `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas ${activity.icon}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-text">${activity.text}</div>
                        <div class="activity-time">${activity.time}</div>
                    </div>
                </div>
            `;
        });
        
        activityList.innerHTML = html;
    }
    
    generateActivityFeed() {
        const activities = [];
        const now = new Date();
        
        // Course completions
        const courses = this.userData.completedCourses || [];
        courses.slice(0, 3).forEach((course, index) => {
            activities.push({
                icon: 'fa-check-circle',
                text: `Completed course: ${course.title || course.name || 'Course'}`,
                time: this.getTimeAgo(now - (index + 1) * 86400000) // Days ago
            });
        });
        
        // Job saves
        const jobs = this.userData.savedJobs || [];
        jobs.slice(0, 2).forEach((job, index) => {
            activities.push({
                icon: 'fa-bookmark',
                text: `Saved job: ${job.title || job.name || 'Job'}`,
                time: this.getTimeAgo(now - (index + 1) * 43200000) // Hours ago
            });
        });
        
        // Skills added
        const skills = this.userData.skills || [];
        if (skills.length > 0) {
            activities.push({
                icon: 'fa-code',
                text: `Added skill: ${skills[skills.length - 1].name || skills[skills.length - 1]}`,
                time: this.getTimeAgo(now - 3600000) // 1 hour ago
            });
        }
        
        // Sort by time (most recent first)
        return activities.slice(0, 5);
    }
    
    getTimeAgo(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }
    
    initCharts() {
        const canvas = document.getElementById('skillsChart');
        if (!canvas || typeof Chart === 'undefined') return;
        
        const skills = this.userData.skills || [];
        
        if (skills.length === 0) {
            canvas.parentElement.innerHTML = '<p class="text-muted text-center py-4">No skills data to display. Complete assessments to track your skills!</p>';
            return;
        }
        
        const ctx = canvas.getContext('2d');
        const labels = skills.map(s => s.name || s);
        const data = skills.map(s => this.getSkillProgress(s.level || s.proficiency || 'Beginner'));
        
        this.skillsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skill Proficiency (%)',
                    data: data,
                    backgroundColor: 'rgba(74, 0, 224, 0.6)',
                    borderColor: 'rgba(74, 0, 224, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    initEventListeners() {
        // Sidebar navigation
        const navItems = document.querySelectorAll('.nav-item[data-section]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.switchSection(section);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });
        
        // Mobile sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('dashboardSidebar');
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }
        
        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }
        
        // Preferences toggles
        const notificationsToggle = document.getElementById('notificationsToggle');
        const emailUpdatesToggle = document.getElementById('emailUpdatesToggle');
        
        if (notificationsToggle) {
            notificationsToggle.checked = this.userData.preferences?.notifications !== false;
            notificationsToggle.addEventListener('change', (e) => {
                this.userData.preferences = this.userData.preferences || {};
                this.userData.preferences.notifications = e.target.checked;
                localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
            });
        }
        
        if (emailUpdatesToggle) {
            emailUpdatesToggle.addEventListener('change', (e) => {
                this.userData.preferences = this.userData.preferences || {};
                this.userData.preferences.emailUpdates = e.target.checked;
                localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
            });
        }
        
        // Dashboard search
        const dashboardSearch = document.getElementById('dashboardSearch');
        if (dashboardSearch) {
            dashboardSearch.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }
        
        // View all progress
        const viewAllProgress = document.getElementById('viewAllProgress');
        if (viewAllProgress) {
            viewAllProgress.addEventListener('click', () => {
                this.switchSection('progress');
                document.querySelector('.nav-item[data-section="progress"]')?.classList.add('active');
                document.querySelector('.nav-item[data-section="overview"]')?.classList.remove('active');
            });
        }
    }
    
    switchSection(section) {
        // Hide all sections
        const sections = document.querySelectorAll('.dashboard-section');
        sections.forEach(sec => {
            sec.style.display = 'none';
        });
        
        // Show selected section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = section;
            
            // Update title
            const titles = {
                'overview': 'Dashboard',
                'progress': 'Progress',
                'courses': 'My Courses',
                'jobs': 'Saved Jobs',
                'skills': 'My Skills',
                'settings': 'Settings'
            };
            
            const subtitles = {
                'overview': 'Welcome back! Here\'s your career journey overview.',
                'progress': 'Track your learning and skill development progress.',
                'courses': 'Your enrolled and completed courses.',
                'jobs': 'Jobs you\'ve saved for later.',
                'skills': 'Your skills and proficiency levels.',
                'settings': 'Manage your account and preferences.'
            };
            
            const titleElement = document.getElementById('dashboardTitle');
            const subtitleElement = document.getElementById('dashboardSubtitle');
            
            if (titleElement) titleElement.textContent = titles[section] || 'Dashboard';
            if (subtitleElement) subtitleElement.textContent = subtitles[section] || '';
            
            // Re-render section-specific content if needed
            if (section === 'progress' && !this.skillsChart) {
                setTimeout(() => this.initCharts(), 100);
            }
        }
    }
    
    saveProfile() {
        const name = document.getElementById('profileName')?.value || '';
        const email = document.getElementById('profileEmail')?.value || '';
        const department = document.getElementById('profileDepartment')?.value || null;
        
        this.userData.name = name;
        this.userData.email = email;
        this.userData.department = department;
        
        localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
        
        // Re-render profile
        this.renderUserProfile();
        
        // Show notification
        this.showNotification('Profile updated successfully!', 'success');
    }
    
    removeJob(jobId) {
        if (!confirm('Are you sure you want to remove this job from your saved list?')) {
            return;
        }
        
        this.userData.savedJobs = this.userData.savedJobs.filter(job => 
            (job.id || job.title) !== jobId
        );
        
        // Also update localStorage savedJobs
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
        const updatedJobs = savedJobs.filter(job => (job.id || job.title) !== jobId);
        localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
        
        localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
        
        // Re-render
        this.renderSavedJobs();
        this.renderStats();
        this.renderUserProfile();
        
        this.showNotification('Job removed from saved list', 'info');
    }
    
    handleSearch(query) {
        // Simple search - could be enhanced
        if (!query.trim()) return;
        
        // Search across sections
        const sections = ['overview', 'progress', 'courses', 'jobs', 'skills'];
        // This is a basic implementation - could be enhanced with actual search
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span style="margin-left: 0.5rem;">${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize dashboard
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dashboard = new Dashboard();
    });
} else {
    window.dashboard = new Dashboard();
}

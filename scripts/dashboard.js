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
        
        // Initialize overview charts if on overview section
        if (this.currentSection === 'overview') {
            setTimeout(() => {
                this.initOverviewChart();
                this.initOverviewLearningChart();
            }, 100);
        }
        
        // Refresh data when window gains focus (user returns from another page)
        window.addEventListener('focus', () => {
            this.loadUserData();
            if (this.currentSection === 'courses') {
                this.renderCourses();
            } else if (this.currentSection === 'overview') {
                this.renderProgress(); // This will call initOverviewLearningChart() internally
                setTimeout(() => this.initOverviewChart(), 100);
            }
            this.renderStats();
            this.renderUserProfile();
        });
    }
    
    createDefaultUser() {
        return {
            id: Date.now(),
            name: "New User",
            email: "",
            department: null,
            skills: [],
            enrolledCourses: [],
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
        const savedJobsFromStorage = JSON.parse(localStorage.getItem('savedJobs')) || [];
        const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
        
        // Convert savedJobs if they're just IDs to full objects
        let savedJobs = savedJobsFromStorage;
        if (savedJobs.length > 0 && typeof savedJobs[0] === 'number') {
            // Old format - just IDs, need to get job details from appData
            savedJobs = savedJobs.map(jobId => {
                // Try to find job in appData
                const allJobs = window.appData?.jobListings || [];
                const job = allJobs.find(j => j.id === jobId);
                if (job) {
                    return {
                        id: job.id,
                        title: job.title,
                        company: job.company,
                        location: job.location,
                        salary: job.salary,
                        type: job.type,
                        experience: job.experience,
                        department: job.department,
                        description: job.description,
                        requirements: job.requirements,
                        posted: job.posted
                    };
                }
                return null;
            }).filter(job => job !== null);
            
            // Update localStorage with full objects
            localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        }
        
        // Ensure enrolledCourses is loaded from userData
        const userDataFromStorage = JSON.parse(localStorage.getItem('careerLensUser')) || {};
        
        this.userData = {
            ...this.userData,
            ...savedProgress,
            ...userDataFromStorage, // Merge all userData including enrolledCourses
            savedJobs: savedJobs.length > 0 ? savedJobs : (this.userData.savedJobs || []),
            appliedJobs: appliedJobs,
            // Ensure enrolledCourses is preserved
            enrolledCourses: userDataFromStorage.enrolledCourses || this.userData.enrolledCourses || []
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
        const enrolledCourses = this.userData.enrolledCourses?.length || 0;
        const completedCourses = this.userData.completedCourses?.length || 0;
        const coursesCount = enrolledCourses + completedCourses;
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
        const enrolledCourses = this.userData.enrolledCourses?.length || 0;
        const completedCourses = this.userData.completedCourses?.length || 0;
        const totalCourses = enrolledCourses + completedCourses;
        const savedJobs = this.userData.savedJobs?.length || 0;
        const skills = this.userData.skills?.length || 0;
        const achievements = this.calculateAchievements();
        
        const statCompletedCourses = document.getElementById('statCompletedCourses');
        const statSavedJobs = document.getElementById('statSavedJobs');
        const statTotalSkills = document.getElementById('statTotalSkills');
        const statAchievements = document.getElementById('statAchievements');
        
        // Update label to show enrolled courses instead of just completed
        if (statCompletedCourses) {
            statCompletedCourses.textContent = totalCourses;
            const label = statCompletedCourses.nextElementSibling;
            if (label && label.classList.contains('stat-label')) {
                label.textContent = enrolledCourses > 0 ? 'Enrolled Courses' : 'Completed Courses';
            }
        }
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
        
        // Check if we're in overview section (chart view) or progress section (detailed view)
        const isOverview = progressBars.closest('#overview') !== null;
        
        // For overview, use chart instead of list
        if (isOverview) {
            this.initOverviewLearningChart();
            return;
        }
        
        const progress = this.userData.progress || {};
        const enrolledCourses = this.userData.enrolledCourses || [];
        const completedCourses = this.userData.completedCourses || [];
        const allCourses = [...enrolledCourses, ...completedCourses];
        
        // Remove duplicates
        const uniqueCourses = [];
        const seenIds = new Set();
        allCourses.forEach(course => {
            const courseId = course.id || course;
            if (!seenIds.has(courseId)) {
                seenIds.add(courseId);
                uniqueCourses.push(course);
            }
        });
        
        if (uniqueCourses.length === 0 && Object.keys(progress).length === 0) {
            progressBars.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">No progress tracked yet. Enroll in a course to see your progress!</p>
                    <a href="courses.html" class="btn btn-gradient mt-2">Browse Courses</a>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        // Course progress - show enrolled courses with dynamic progress
        uniqueCourses.forEach((course, index) => {
            const courseId = course.id || course;
            const isCompleted = completedCourses.some(c => (c.id || c) === courseId);
            let courseProgress = progress[courseId];
            
            // If no progress set, calculate based on enrollment date or default to 0
            if (courseProgress === undefined || courseProgress === null) {
                if (isCompleted) {
                    courseProgress = 100;
                } else if (course.enrolledDate) {
                    // Calculate progress based on time enrolled (simulate learning)
                    const enrolledDate = new Date(course.enrolledDate);
                    const daysSinceEnrollment = Math.floor((Date.now() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24));
                    // Simulate 1-2% progress per day, max 95% (unless completed)
                    courseProgress = Math.min(95, Math.max(0, daysSinceEnrollment * 1.5));
                } else {
                    courseProgress = 0;
                }
                
                // Save calculated progress
                if (!this.userData.progress) {
                    this.userData.progress = {};
                }
                this.userData.progress[courseId] = Math.round(courseProgress);
                localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
            }
            
            const courseTitle = course.title || course.name || `Course ${index + 1}`;
            const roundedProgress = Math.round(courseProgress);
            
            // Detailed view for progress page - with bars and controls
            html += `
                <div class="progress-item">
                    <div class="progress-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="progress-details" style="flex: 1;">
                        <div class="progress-info">
                            <span class="progress-label">${courseTitle}</span>
                            <span class="progress-percent">${roundedProgress}%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${roundedProgress}%"></div>
                        </div>
                    </div>
                    <div class="progress-actions" style="display: flex; gap: 0.5rem; margin-left: 1rem;">
                        <button class="btn btn-sm btn-outline-primary" onclick="window.dashboard.updateProgress(${courseId}, -10)" title="Decrease progress">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onclick="window.dashboard.updateProgress(${courseId}, 10)" title="Increase progress">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        progressBars.innerHTML = html || '<p class="text-muted">No progress to display.</p>';
    }
    
    renderCourseProgress() {
        const courseProgressBars = document.getElementById('courseProgressBars');
        if (!courseProgressBars) return;
        
        // Use the same logic as renderProgress
        const progress = this.userData.progress || {};
        const enrolledCourses = this.userData.enrolledCourses || [];
        const completedCourses = this.userData.completedCourses || [];
        const allCourses = [...enrolledCourses, ...completedCourses];
        
        // Remove duplicates
        const uniqueCourses = [];
        const seenIds = new Set();
        allCourses.forEach(course => {
            const courseId = course.id || course;
            if (!seenIds.has(courseId)) {
                seenIds.add(courseId);
                uniqueCourses.push(course);
            }
        });
        
        if (uniqueCourses.length === 0) {
            courseProgressBars.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">No courses enrolled yet. Enroll in a course to track your progress!</p>
                    <a href="courses.html" class="btn btn-gradient mt-2">Browse Courses</a>
                </div>
            `;
            return;
        }
        
        let html = '';
        
        uniqueCourses.forEach((course, index) => {
            const courseId = course.id || course;
            const isCompleted = completedCourses.some(c => (c.id || c) === courseId);
            let courseProgress = progress[courseId];
            
            // Calculate progress if not set
            if (courseProgress === undefined || courseProgress === null) {
                if (isCompleted) {
                    courseProgress = 100;
                } else if (course.enrolledDate) {
                    const enrolledDate = new Date(course.enrolledDate);
                    const daysSinceEnrollment = Math.floor((Date.now() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24));
                    courseProgress = Math.min(95, Math.max(0, daysSinceEnrollment * 1.5));
                } else {
                    courseProgress = 0;
                }
                
                if (!this.userData.progress) {
                    this.userData.progress = {};
                }
                this.userData.progress[courseId] = Math.round(courseProgress);
                localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
            }
            
            const courseTitle = course.title || course.name || `Course ${index + 1}`;
            const roundedProgress = Math.round(courseProgress);
            
            html += `
                <div class="progress-item">
                    <div class="progress-icon">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="progress-details" style="flex: 1;">
                        <div class="progress-info">
                            <span class="progress-label">${courseTitle}</span>
                            <span class="progress-percent">${roundedProgress}%</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${roundedProgress}%"></div>
                        </div>
                    </div>
                    <div class="progress-actions" style="display: flex; gap: 0.5rem; margin-left: 1rem;">
                        <button class="btn btn-sm btn-outline-primary" onclick="window.dashboard.updateProgress(${courseId}, -10)" title="Decrease progress">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary" onclick="window.dashboard.updateProgress(${courseId}, 10)" title="Increase progress">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        courseProgressBars.innerHTML = html;
    }
    
    updateProgress(courseId, change) {
        if (!this.userData.progress) {
            this.userData.progress = {};
        }
        
        const currentProgress = this.userData.progress[courseId] || 0;
        const newProgress = Math.max(0, Math.min(100, currentProgress + change));
        
        this.userData.progress[courseId] = newProgress;
        localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
        
        // Re-render both progress sections
        this.renderProgress();
        this.renderCourseProgress();
        this.renderCourses(); // Update course cards too
        
        // Show notification
        const course = [...(this.userData.enrolledCourses || []), ...(this.userData.completedCourses || [])]
            .find(c => (c.id || c) === courseId);
        const courseName = course?.title || course?.name || 'Course';
        this.showNotification(`Progress updated: ${courseName} - ${newProgress}%`, 'info');
    }
    
    formatProgressKey(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
    }
    
    renderCourses() {
        const coursesGrid = document.getElementById('coursesGrid');
        if (!coursesGrid) return;
        
        // Show enrolled courses (not just completed ones)
        const enrolledCourses = this.userData.enrolledCourses || [];
        const completedCourses = this.userData.completedCourses || [];
        const allCourses = [...enrolledCourses, ...completedCourses];
        
        // Remove duplicates based on course ID
        const uniqueCourses = [];
        const seenIds = new Set();
        allCourses.forEach(course => {
            const courseId = course.id || course;
            if (!seenIds.has(courseId)) {
                seenIds.add(courseId);
                uniqueCourses.push(course);
            }
        });
        
        if (uniqueCourses.length === 0) {
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
        uniqueCourses.forEach(course => {
            const courseId = course.id || course;
            let progress = this.userData.progress?.[courseId];
            
            // Calculate progress if not set
            if (progress === undefined || progress === null) {
                const isCompleted = completedCourses.some(c => (c.id || c) === courseId);
                if (isCompleted) {
                    progress = 100;
                } else if (course.enrolledDate) {
                    const enrolledDate = new Date(course.enrolledDate);
                    const daysSinceEnrollment = Math.floor((Date.now() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24));
                    progress = Math.min(95, Math.max(0, daysSinceEnrollment * 1.5));
                } else {
                    progress = 0;
                }
                
                // Save calculated progress
                if (!this.userData.progress) {
                    this.userData.progress = {};
                }
                this.userData.progress[courseId] = Math.round(progress);
                localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
            }
            
            const isCompleted = completedCourses.some(c => (c.id || c) === courseId);
            const courseTitle = course.title || course.name || 'Course';
            const courseInstructor = course.instructor || 'Career Lens';
            const courseDuration = course.duration || 'Self-paced';
            const courseRating = course.rating || '4.5';
            const coursePlatform = course.platform || '';
            const roundedProgress = Math.round(progress);
            
            html += `
                <div class="course-card">
                    <div class="course-image">
                        <div class="course-badge">${isCompleted ? 'Completed' : coursePlatform || 'Enrolled'}</div>
                    </div>
                    <div class="course-content">
                        <h5 class="course-title">${courseTitle}</h5>
                        <p class="course-instructor">${courseInstructor}</p>
                        <div class="course-meta">
                            <span><i class="fas fa-clock"></i> ${courseDuration}</span>
                            <span class="course-rating"><i class="fas fa-star"></i> ${courseRating}</span>
                        </div>
                        <div class="course-progress">
                            <div class="progress-info">
                                <span>Progress</span>
                                <span>${roundedProgress}%</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: ${roundedProgress}%"></div>
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
        jobs.forEach((job, index) => {
            // Handle both old format (just ID) and new format (full object)
            const jobObj = typeof job === 'object' ? job : { id: job };
            const jobId = jobObj.id || jobObj.title || `job-${index}`;
            const jobTitle = jobObj.title || jobObj.name || 'Job Title';
            const jobCompany = jobObj.company || 'Company';
            const jobLocation = jobObj.location || 'Location';
            const jobSalary = jobObj.salary || 'Competitive';
            
            // Escape single quotes for onclick
            const safeJobId = jobId.toString().replace(/'/g, "\\'");
            
            // Get theme-aware text color
            const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
            const textColor = isDarkMode ? '#f8f9fa' : '#6c757d';
            const companyColor = isDarkMode ? '#adb5bd' : '#6c757d';
            
            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${jobTitle}</h5>
                            <p class="card-text" style="color: ${companyColor};">${jobCompany}</p>
                            <div class="mb-2">
                                <small style="color: ${textColor};">
                                    <i class="fas fa-map-marker-alt"></i> ${jobLocation}
                                </small>
                            </div>
                            <div class="mb-2">
                                <small style="color: ${textColor};">
                                    <i class="fas fa-dollar-sign"></i> ${jobSalary}
                                </small>
                            </div>
                            ${jobObj.type ? `
                            <div class="mb-2">
                                <small style="color: ${textColor};">
                                    <i class="fas fa-briefcase"></i> ${jobObj.type}
                                </small>
                            </div>
                            ` : ''}
                            <div class="d-flex gap-2 mt-3">
                                <a href="job-portal.html" class="btn btn-sm btn-gradient">View Details</a>
                                <button class="btn btn-sm btn-outline-danger" onclick="window.dashboard.removeJob('${safeJobId}')">
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
                    <p class="text-muted">No skills tracked yet. Add your first skill to get started!</p>
                    <button class="btn btn-gradient mt-3" id="addFirstSkill">
                        <i class="fas fa-plus me-2"></i>Add Your First Skill
                    </button>
                </div>
            `;
            
            // Add event listener for the "Add First Skill" button
            const addFirstSkillBtn = document.getElementById('addFirstSkill');
            if (addFirstSkillBtn) {
                addFirstSkillBtn.addEventListener('click', () => {
                    this.showAddSkillForm();
                });
            }
            return;
        }
        
        let html = '';
        skills.forEach((skill, index) => {
            const skillName = skill.name || skill;
            const skillLevel = skill.level || skill.proficiency || 'Beginner';
            const progress = this.getSkillProgress(skillLevel);
            const skillId = skill.id || skill.name || skill || `skill-${index}`;
            // Escape single quotes for onclick
            const safeSkillId = skillId.toString().replace(/'/g, "\\'");
            
            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h5 class="card-title mb-0">${skillName}</h5>
                                <button class="btn btn-sm btn-outline-danger" onclick="window.dashboard.removeSkill('${safeSkillId}')" title="Remove skill">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
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
        
        // Course enrollments (most recent)
        const enrolledCourses = this.userData.enrolledCourses || [];
        enrolledCourses.slice(-3).reverse().forEach((course, index) => {
            activities.push({
                icon: 'fa-book',
                text: `Enrolled in: ${course.title || course.name || 'Course'}`,
                time: course.enrolledDate ? this.getTimeAgo(now - new Date(course.enrolledDate)) : this.getTimeAgo(now - (index + 1) * 3600000)
            });
        });
        
        // Course completions
        const completedCourses = this.userData.completedCourses || [];
        completedCourses.slice(0, 2).forEach((course, index) => {
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
        // Initialize chart for Progress page
        this.initProgressPageChart();
        
        // Initialize chart for Overview page
        this.initOverviewChart();
    }
    
    initProgressPageChart() {
        const chartContainer = document.querySelector('#progress .chart-container');
        if (!chartContainer || typeof Chart === 'undefined') return;
        
        let canvas = document.getElementById('skillsChart');
        
        // Destroy existing chart if it exists
        if (this.skillsChart) {
            this.skillsChart.destroy();
            this.skillsChart = null;
        }
        
        const skills = this.userData.skills || [];
        
        if (skills.length === 0) {
            // Store the chart container HTML structure
            const chartHeader = chartContainer.querySelector('.chart-header');
            if (chartHeader) {
                chartContainer.innerHTML = `
                    <div class="chart-header">
                        <h3 class="chart-title">Skill Progress</h3>
                    </div>
                    <p class="text-muted text-center py-4">No skills data to display. Add skills to see your progress chart!</p>
                `;
            }
            return;
        }
        
        // Restore canvas if it was replaced
        if (!canvas || !chartContainer.querySelector('canvas')) {
            const chartHeader = chartContainer.querySelector('.chart-header');
            if (chartHeader) {
                chartContainer.innerHTML = `
                    <div class="chart-header">
                        <h3 class="chart-title">Skill Progress</h3>
                    </div>
                    <canvas id="skillsChart"></canvas>
                `;
            }
            canvas = document.getElementById('skillsChart');
        }
        
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const labels = skills.map(s => s.name || s);
        const data = skills.map(s => this.getSkillProgress(s.level || s.proficiency || 'Beginner'));
        
        // Get theme-aware colors
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDarkMode ? '#f8f9fa' : '#212529';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
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
                    x: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        titleColor: textColor,
                        bodyColor: textColor,
                        backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                    }
                }
            }
        });
    }
    
    initOverviewChart() {
        const chartContainer = document.querySelector('#overview .chart-container');
        if (!chartContainer || typeof Chart === 'undefined') return;
        
        let canvas = document.getElementById('overviewSkillsChart');
        
        // Destroy existing chart if it exists
        if (this.overviewSkillsChart) {
            this.overviewSkillsChart.destroy();
            this.overviewSkillsChart = null;
        }
        
        const skills = this.userData.skills || [];
        
        if (skills.length === 0) {
            chartContainer.innerHTML = `
                <div class="chart-header">
                    <h3 class="chart-title">Skill Progress</h3>
                </div>
                <p class="text-muted text-center py-4">No skills data to display. Add skills to see your progress chart!</p>
            `;
            return;
        }
        
        // Restore canvas if it was replaced
        if (!canvas || !chartContainer.querySelector('canvas')) {
            chartContainer.innerHTML = `
                <div class="chart-header">
                    <h3 class="chart-title">Skill Progress</h3>
                </div>
                <canvas id="overviewSkillsChart"></canvas>
            `;
            canvas = document.getElementById('overviewSkillsChart');
        }
        
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const labels = skills.map(s => s.name || s);
        const data = skills.map(s => this.getSkillProgress(s.level || s.proficiency || 'Beginner'));
        
        // Generate colors for pie chart
        const colors = [
            'rgba(74, 0, 224, 0.8)',
            'rgba(142, 45, 226, 0.8)',
            'rgba(255, 142, 0, 0.8)',
            'rgba(0, 184, 148, 0.8)',
            'rgba(9, 132, 227, 0.8)',
            'rgba(116, 185, 255, 0.8)',
            'rgba(255, 118, 117, 0.8)',
            'rgba(253, 203, 110, 0.8)'
        ];
        
        // Get theme-aware colors
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDarkMode ? '#f8f9fa' : '#212529';
        
        this.overviewSkillsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skill Proficiency',
                    data: data,
                    backgroundColor: colors.slice(0, skills.length),
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        titleColor: textColor,
                        bodyColor: textColor,
                        backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    initOverviewLearningChart() {
        const progressBars = document.getElementById('progressBars');
        if (!progressBars || typeof Chart === 'undefined') return;
        
        let canvas = document.getElementById('overviewLearningChart');
        
        // Destroy existing chart if it exists
        if (this.overviewLearningChart) {
            this.overviewLearningChart.destroy();
            this.overviewLearningChart = null;
        }
        
        const progress = this.userData.progress || {};
        const enrolledCourses = this.userData.enrolledCourses || [];
        const completedCourses = this.userData.completedCourses || [];
        const allCourses = [...enrolledCourses, ...completedCourses];
        
        // Remove duplicates
        const uniqueCourses = [];
        const seenIds = new Set();
        allCourses.forEach(course => {
            const courseId = course.id || course;
            if (!seenIds.has(courseId)) {
                seenIds.add(courseId);
                uniqueCourses.push(course);
            }
        });
        
        if (uniqueCourses.length === 0) {
            progressBars.innerHTML = '<p class="text-muted text-center py-4">No courses enrolled yet. Enroll in a course to track your progress!</p>';
            return;
        }
        
        // Prepare data for chart
        const labels = [];
        const data = [];
        const colors = [];
        
        uniqueCourses.forEach((course, index) => {
            const courseId = course.id || course;
            const isCompleted = completedCourses.some(c => (c.id || c) === courseId);
            let courseProgress = progress[courseId];
            
            if (courseProgress === undefined || courseProgress === null) {
                if (isCompleted) {
                    courseProgress = 100;
                } else if (course.enrolledDate) {
                    const enrolledDate = new Date(course.enrolledDate);
                    const daysSinceEnrollment = Math.floor((Date.now() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24));
                    courseProgress = Math.min(95, Math.max(0, daysSinceEnrollment * 1.5));
                } else {
                    courseProgress = 0;
                }
            }
            
            const courseTitle = course.title || course.name || `Course ${index + 1}`;
            labels.push(courseTitle.length > 20 ? courseTitle.substring(0, 20) + '...' : courseTitle);
            data.push(Math.round(courseProgress));
            
            // Color based on progress
            if (courseProgress >= 100) {
                colors.push('rgba(0, 184, 148, 0.8)'); // Green for completed
            } else if (courseProgress >= 50) {
                colors.push('rgba(9, 132, 227, 0.8)'); // Blue for in progress
            } else {
                colors.push('rgba(255, 142, 0, 0.8)'); // Orange for just started
            }
        });
        
        // Create canvas if it doesn't exist
        if (!canvas || !progressBars.querySelector('canvas')) {
            progressBars.innerHTML = '<canvas id="overviewLearningChart" style="max-height: 400px;"></canvas>';
            canvas = document.getElementById('overviewLearningChart');
        }
        
        if (!canvas) return;
        
        // Set container style for chart
        progressBars.style.minHeight = '300px';
        
        const ctx = canvas.getContext('2d');
        
        // Get theme-aware colors
        const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDarkMode ? '#f8f9fa' : '#212529';
        const textSecondaryColor = isDarkMode ? '#adb5bd' : '#6c757d';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        // Use horizontal bar chart for learning progress
        this.overviewLearningChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Progress %',
                    data: data,
                    backgroundColor: colors,
                    borderColor: colors.map(c => c.replace('0.8', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            },
                            color: textSecondaryColor
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    y: {
                        ticks: {
                            color: textColor,
                            font: {
                                size: 11
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        titleColor: textColor,
                        bodyColor: textColor,
                        backgroundColor: isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
                        callbacks: {
                            label: function(context) {
                                return 'Progress: ' + context.parsed.x + '%';
                            }
                        }
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
        
        // Add skill button
        const addSkillBtn = document.getElementById('addSkillBtn');
        if (addSkillBtn) {
            addSkillBtn.addEventListener('click', () => {
                this.showAddSkillForm();
            });
        }
        
        // Cancel add skill
        const cancelAddSkill = document.getElementById('cancelAddSkill');
        if (cancelAddSkill) {
            cancelAddSkill.addEventListener('click', () => {
                this.hideAddSkillForm();
            });
        }
        
        // New skill form
        const newSkillForm = document.getElementById('newSkillForm');
        if (newSkillForm) {
            newSkillForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewSkill();
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
            if (section === 'progress') {
                // Always reinitialize chart when switching to progress section to ensure it's up to date
                setTimeout(() => this.initProgressPageChart(), 100);
                // Render course progress for progress page
                this.renderCourseProgress();
            }
            
            // Re-render skills when switching to skills section
            if (section === 'skills') {
                this.renderSkills();
            }
            
            // Re-render courses when switching to courses section
            if (section === 'courses') {
                // Reload user data to get latest enrolled courses
                this.loadUserData();
                this.renderCourses();
            }
            
            // Re-render progress in overview when switching to overview
            if (section === 'overview') {
                this.renderProgress(); // This will call initOverviewLearningChart() internally
                // Initialize overview skill chart
                setTimeout(() => this.initOverviewChart(), 100);
            }
            
            // Hide add skill form if switching away from skills
            if (section !== 'skills') {
                this.hideAddSkillForm();
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
        
        // Remove from userData savedJobs
        this.userData.savedJobs = this.userData.savedJobs.filter(job => {
            const id = typeof job === 'object' ? (job.id || job.title) : job;
            return id.toString() !== jobId.toString();
        });
        
        // Also update localStorage savedJobs
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
        const updatedJobs = savedJobs.filter(job => {
            const id = typeof job === 'object' ? (job.id || job.title) : job;
            return id.toString() !== jobId.toString();
        });
        localStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
        
        // Update careerLensUser
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
    
    showAddSkillForm() {
        const addSkillForm = document.getElementById('addSkillForm');
        if (addSkillForm) {
            addSkillForm.style.display = 'block';
            // Scroll to form
            addSkillForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            // Focus on skill name input
            const skillNameInput = document.getElementById('skillName');
            if (skillNameInput) {
                setTimeout(() => skillNameInput.focus(), 100);
            }
        }
    }
    
    hideAddSkillForm() {
        const addSkillForm = document.getElementById('addSkillForm');
        if (addSkillForm) {
            addSkillForm.style.display = 'none';
            // Reset form
            const newSkillForm = document.getElementById('newSkillForm');
            if (newSkillForm) {
                newSkillForm.reset();
            }
        }
    }
    
    addNewSkill() {
        const skillNameInput = document.getElementById('skillName');
        const skillLevelInput = document.getElementById('skillLevel');
        
        if (!skillNameInput || !skillLevelInput) return;
        
        const skillName = skillNameInput.value.trim();
        const skillLevel = skillLevelInput.value;
        
        if (!skillName || !skillLevel) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Check if skill already exists
        const existingSkills = this.userData.skills || [];
        const skillExists = existingSkills.some(skill => {
            const existingName = (skill.name || skill).toLowerCase();
            return existingName === skillName.toLowerCase();
        });
        
        if (skillExists) {
            this.showNotification('This skill already exists in your list', 'error');
            return;
        }
        
        // Add new skill
        const newSkill = {
            id: `skill-${Date.now()}`,
            name: skillName,
            level: skillLevel,
            proficiency: skillLevel,
            addedDate: new Date().toISOString()
        };
        
        if (!this.userData.skills) {
            this.userData.skills = [];
        }
        
        this.userData.skills.push(newSkill);
        localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
        
        // Hide form and re-render
        this.hideAddSkillForm();
        this.renderSkills();
        this.renderStats();
        this.renderUserProfile();
        this.renderActivity();
        
        // Update charts if on progress or overview page
        if (this.currentSection === 'progress') {
            setTimeout(() => this.initProgressPageChart(), 100);
        } else if (this.currentSection === 'overview') {
            setTimeout(() => this.initOverviewChart(), 100);
        }
        
        this.showNotification(`Skill "${skillName}" added successfully!`, 'success');
    }
    
    removeSkill(skillId) {
        if (!confirm('Are you sure you want to remove this skill?')) {
            return;
        }
        
        this.userData.skills = this.userData.skills.filter(skill => {
            const id = skill.id || skill.name || skill;
            return id.toString() !== skillId.toString();
        });
        
        localStorage.setItem('careerLensUser', JSON.stringify(this.userData));
        
        // Re-render
        this.renderSkills();
        this.renderStats();
        this.renderUserProfile();
        
        // Update charts if on progress or overview page
        if (this.currentSection === 'progress') {
            setTimeout(() => this.initProgressPageChart(), 100);
        } else if (this.currentSection === 'overview') {
            setTimeout(() => this.initOverviewChart(), 100);
        }
        
        this.showNotification('Skill removed successfully', 'info');
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

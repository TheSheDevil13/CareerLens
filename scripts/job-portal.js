// Job Portal for Career Lens

class JobPortal {
    constructor() {
        this.jobs = window.appData?.jobListings || this.getDummyJobs();
        this.filteredJobs = [...this.jobs];
        this.filters = {
            department: '',
            experience: '',
            type: '',
            location: '',
            salary: '',
            remote: false
        };
        this.savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
        this.appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
        
        this.init();
    }
    
    init() {
        this.renderJobs();
        this.initFilters();
        this.initEventListeners();
        this.updateCounts();
    }
    
    getDummyJobs() {
        return [
            {
                id: 1,
                title: "Junior Frontend Developer",
                company: "TechCorp Inc.",
                location: "San Francisco, CA (Remote Available)",
                type: "Full-time",
                salary: "$65,000 - $80,000",
                experience: "0-2 years",
                posted: "2 days ago",
                department: "CSE",
                requirements: ["React", "JavaScript", "HTML/CSS"],
                description: "Join our team building the next generation of web applications..."
            },
            {
                id: 2,
                title: "Backend Developer",
                company: "DataSystems LLC",
                location: "Remote",
                type: "Full-time",
                salary: "$75,000 - $95,000",
                experience: "1-3 years",
                posted: "1 week ago",
                department: "CSE",
                requirements: ["Node.js", "Python", "MongoDB"],
                description: "Build scalable backend systems for our data platform..."
            },
            {
                id: 3,
                title: "Data Analyst",
                company: "Analytics Pro",
                location: "New York, NY",
                type: "Contract",
                salary: "$60,000 - $75,000",
                experience: "0-1 years",
                posted: "3 days ago",
                department: "CSE",
                requirements: ["SQL", "Python", "Excel"],
                description: "Analyze data to provide business insights..."
            }
        ];
    }
    
    renderJobs() {
        const container = document.getElementById('jobListings');
        if (!container) return;
        
        container.innerHTML = this.filteredJobs.map(job => `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-header">
                    <div class="company-logo">
                        <i class="fas fa-building"></i>
                    </div>
                    <div class="job-info">
                        <h4 class="job-title">${job.title}</h4>
                        <p class="company-name">${job.company}</p>
                        <div class="job-meta">
                            <span class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                            <span class="type"><i class="fas fa-briefcase"></i> ${job.type}</span>
                            <span class="salary"><i class="fas fa-dollar-sign"></i> ${job.salary}</span>
                        </div>
                    </div>
                    <div class="job-actions">
                        <button class="btn-action save-job ${this.savedJobs.includes(job.id) ? 'saved' : ''}" 
                                data-action="save" data-job-id="${job.id}">
                            <i class="fas fa-bookmark"></i>
                        </button>
                        <button class="btn-action apply-job ${this.appliedJobs.includes(job.id) ? 'applied' : ''}" 
                                data-action="apply" data-job-id="${job.id}">
                            ${this.appliedJobs.includes(job.id) ? 'Applied' : 'Apply'}
                        </button>
                    </div>
                </div>
                
                <div class="job-body">
                    <div class="job-description">
                        <p>${job.description}</p>
                    </div>
                    
                    <div class="job-requirements">
                        <h6>Requirements:</h6>
                        <div class="requirement-tags">
                            ${job.requirements.map(req => `<span class="tag">${req}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="job-details">
                        <div class="detail">
                            <i class="fas fa-clock"></i>
                            <span>Posted: ${job.posted}</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-user-graduate"></i>
                            <span>Experience: ${job.experience}</span>
                        </div>
                        <div class="detail">
                            <i class="fas fa-layer-group"></i>
                            <span>Department: ${job.department}</span>
                        </div>
                    </div>
                </div>
                
                <div class="job-footer">
                    <button class="btn btn-outline-primary view-details" data-job-id="${job.id}">
                        View Details
                    </button>
                    <button class="btn btn-gradient quick-apply" data-job-id="${job.id}">
                        Quick Apply
                    </button>
                </div>
            </div>
        `).join('');
        
        this.attachJobEventListeners();
    }
    
    initFilters() {
        // Department filter
        const deptFilter = document.getElementById('departmentFilter');
        if (deptFilter) {
            const departments = [...new Set(this.jobs.map(job => job.department))];
            departments.forEach(dept => {
                const option = document.createElement('option');
                option.value = dept;
                option.textContent = dept;
                deptFilter.appendChild(option);
            });
            
            deptFilter.addEventListener('change', (e) => {
                this.filters.department = e.target.value;
                this.applyFilters();
            });
        }
        
        // Experience filter
        const expFilter = document.getElementById('experienceFilter');
        if (expFilter) {
            expFilter.addEventListener('change', (e) => {
                this.filters.experience = e.target.value;
                this.applyFilters();
            });
        }
        
        // Job type filter
        const typeFilter = document.getElementById('typeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filters.type = e.target.value;
                this.applyFilters();
            });
        }
        
        // Location filter
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.filters.location = e.target.value;
                this.applyFilters();
            });
        }
        
        // Remote filter
        const remoteFilter = document.getElementById('remoteFilter');
        if (remoteFilter) {
            remoteFilter.addEventListener('change', (e) => {
                this.filters.remote = e.target.checked;
                this.applyFilters();
            });
        }
        
        // Salary filter
        const salaryFilter = document.getElementById('salaryFilter');
        if (salaryFilter) {
            salaryFilter.addEventListener('input', (e) => {
                this.filters.salary = e.target.value;
                document.getElementById('salaryValue').textContent = `$${e.target.value}k+`;
                this.applyFilters();
            });
        }
        
        // Search filter
        const searchFilter = document.getElementById('searchFilter');
        if (searchFilter) {
            searchFilter.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }
        
        // Clear filters
        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }
    
    initEventListeners() {
        // Sort options
        document.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.sortJobs(e.target.dataset.sort);
            });
        });
        
        // View toggle
        document.querySelectorAll('.view-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                this.toggleView(e.target.dataset.view);
            });
        });
    }
    
    attachJobEventListeners() {
        // Save job buttons
        document.querySelectorAll('.save-job').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = parseInt(e.target.closest('[data-job-id]').dataset.jobId);
                this.toggleSaveJob(jobId);
            });
        });
        
        // Apply job buttons
        document.querySelectorAll('.apply-job').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = parseInt(e.target.closest('[data-job-id]').dataset.jobId);
                this.applyToJob(jobId);
            });
        });
        
        // View details buttons
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = parseInt(e.target.dataset.jobId);
                this.showJobDetails(jobId);
            });
        });
        
        // Quick apply buttons
        document.querySelectorAll('.quick-apply').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = parseInt(e.target.dataset.jobId);
                this.quickApply(jobId);
            });
        });
    }
    
    applyFilters() {
        this.filteredJobs = this.jobs.filter(job => {
            // Department filter
            if (this.filters.department && job.department !== this.filters.department) {
                return false;
            }
            
            // Experience filter
            if (this.filters.experience) {
                const expLevel = this.filters.experience;
                if (expLevel === 'entry' && !job.experience.includes('0-')) {
                    return false;
                } else if (expLevel === 'mid' && !job.experience.includes('-3') && !job.experience.includes('-5')) {
                    return false;
                } else if (expLevel === 'senior' && !job.experience.includes('5+')) {
                    return false;
                }
            }
            
            // Job type filter
            if (this.filters.type && job.type !== this.filters.type) {
                return false;
            }
            
            // Location filter
            if (this.filters.location) {
                if (this.filters.location === 'remote' && !job.location.toLowerCase().includes('remote')) {
                    return false;
                } else if (this.filters.location === 'onsite' && job.location.toLowerCase().includes('remote')) {
                    return false;
                }
            }
            
            // Remote filter
            if (this.filters.remote && !job.location.toLowerCase().includes('remote')) {
                return false;
            }
            
            // Salary filter
            if (this.filters.salary) {
                const minSalary = parseInt(this.filters.salary) * 1000;
                const jobSalary = this.extractSalary(job.salary);
                if (jobSalary < minSalary) {
                    return false;
                }
            }
            
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search;
                const searchable = `${job.title} ${job.company} ${job.description} ${job.requirements.join(' ')}`.toLowerCase();
                if (!searchable.includes(searchTerm)) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.renderJobs();
        this.updateCounts();
    }
    
    extractSalary(salaryString) {
        // Extract numeric salary from string like "$65,000 - $80,000"
        const match = salaryString.match(/\$([0-9,]+)/);
        if (match) {
            return parseInt(match[1].replace(/,/g, ''));
        }
        return 0;
    }
    
    clearFilters() {
        this.filters = {
            department: '',
            experience: '',
            type: '',
            location: '',
            salary: '',
            remote: false,
            search: ''
        };
        
        // Reset filter UI
        document.getElementById('departmentFilter').value = '';
        document.getElementById('experienceFilter').value = '';
        document.getElementById('typeFilter').value = '';
        document.getElementById('locationFilter').value = '';
        document.getElementById('remoteFilter').checked = false;
        document.getElementById('salaryFilter').value = '0';
        document.getElementById('salaryValue').textContent = '$0k+';
        document.getElementById('searchFilter').value = '';
        
        this.filteredJobs = [...this.jobs];
        this.renderJobs();
        this.updateCounts();
    }
    
    sortJobs(criteria) {
        switch(criteria) {
            case 'recent':
                this.filteredJobs.sort((a, b) => {
                    // Sort by posting date (simplified)
                    return this.getDaysAgo(b.posted) - this.getDaysAgo(a.posted);
                });
                break;
                
            case 'salary':
                this.filteredJobs.sort((a, b) => {
                    return this.extractSalary(b.salary) - this.extractSalary(a.salary);
                });
                break;
                
            case 'relevant':
                // Sort by match score (simplified)
                this.filteredJobs.sort((a, b) => {
                    const scoreA = this.calculateMatchScore(a);
                    const scoreB = this.calculateMatchScore(b);
                    return scoreB - scoreA;
                });
                break;
        }
        
        this.renderJobs();
        
        // Update active sort button
        document.querySelectorAll('.sort-option').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-sort="${criteria}"]`).classList.add('active');
    }
    
    getDaysAgo(postedString) {
        // Convert "2 days ago", "1 week ago" to days
        if (postedString.includes('day')) {
            return parseInt(postedString);
        } else if (postedString.includes('week')) {
            return parseInt(postedString) * 7;
        }
        return 0;
    }
    
    calculateMatchScore(job) {
        // Calculate match score based on user profile and job requirements
        const userProfile = JSON.parse(localStorage.getItem('careerLensUser')) || {};
        const userSkills = userProfile.skills || [];
        
        let score = 50; // Base score
        
        // Check skill matches
        job.requirements.forEach(req => {
            if (userSkills.some(skill => skill.toLowerCase().includes(req.toLowerCase()))) {
                score += 10;
            }
        });
        
        // Check experience match
        if (job.experience.includes('0-') || job.experience.includes('1-')) {
            score += 20; // Entry level bonus
        }
        
        return Math.min(score, 100);
    }
    
    toggleView(viewType) {
        const container = document.getElementById('jobListings');
        if (viewType === 'grid') {
            container.classList.add('grid-view');
            container.classList.remove('list-view');
        } else {
            container.classList.add('list-view');
            container.classList.remove('grid-view');
        }
        
        // Update active view button
        document.querySelectorAll('.view-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
    }
    
    toggleSaveJob(jobId) {
        const index = this.savedJobs.indexOf(jobId);
        const button = document.querySelector(`.save-job[data-job-id="${jobId}"]`);
        
        if (index === -1) {
            // Save job
            this.savedJobs.push(jobId);
            button.classList.add('saved');
            button.innerHTML = '<i class="fas fa-bookmark"></i>';
            this.showNotification('Job saved to favorites!', 'success');
        } else {
            // Unsave job
            this.savedJobs.splice(index, 1);
            button.classList.remove('saved');
            button.innerHTML = '<i class="far fa-bookmark"></i>';
            this.showNotification('Job removed from favorites', 'info');
        }
        
        localStorage.setItem('savedJobs', JSON.stringify(this.savedJobs));
        this.updateCounts();
    }
    
    applyToJob(jobId) {
        if (this.appliedJobs.includes(jobId)) {
            alert('You have already applied to this position.');
            return;
        }
        
        // Show application form
        this.showApplicationForm(jobId);
    }
    
    showApplicationForm(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) return;
        
        const formHTML = `
            <div class="application-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4>Apply to ${job.title}</h4>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="jobApplicationForm">
                            <div class="form-group">
                                <label>Full Name *</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Email *</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Phone Number</label>
                                <input type="tel" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Cover Letter</label>
                                <textarea class="form-control" rows="4" 
                                          placeholder="Tell us why you're a good fit for this position..."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Upload Resume/CV *</label>
                                <input type="file" class="form-control" accept=".pdf,.doc,.docx" required>
                            </div>
                            <div class="form-group">
                                <label>Portfolio/LinkedIn Profile</label>
                                <input type="url" class="form-control" placeholder="https://">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-primary" id="cancelApplication">Cancel</button>
                        <button class="btn btn-gradient" id="submitApplication">Submit Application</button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = formHTML;
        document.body.appendChild(modal);
        
        // Event listeners for modal
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#cancelApplication').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#submitApplication').addEventListener('click', () => {
            this.submitApplication(jobId);
            modal.remove();
        });
    }
    
    submitApplication(jobId) {
        this.appliedJobs.push(jobId);
        localStorage.setItem('appliedJobs', JSON.stringify(this.appliedJobs));
        
        // Update UI
        const button = document.querySelector(`.apply-job[data-job-id="${jobId}"]`);
        button.classList.add('applied');
        button.textContent = 'Applied';
        button.disabled = true;
        
        this.showNotification('Application submitted successfully!', 'success');
        this.updateCounts();
    }
    
    quickApply(jobId) {
        if (this.appliedJobs.includes(jobId)) {
            alert('You have already applied to this position.');
            return;
        }
        
        // Quick apply with saved profile
        const userProfile = JSON.parse(localStorage.getItem('careerLensUser')) || {};
        if (!userProfile.name || !userProfile.email) {
            alert('Please complete your profile before quick applying.');
            return;
        }
        
        if (confirm('Apply to this job with your saved profile?')) {
            this.submitApplication(jobId);
        }
    }
    
    showJobDetails(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) return;
        
        const detailsHTML = `
            <div class="job-details-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>${job.title}</h3>
                        <p class="company">${job.company}</p>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="job-overview">
                            <div class="overview-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${job.location}</span>
                            </div>
                            <div class="overview-item">
                                <i class="fas fa-briefcase"></i>
                                <span>${job.type}</span>
                            </div>
                            <div class="overview-item">
                                <i class="fas fa-dollar-sign"></i>
                                <span>${job.salary}</span>
                            </div>
                            <div class="overview-item">
                                <i class="fas fa-clock"></i>
                                <span>Posted: ${job.posted}</span>
                            </div>
                        </div>
                        
                        <div class="job-description">
                            <h5>Job Description</h5>
                            <p>${job.description}</p>
                        </div>
                        
                        <div class="job-requirements">
                            <h5>Requirements</h5>
                            <ul>
                                ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="job-benefits">
                            <h5>Benefits</h5>
                            <ul>
                                <li>Health Insurance</li>
                                <li>Remote Work Options</li>
                                <li>Learning & Development Budget</li>
                                <li>Flexible Hours</li>
                            </ul>
                        </div>
                        
                        <div class="company-info">
                            <h5>About ${job.company}</h5>
                            <p>We are a growing tech company focused on innovation and employee development.</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-outline-primary" onclick="jobPortal.toggleSaveJob(${jobId})">
                            ${this.savedJobs.includes(jobId) ? 'Unsave Job' : 'Save Job'}
                        </button>
                        <button class="btn btn-gradient" onclick="jobPortal.applyToJob(${jobId})" 
                                ${this.appliedJobs.includes(jobId) ? 'disabled' : ''}>
                            ${this.appliedJobs.includes(jobId) ? 'Applied' : 'Apply Now'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modal = document.createElement('div');
        modal.innerHTML = detailsHTML;
        document.body.appendChild(modal);
        
        // Close button
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    updateCounts() {
        // Update job count
        const jobCount = document.getElementById('jobCount');
        if (jobCount) {
            jobCount.textContent = `${this.filteredJobs.length} jobs found`;
        }
        
        // Update saved jobs count
        const savedCount = document.getElementById('savedCount');
        if (savedCount) {
            savedCount.textContent = this.savedJobs.length;
        }
        
        // Update applied jobs count
        const appliedCount = document.getElementById('appliedCount');
        if (appliedCount) {
            appliedCount.textContent = this.appliedJobs.length;
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `job-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        `;
        
        document.querySelector('.job-portal-container').appendChild(notification);
        
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

// Initialize Job Portal
document.addEventListener('DOMContentLoaded', () => {
    window.jobPortal = new JobPortal();
});
// AI Career Coach for Career Lens

class AICareerCoach {
    constructor() {
        this.conversation = [];
        this.isTyping = false;
        this.responses = this.getResponses();
        this.userProfile = this.loadUserProfile();
        this.context = {
            lastTopic: null,
            mentionedSkills: [],
            mentionedPaths: []
        };
        
        this.init();
    }
    
    loadUserProfile() {
        try {
            const profile = JSON.parse(localStorage.getItem('careerLensUser')) || {};
            // Also check for skills in separate storage
            if (!profile.skills) {
                const savedSkills = JSON.parse(localStorage.getItem('userSkills')) || [];
                if (savedSkills.length > 0) {
                    profile.skills = savedSkills;
                }
            }
            return profile;
        } catch (e) {
            return {};
        }
    }
    
    init() {
        // Clear conversation history on page refresh
        this.conversation = [];
        localStorage.removeItem('aiConversation');
        
        this.initEventListeners();
        this.greetUser();
    }
    
    initEventListeners() {
        // Send button
        document.getElementById('sendMessage')?.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Enter key
        document.getElementById('aiChatInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Quick options
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                this.sendUserMessage(question);
            });
        });
    }
    
    sendMessage() {
        const input = document.getElementById('aiChatInput');
        const message = input.value.trim();
        
        if (message && !this.isTyping) {
            this.sendUserMessage(message);
            input.value = '';
        }
    }
    
    sendUserMessage(message) {
        // Add user message to conversation
        this.addMessage('user', message);
        
        // Update context
        this.updateContext(message);
        
        // Generate AI response
        this.generateResponse(message);
    }
    
    updateContext(message) {
        const lowerMessage = message.toLowerCase();
        
        // Track last topic
        if (lowerMessage.includes('career') || lowerMessage.includes('path')) {
            this.context.lastTopic = 'career';
        } else if (lowerMessage.includes('skill')) {
            this.context.lastTopic = 'skill';
        } else if (lowerMessage.includes('job')) {
            this.context.lastTopic = 'job';
        }
        
        // Extract mentioned skills
        const commonSkills = ['react', 'javascript', 'python', 'node', 'aws', 'docker', 'sql', 'typescript', 'java', 'html', 'css'];
        commonSkills.forEach(skill => {
            if (lowerMessage.includes(skill) && !this.context.mentionedSkills.includes(skill)) {
                this.context.mentionedSkills.push(skill);
            }
        });
    }
    
    generateResponse(userMessage) {
        this.isTyping = true;
        this.showTypingIndicator();
        
        // Simulate AI processing delay
        setTimeout(() => {
            this.isTyping = false;
            this.removeTypingIndicator();
            
            const response = this.getAIResponse(userMessage);
            this.addMessage('ai', response);
            
            this.saveConversation();
        }, 1000 + Math.random() * 1000);
    }
    
    getAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase().trim();
        
        // Enhanced pattern matching with multiple variations
        const patterns = {
            greeting: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'],
            career: ['career', 'path', 'roadmap', 'direction', 'what should i do', 'which career', 'career options', 'future'],
            skill: ['skill', 'learn', 'study', 'improve', 'what skills', 'which skills', 'skill gap', 'need to learn', 'should learn'],
            job: ['job', 'apply', 'employment', 'position', 'opening', 'hiring', 'find job', 'job search', 'work'],
            interview: ['interview', 'prepare', 'preparation', 'mock', 'questions', 'how to interview', 'interview tips'],
            resume: ['resume', 'cv', 'curriculum vitae', 'resume help', 'improve resume', 'resume tips', 'cv builder'],
            salary: ['salary', 'pay', 'wage', 'income', 'earn', 'compensation', 'how much', 'salary range', 'money'],
            course: ['course', 'class', 'training', 'tutorial', 'learn', 'education', 'certification', 'bootcamp'],
            help: ['help', 'assist', 'support', 'guide', 'what can you', 'how can you', 'what do you'],
            thanks: ['thanks', 'thank you', 'appreciate', 'grateful'],
            goodbye: ['bye', 'goodbye', 'see you', 'later', 'farewell']
        };
        
        // Check patterns with priority
        for (const [category, keywords] of Object.entries(patterns)) {
            if (keywords.some(keyword => lowerMessage.includes(keyword))) {
                switch(category) {
                    case 'greeting':
                        return this.getGreetingResponse();
                    case 'career':
                        return this.getCareerPathResponse(userMessage);
                    case 'skill':
                        return this.getSkillResponse(userMessage);
                    case 'job':
                        return this.getJobResponse(userMessage);
                    case 'interview':
                        return this.getInterviewResponse(userMessage);
                    case 'resume':
                        return this.getResumeResponse();
                    case 'salary':
                        return this.getSalaryResponse();
                    case 'course':
                        return this.getCourseResponse(userMessage);
                    case 'help':
                        return this.getHelpResponse();
                    case 'thanks':
                        return this.getThanksResponse();
                    case 'goodbye':
                        return this.getGoodbyeResponse();
                }
            }
        }
        
        // Question detection
        if (lowerMessage.includes('?') || lowerMessage.startsWith('what') || lowerMessage.startsWith('how') || 
            lowerMessage.startsWith('why') || lowerMessage.startsWith('when') || lowerMessage.startsWith('where') ||
            lowerMessage.startsWith('who') || lowerMessage.startsWith('can you') || lowerMessage.startsWith('should i')) {
            return this.getQuestionResponse(userMessage);
        }
        
        return this.getGeneralResponse(userMessage);
    }
    
    getCareerPathResponse(userMessage = '') {
        // Refresh user profile
        this.userProfile = this.loadUserProfile();
        
        // Get user's department and skills from profile
        const userDept = this.userProfile.department;
        const userSkills = this.userProfile.skills || [];
        
        // Get career paths from app data
        const appData = window.appData || {};
        const departments = appData.departments || [];
        
        let recommendedPaths = [];
        let departmentName = '';
        
        // Find department and career paths
        if (userDept && departments.length > 0) {
            const dept = departments.find(d => {
                const deptId = String(d.id || '').toLowerCase();
                const deptName = (d.name || '').toLowerCase();
                const userDeptLower = String(userDept).toLowerCase();
                return deptId === userDeptLower || deptName.includes(userDeptLower) || userDeptLower.includes(deptName);
            });
            if (dept && dept.careerPaths && dept.careerPaths.length > 0) {
                recommendedPaths = dept.careerPaths;
                departmentName = dept.name;
            }
        }
        
        // Fallback to CSE if no department found
        if (recommendedPaths.length === 0 && departments.length > 0) {
            const cseDept = departments.find(d => d.name && d.name.toLowerCase().includes('computer'));
            if (cseDept && cseDept.careerPaths) {
                recommendedPaths = cseDept.careerPaths;
                departmentName = cseDept.name;
            }
        }
        
        // If still no paths, use default
        if (recommendedPaths.length === 0) {
            recommendedPaths = [
                { title: "Full Stack Developer", description: "Build complete web applications", salaryRange: { entry: "$65,000" }, skills: [{ name: "JavaScript" }, { name: "React" }, { name: "Node.js" }] },
                { title: "Data Scientist", description: "Extract insights from data using ML and statistics", salaryRange: { entry: "$85,000" }, skills: [{ name: "Python" }, { name: "Machine Learning" }, { name: "Statistics" }] },
                { title: "DevOps Engineer", description: "Bridge development and operations", salaryRange: { entry: "$80,000" }, skills: [{ name: "AWS" }, { name: "Docker" }, { name: "CI/CD" }] }
            ];
        }
        
        // Select top 2-3 paths based on user skills
        const selectedPaths = this.matchPathsToSkills(recommendedPaths, userSkills).slice(0, 3);
        
        return `
            <p>Based on ${departmentName ? `your ${departmentName} background` : 'current market trends'}, here are some career paths I recommend:</p>
            <div class="ai-suggestions">
                ${selectedPaths.map((path, idx) => `
                    <div class="career-path-suggestion ${idx > 0 ? 'mt-3' : ''}">
                        <h6><i class="fas fa-route me-2"></i>${path.title || 'Career Path'}</h6>
                        <p style="color: rgba(255,255,255,0.9); margin-bottom: 0.5rem;">${path.description || 'A promising career path with great growth potential'}</p>
                        <div class="path-details">
                            <small><i class="fas fa-dollar-sign me-1"></i>Entry: ${path.salaryRange?.entry || '$65,000+'}</small>
                            ${path.skills && path.skills.length > 0 ? `<small class="ms-2"><i class="fas fa-code me-1"></i>Key Skills: ${path.skills.slice(0, 3).map(s => s.name || s).join(', ')}</small>` : ''}
                        </div>
                    </div>
                `).join('')}
                <div class="ai-action mt-3">
                    <a href="../pages/career-paths.html" class="btn btn-sm btn-gradient">
                        <i class="fas fa-map me-1"></i> Explore All Career Paths
                    </a>
                </div>
            </div>
        `;
    }
    
    matchPathsToSkills(paths, userSkills) {
        if (!userSkills || userSkills.length === 0) return paths;
        
        // Score each path based on skill match
        const scoredPaths = paths.map(path => {
            let score = 0;
            const pathSkills = path.skills || [];
            const pathSkillNames = pathSkills.map(s => (s.name || s).toLowerCase());
            
            userSkills.forEach(userSkill => {
                const skillName = (userSkill.name || userSkill).toLowerCase();
                if (pathSkillNames.some(ps => ps.includes(skillName) || skillName.includes(ps))) {
                    score += 2;
                }
            });
            
            return { ...path, score };
        });
        
        // Sort by score (highest first)
        return scoredPaths.sort((a, b) => b.score - a.score);
    }
    
    getSkillResponse(userMessage = '') {
        // Refresh user profile
        this.userProfile = this.loadUserProfile();
        
        const userSkills = this.userProfile.skills || [];
        const userDept = this.userProfile.department;
        
        // Get skills from app data based on department
        const appData = window.appData || {};
        const departments = appData.departments || [];
        
        let recommendedSkills = [];
        let departmentName = '';
        
        if (userDept && departments.length > 0) {
            const dept = departments.find(d => {
                const deptId = String(d.id || '').toLowerCase();
                const deptName = (d.name || '').toLowerCase();
                const userDeptLower = String(userDept).toLowerCase();
                return deptId === userDeptLower || deptName.includes(userDeptLower) || userDeptLower.includes(deptName);
            });
            if (dept && dept.careerPaths) {
                // Extract skills from career paths
                const allSkills = new Set();
                dept.careerPaths.forEach(path => {
                    if (path.skills) {
                        path.skills.forEach(skill => {
                            allSkills.add(skill.name || skill);
                        });
                    }
                });
                recommendedSkills = Array.from(allSkills).slice(0, 5);
                departmentName = dept.name;
            }
        }
        
        // Fallback to common tech skills
        if (recommendedSkills.length === 0) {
            recommendedSkills = ["React", "Node.js", "Python", "AWS", "Docker", "TypeScript", "SQL", "JavaScript"];
        }
        
        // Filter out skills user already has
        const userSkillNames = userSkills.map(s => (s.name || s).toLowerCase());
        const newSkills = recommendedSkills.filter(skill => {
            const skillName = (skill.name || skill).toLowerCase();
            return !userSkillNames.some(us => us.includes(skillName) || skillName.includes(us));
        }).slice(0, 4);
        
        // If user has no skills, show all recommendations
        const skillsToShow = newSkills.length > 0 ? newSkills : recommendedSkills.slice(0, 4);
        
        const skillDemand = {
            'React': 95, 'Node.js': 90, 'Python': 92, 'AWS': 88, 'Docker': 85,
            'TypeScript': 87, 'SQL': 90, 'JavaScript': 94, 'Machine Learning': 89,
            'Java': 88, 'C++': 85, 'HTML': 80, 'CSS': 80, 'Git': 85
        };
        
        return `
            <p>Based on ${departmentName ? `your ${departmentName} background` : 'current market trends'}, here are skills I recommend focusing on:</p>
            <div class="skill-recommendations">
                ${skillsToShow.map(skill => {
                    const skillName = skill.name || skill;
                    const demand = skillDemand[skillName] || (75 + Math.floor(Math.random() * 20));
                    return `
                        <div class="skill-recommendation mb-2 p-2" style="background: rgba(255,255,255,0.1); border-radius: 8px;">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <strong style="color: white;"><i class="fas fa-code me-2"></i>${skillName}</strong>
                                <span class="badge bg-success">${demand}% demand</span>
                            </div>
                            <div class="progress" style="height: 6px; background: rgba(255,255,255,0.2);">
                                <div class="progress-bar bg-success" style="width: ${demand}%"></div>
                            </div>
                            <small style="color: rgba(255,255,255,0.8);">High market value • Growing field</small>
                        </div>
                    `;
                }).join('')}
            </div>
            ${userSkills.length > 0 ? `
                <div class="mt-3 p-2" style="background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <small style="color: rgba(255,255,255,0.9);"><i class="fas fa-check-circle text-success me-1"></i>You already have: ${userSkills.slice(0, 3).map(s => s.name || s).join(', ')}${userSkills.length > 3 ? '...' : ''}</small>
                </div>
            ` : ''}
            <div class="ai-action mt-3">
                <a href="../pages/courses.html" class="btn btn-sm btn-gradient">
                    <i class="fas fa-book me-1"></i> Find Courses to Learn These Skills
                </a>
            </div>
        `;
    }
    
    getJobResponse(userMessage = '') {
        // Refresh user profile
        this.userProfile = this.loadUserProfile();
        
        // Get relevant jobs from app data
        const appData = window.appData || {};
        const jobs = appData.jobListings || [];
        const userSkills = this.userProfile.skills || [];
        const userDept = this.userProfile.department;
        
        // Filter jobs based on user profile
        let relevantJobs = jobs;
        if (userDept && jobs.length > 0) {
            const userDeptLower = String(userDept).toLowerCase();
            relevantJobs = jobs.filter(job => {
                if (!job.department) return false;
                const jobDept = job.department.toLowerCase();
                return jobDept.includes(userDeptLower) || userDeptLower.includes(jobDept);
            });
        }
        
        // If no department match, use all jobs
        if (relevantJobs.length === 0) {
            relevantJobs = jobs;
        }
        
        // Match jobs to user skills
        if (userSkills.length > 0 && relevantJobs.length > 0) {
            relevantJobs = relevantJobs.map(job => {
                let matchScore = 0;
                const jobReqs = (job.requirements || []).map(r => String(r).toLowerCase());
                userSkills.forEach(skill => {
                    const skillName = String(skill.name || skill).toLowerCase();
                    if (jobReqs.some(req => req.includes(skillName) || skillName.includes(req))) {
                        matchScore++;
                    }
                });
                return { ...job, matchScore };
            }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
        } else {
            relevantJobs = relevantJobs.slice(0, 3);
        }
        
        return `
            <p>Here are some job search strategies and opportunities:</p>
            <div class="ai-tips mb-3">
                <div class="tip mb-2 p-2" style="background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <i class="fas fa-search text-warning me-2"></i>
                    <strong style="color: white;">Optimize your search:</strong> <span style="color: rgba(255,255,255,0.9);">Use specific keywords like "React Developer" instead of just "Developer"</span>
                </div>
                <div class="tip mb-2 p-2" style="background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <i class="fas fa-network-wired text-warning me-2"></i>
                    <strong style="color: white;">Leverage networks:</strong> <span style="color: rgba(255,255,255,0.9);">Connect with alumni and attend virtual career fairs</span>
                </div>
                <div class="tip mb-2 p-2" style="background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <i class="fas fa-customize text-warning me-2"></i>
                    <strong style="color: white;">Customize applications:</strong> <span style="color: rgba(255,255,255,0.9);">Tailor your resume for each position</span>
                </div>
            </div>
            ${relevantJobs.length > 0 ? `
                <div class="job-suggestions mt-3">
                    <h6 style="color: white;"><i class="fas fa-briefcase me-2"></i>Jobs matching your profile:</h6>
                    ${relevantJobs.map(job => `
                        <div class="job-suggestion p-2 mb-2" style="background: rgba(255,255,255,0.1); border-radius: 8px; border-left: 3px solid #FFC400;">
                            <strong style="color: white;">${job.title || 'Job Title'}</strong> at ${job.company || 'Company'}
                            <div style="color: rgba(255,255,255,0.8); font-size: 0.85rem; margin-top: 0.25rem;">
                                <i class="fas fa-map-marker-alt me-1"></i>${job.location || 'Location'} • 
                                <i class="fas fa-dollar-sign me-1"></i>${job.salary || 'Competitive'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="ai-action mt-3">
                <a href="../pages/job-portal.html" class="btn btn-sm btn-gradient">
                    <i class="fas fa-search me-1"></i> Browse All Job Openings
                </a>
            </div>
        `;
    }
    
    getInterviewResponse(userMessage = '') {
        // Refresh user profile
        this.userProfile = this.loadUserProfile();
        
        const userDept = this.userProfile.department;
        const userSkills = this.userProfile.skills || [];
        
        // Get interview questions from app data
        const appData = window.appData || {};
        const interviewQuestions = appData.interviewQuestions || [];
        
        // Filter questions based on department/skills
        let relevantQuestions = interviewQuestions;
        if (userDept && interviewQuestions.length > 0) {
            const deptLower = String(userDept).toLowerCase();
            if (deptLower.includes('computer') || deptLower.includes('cse') || deptLower.includes('software') || deptLower.includes('engineering')) {
                relevantQuestions = interviewQuestions.filter(q => 
                    q.category === 'technical' || q.category === 'coding' || q.category === 'programming'
                );
            }
        }
        
        // Default questions if no data
        if (relevantQuestions.length === 0) {
            relevantQuestions = [
                { question: "Tell me about yourself", category: "general", tip: "Focus on your background, skills, and what makes you a good fit" },
                { question: "Why do you want this job?", category: "general", tip: "Show enthusiasm and alignment with company values" },
                { question: "What are your strengths and weaknesses?", category: "general", tip: "Be honest but frame weaknesses as areas for growth" },
                { question: "Where do you see yourself in 5 years?", category: "general", tip: "Show ambition while staying realistic" },
                { question: "Why should we hire you?", category: "general", tip: "Highlight unique value you bring to the role" }
            ];
        }
        
        const questionsToShow = relevantQuestions.slice(0, 5);
        
        return `
            <p>Let me help you prepare for interviews:</p>
            <div class="ai-prep">
                <h6 style="color: white;"><i class="fas fa-question-circle me-2"></i>Common interview questions ${userDept ? 'for your field' : 'to prepare for'}:</h6>
                <div class="interview-questions">
                    ${questionsToShow.map((q, idx) => `
                        <div class="question-item p-2 mb-2" style="background: rgba(255,255,255,0.1); border-radius: 8px; border-left: 3px solid #FFC400;">
                            <strong style="color: white;">Q${idx + 1}:</strong> <span style="color: rgba(255,255,255,0.9);">${q.question || q}</span>
                            ${q.tip ? `<div style="color: rgba(255,255,255,0.8); font-size: 0.85rem; margin-top: 0.5rem;"><i class="fas fa-lightbulb text-warning me-1"></i>${q.tip}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="interview-tips mt-3 p-3" style="background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <h6 style="color: white;"><i class="fas fa-tips me-2"></i>Interview Tips:</h6>
                    <ul class="mb-0" style="color: rgba(255,255,255,0.9);">
                        <li>Research the company and role beforehand</li>
                        <li>Prepare STAR method answers (Situation, Task, Action, Result)</li>
                        <li>Practice your answers out loud</li>
                        <li>Prepare thoughtful questions to ask the interviewer</li>
                        <li>Dress professionally and arrive early (or test tech for virtual interviews)</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    getResumeResponse() {
        return `
            <p>Here are some resume improvement suggestions:</p>
            <div class="ai-resume-tips">
                <div class="tip">
                    <strong>✓ Use action verbs:</strong> "Developed", "Implemented", "Optimized"
                </div>
                <div class="tip">
                    <strong>✓ Quantify achievements:</strong> "Increased performance by 40%" instead of "Improved performance"
                </div>
                <div class="tip">
                    <strong>✓ Keep it concise:</strong> 1 page for &lt;5 years experience
                </div>
            </div>
            <div class="ai-action mt-3">
                <a href="../pages/cv-builder.html" class="btn btn-sm btn-gradient">
                    <i class="fas fa-edit me-1"></i> Use CV Builder
                </a>
            </div>
        `;
    }
    
    getSalaryResponse() {
        // Refresh user profile
        this.userProfile = this.loadUserProfile();
        
        const userDept = this.userProfile.department;
        const userSkills = this.userProfile.skills || [];
        
        // Get salary data from app data
        const appData = window.appData || {};
        const departments = appData.departments || [];
        
        let baseSalary = 70000;
        let salaryRange = { entry: "$65,000", senior: "$120,000+" };
        let departmentName = '';
        
        if (userDept && departments.length > 0) {
            const dept = departments.find(d => {
                const deptId = String(d.id || '').toLowerCase();
                const deptName = (d.name || '').toLowerCase();
                const userDeptLower = String(userDept).toLowerCase();
                return deptId === userDeptLower || deptName.includes(userDeptLower) || userDeptLower.includes(deptName);
            });
            if (dept) {
                departmentName = dept.name;
                const salaryStr = dept.avgEntrySalary || '$70,000';
                baseSalary = parseInt(salaryStr.replace(/[^0-9]/g, '') || '70000');
                if (dept.careerPaths && dept.careerPaths.length > 0) {
                    const topPath = dept.careerPaths[0];
                    if (topPath.salaryRange) {
                        salaryRange = topPath.salaryRange;
                    }
                }
            }
        }
        
        // Adjust based on skills
        const skillBonus = userSkills.length * 2000;
        const adjustedMin = baseSalary + skillBonus;
        const adjustedMax = adjustedMin + 30000;
        
        const range = `$${adjustedMin.toLocaleString()} - $${adjustedMax.toLocaleString()}`;
        
        return `
            <p>Based on ${departmentName ? `your ${departmentName} background` : 'industry standards'} and your profile, here's the expected salary range:</p>
            <div class="salary-estimate">
                <h3 class="text-center my-3" style="color: white; font-size: 2rem;">${range}</h3>
                <p class="text-center" style="color: rgba(255,255,255,0.8);">Annual base salary (entry level)</p>
                
                <div class="salary-factors mt-3 p-3" style="background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <h6 style="color: white;"><i class="fas fa-chart-line me-2"></i>Factors considered:</h6>
                    <ul class="mb-0" style="color: rgba(255,255,255,0.9);">
                        <li>Entry-level position (0-2 years experience)</li>
                        <li>${userSkills.length > 0 ? `${userSkills.length} skills in your profile` : 'Industry average skills'}</li>
                        <li>${departmentName || 'Market average'}</li>
                        <li>Geographic location (varies by region)</li>
                    </ul>
                </div>
                
                <div class="salary-tips mt-3 p-3" style="background: rgba(255,255,255,0.1); border-radius: 8px;">
                    <h6 style="color: white;"><i class="fas fa-lightbulb me-2"></i>Salary Growth Tips:</h6>
                    <ul class="mb-0 small" style="color: rgba(255,255,255,0.9);">
                        <li>Gain 2-3 years experience: +30-50% increase</li>
                        <li>Learn in-demand skills: +10-20% per skill</li>
                        <li>Get certifications: +5-15% boost</li>
                        <li>Consider remote US positions: +20-40%</li>
                    </ul>
                </div>
                
                <div class="ai-action mt-3">
                    <a href="../pages/salary-estimator.html" class="btn btn-sm btn-gradient">
                        <i class="fas fa-calculator me-1"></i> Get Detailed Salary Estimate
                    </a>
                </div>
            </div>
        `;
    }
    
    getCourseResponse(userMessage = '') {
        // Refresh user profile
        this.userProfile = this.loadUserProfile();
        
        // Get courses from app data
        const appData = window.appData || {};
        const courses = appData.courses || [];
        const userSkills = this.userProfile.skills || [];
        const userDept = this.userProfile.department;
        
        // Filter courses based on user profile
        let relevantCourses = courses;
        
        // Match courses to user skills or department
        if ((userSkills.length > 0 || userDept) && courses.length > 0) {
            relevantCourses = courses.map(course => {
                let matchScore = 0;
                const courseTitle = String(course.title || '').toLowerCase();
                const courseDesc = String(course.description || '').toLowerCase();
                
                // Check skill matches
                userSkills.forEach(skill => {
                    const skillName = String(skill.name || skill).toLowerCase();
                    if (courseTitle.includes(skillName) || courseDesc.includes(skillName)) {
                        matchScore += 2;
                    }
                });
                
                // Check department matches
                if (userDept && course.department) {
                    const courseDept = String(course.department).toLowerCase();
                    const userDeptLower = String(userDept).toLowerCase();
                    if (courseDept.includes(userDeptLower) || userDeptLower.includes(courseDept)) {
                        matchScore += 1;
                    }
                }
                
                return { ...course, matchScore };
            }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
        } else if (courses.length > 0) {
            // Show popular courses
            relevantCourses = courses
                .sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0))
                .slice(0, 3);
        }
        
        // Fallback courses if no data
        if (relevantCourses.length === 0) {
            relevantCourses = [
                { title: "The Complete Web Developer Bootcamp", platform: "Udemy", rating: "4.7", duration: "65 hours" },
                { title: "React - The Complete Guide", platform: "Udemy", rating: "4.8", duration: "48 hours" },
                { title: "Python for Data Science", platform: "Coursera", rating: "4.6", duration: "40 hours" }
            ];
        }
        
        return `
            <p>Here are some highly-rated courses ${userSkills.length > 0 ? 'matching your interests' : 'for your career path'}:</p>
            <div class="course-recommendations">
                ${relevantCourses.map(course => `
                    <div class="course-rec p-2 mb-2" style="background: rgba(255,255,255,0.1); border-radius: 8px;">
                        <strong style="color: white;"><i class="fas fa-graduation-cap me-2"></i>${course.title || 'Course'}</strong>
                        <div style="color: rgba(255,255,255,0.8); font-size: 0.85rem; margin-top: 0.25rem;">
                            ${course.platform || 'Online'} • 
                            <i class="fas fa-star text-warning me-1"></i>${course.rating || '4.5'}/5 • 
                            <i class="fas fa-clock me-1"></i>${course.duration || 'Self-paced'}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="ai-action mt-3">
                <a href="../pages/courses.html" class="btn btn-sm btn-gradient">
                    <i class="fas fa-book me-1"></i> Browse All Courses
                </a>
            </div>
        `;
    }
    
    getGeneralResponse(userMessage = '') {
        // Try to extract intent from the message
        const lowerMessage = userMessage.toLowerCase();
        
        // Check for specific intents even if keywords weren't matched
        if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
            return "Great! Let's start your career journey. I can help you with:<br><ul><li>Finding the right career path</li><li>Identifying skills to learn</li><li>Job search strategies</li><li>Interview preparation</li><li>Resume building</li></ul>What would you like to focus on first?";
        }
        
        if (lowerMessage.includes('confused') || lowerMessage.includes('lost') || lowerMessage.includes('don\'t know')) {
            return "I understand it can be overwhelming! Let's break it down step by step. First, tell me about your background - what's your department or field of study? Then I can suggest specific career paths and skills to focus on.";
        }
        
        if (lowerMessage.includes('stuck') || lowerMessage.includes('struggling')) {
            return "You're not alone! Many graduates face challenges. Let me help you identify what's blocking your progress. Are you struggling with:<br><ul><li>Finding the right career direction?</li><li>Learning new skills?</li><li>Getting job interviews?</li><li>Something else?</li></ul>Tell me more and I'll provide specific guidance.";
        }
        
        const responses = [
            "I'm here to help you with your career journey. You can ask me about career paths, skills, jobs, interviews, resumes, or salaries. What would you like to know?",
            "I'm your AI Career Coach! I can help you find the right career path, improve your skills, prepare for interviews, and more. How can I assist you?",
            "Tell me about your career goals and I'll help you create a plan to achieve them. You can ask me anything about career development!",
            "I specialize in helping fresh graduates navigate their career paths. Try asking me:<br>• 'What career path should I choose?'<br>• 'What skills should I learn?'<br>• 'Help me find jobs'<br>• 'How do I prepare for interviews?'"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getGreetingResponse() {
        const userName = this.userProfile.name || '';
        const greetings = [
            `Hello${userName ? `, ${userName.split(' ')[0]}` : ''}! I'm your AI Career Coach. How can I help you today?`,
            `Hi there${userName ? ` ${userName.split(' ')[0]}` : ''}! Ready to work on your career development? What would you like to focus on?`,
            `Welcome back${userName ? ` ${userName.split(' ')[0]}` : ''}! I'm here to help you achieve your career goals. What's on your mind today?`
        ];
        
        return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    getHelpResponse() {
        return `
            <p>I'm your AI Career Coach, and I'm here to help you with:</p>
            <div class="ai-help-list">
                <div class="help-item mb-2">
                    <strong style="color: white;"><i class="fas fa-route me-2 text-warning"></i>Career Paths:</strong> <span style="color: rgba(255,255,255,0.9);">Get personalized career recommendations</span>
                </div>
                <div class="help-item mb-2">
                    <strong style="color: white;"><i class="fas fa-code me-2 text-warning"></i>Skills:</strong> <span style="color: rgba(255,255,255,0.9);">Learn which skills to develop for your career</span>
                </div>
                <div class="help-item mb-2">
                    <strong style="color: white;"><i class="fas fa-briefcase me-2 text-warning"></i>Jobs:</strong> <span style="color: rgba(255,255,255,0.9);">Get job search tips and find opportunities</span>
                </div>
                <div class="help-item mb-2">
                    <strong style="color: white;"><i class="fas fa-user-tie me-2 text-warning"></i>Interviews:</strong> <span style="color: rgba(255,255,255,0.9);">Prepare for interviews with tips and practice</span>
                </div>
                <div class="help-item mb-2">
                    <strong style="color: white;"><i class="fas fa-file-alt me-2 text-warning"></i>Resume/CV:</strong> <span style="color: rgba(255,255,255,0.9);">Get advice on building a great resume</span>
                </div>
                <div class="help-item mb-2">
                    <strong style="color: white;"><i class="fas fa-calculator me-2 text-warning"></i>Salary:</strong> <span style="color: rgba(255,255,255,0.9);">Understand salary expectations for your field</span>
                </div>
            </div>
            <p class="mt-3" style="color: rgba(255,255,255,0.9);">Just ask me anything about your career, and I'll provide personalized guidance!</p>
        `;
    }
    
    getThanksResponse() {
        const responses = [
            "You're welcome! I'm always here to help. Is there anything else you'd like to know?",
            "Happy to help! Feel free to ask me anything else about your career journey.",
            "My pleasure! Don't hesitate to reach out if you need more guidance."
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getGoodbyeResponse() {
        const responses = [
            "Goodbye! Good luck with your career journey. Come back anytime if you need help!",
            "See you later! Keep working on your goals - you've got this!",
            "Farewell! Remember, I'm always here when you need career guidance. Take care!"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    getQuestionResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Handle specific question patterns
        if (lowerMessage.includes('what') && (lowerMessage.includes('career') || lowerMessage.includes('path'))) {
            return this.getCareerPathResponse(userMessage);
        }
        
        if (lowerMessage.includes('what') && lowerMessage.includes('skill')) {
            return this.getSkillResponse(userMessage);
        }
        
        if (lowerMessage.includes('how') && (lowerMessage.includes('find') || lowerMessage.includes('get')) && lowerMessage.includes('job')) {
            return this.getJobResponse(userMessage);
        }
        
        if (lowerMessage.includes('how') && lowerMessage.includes('prepare') && lowerMessage.includes('interview')) {
            return this.getInterviewResponse(userMessage);
        }
        
        if (lowerMessage.includes('how much') || (lowerMessage.includes('what') && lowerMessage.includes('salary'))) {
            return this.getSalaryResponse();
        }
        
        // Generic question response
        return `
            <p>That's a great question! Let me help you with that.</p>
            <p>Could you be more specific? For example:</p>
            <ul style="color: rgba(255,255,255,0.9);">
                <li>"What career path should I choose?"</li>
                <li>"What skills should I learn?"</li>
                <li>"How do I find jobs?"</li>
                <li>"How do I prepare for interviews?"</li>
                <li>"What salary can I expect?"</li>
            </ul>
            <p style="color: rgba(255,255,255,0.9);">Or you can use the quick options above to get started!</p>
        `;
    }
    
    addMessage(sender, content) {
        const messagesContainer = document.getElementById('aiChatMessages');
        const messageDiv = document.createElement('div');
        
        messageDiv.className = `message ${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${content}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        this.conversation.push({ sender, content, timestamp: new Date().toISOString() });
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('aiChatMessages');
        const typingDiv = document.createElement('div');
        
        typingDiv.className = 'message ai-message typing';
        typingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        
        typingDiv.id = 'typingIndicator';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    greetUser() {
        if (this.conversation.length === 0) {
            const userName = this.userProfile.name || '';
            const userDept = this.userProfile.department;
            
            let greeting = "Hello! I'm your AI Career Coach. How can I help you today?";
            
            if (userName) {
                const firstName = userName.split(' ')[0];
                greeting = `Hello, ${firstName}! I'm your AI Career Coach. `;
                if (userDept) {
                    greeting += `I see you're interested in ${this.getDepartmentName(userDept)}. `;
                }
                greeting += "How can I help you with your career journey today?";
            } else {
                const greetings = [
                    "Hello! I'm your AI Career Coach. I can help you find career paths, learn skills, find jobs, and more. What would you like to start with?",
                    "Hi there! Ready to take your career to the next level? I'm here to guide you through your career journey. What would you like to work on?",
                    "Welcome! I'm your AI Career Coach. I specialize in helping fresh graduates navigate their career paths. How can I assist you today?"
                ];
                greeting = greetings[Math.floor(Math.random() * greetings.length)];
            }
            
            this.addMessage('ai', greeting);
        }
    }
    
    getDepartmentName(deptId) {
        const departments = window.appData?.departments || [];
        const dept = departments.find(d => d.id === deptId || d.name.toLowerCase().includes(deptId.toLowerCase()));
        return dept ? dept.name : deptId;
    }
    
    loadConversation() {
        const saved = localStorage.getItem('aiConversation');
        if (saved) {
            this.conversation = JSON.parse(saved);
            
            // Display conversation
            const messagesContainer = document.getElementById('aiChatMessages');
            messagesContainer.innerHTML = '';
            
            this.conversation.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = `message ${msg.sender}-message`;
                messageDiv.innerHTML = `
                    <div class="message-content">
                        ${msg.content}
                    </div>
                `;
                messagesContainer.appendChild(messageDiv);
            });
            
            // Scroll to bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    saveConversation() {
        // Keep only last 50 messages
        if (this.conversation.length > 50) {
            this.conversation = this.conversation.slice(-50);
        }
        
        localStorage.setItem('aiConversation', JSON.stringify(this.conversation));
    }
    
    getResponses() {
        return {
            greetings: [
                "Hello! I'm your AI Career Coach. How can I assist you today?",
                "Hi there! Ready to work on your career development?",
                "Welcome! Let's make your career dreams a reality."
            ],
            
            careerPath: [
                "Based on your profile, I recommend exploring Full Stack Development. Would you like to see a detailed roadmap?",
                "Data Science seems like a good fit for your skills. The demand is growing rapidly in this field.",
                "Have you considered Product Management? It combines technical knowledge with business skills."
            ],
            
            skills: [
                "I recommend focusing on React and Node.js. These skills are in high demand right now.",
                "Cloud computing skills like AWS or Azure can really boost your career prospects.",
                "Don't forget about soft skills! Communication and teamwork are equally important."
            ],
            
            encouragement: [
                "You're making great progress! Keep going!",
                "Every step forward is progress. You've got this!",
                "Remember, even small improvements add up over time. Stay consistent!"
            ]
        };
    }
}

// Initialize AI Coach when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.aiCoach = new AICareerCoach();
});
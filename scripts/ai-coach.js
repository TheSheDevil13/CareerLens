// AI Career Coach for Carrier Lens

class AICareerCoach {
    constructor() {
        this.conversation = [];
        this.isTyping = false;
        this.responses = this.getResponses();
        this.userProfile = JSON.parse(localStorage.getItem('carrierLensUser')) || {};
        
        this.init();
    }
    
    init() {
        this.loadConversation();
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
        
        // Generate AI response
        this.generateResponse(message);
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
        const lowerMessage = userMessage.toLowerCase();
        
        // Check for specific keywords
        if (lowerMessage.includes('career') || lowerMessage.includes('path')) {
            return this.getCareerPathResponse();
        } else if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
            return this.getSkillResponse();
        } else if (lowerMessage.includes('job') || lowerMessage.includes('apply')) {
            return this.getJobResponse();
        } else if (lowerMessage.includes('interview') || lowerMessage.includes('prepare')) {
            return this.getInterviewResponse();
        } else if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
            return this.getResumeResponse();
        } else if (lowerMessage.includes('salary') || lowerMessage.includes('pay')) {
            return this.getSalaryResponse();
        } else if (lowerMessage.includes('course') || lowerMessage.includes('learn')) {
            return this.getCourseResponse();
        } else {
            return this.getGeneralResponse();
        }
    }
    
    getCareerPathResponse() {
        const paths = [
            "Full Stack Developer",
            "Data Scientist", 
            "DevOps Engineer",
            "Product Manager",
            "UX Designer"
        ];
        
        const randomPath = paths[Math.floor(Math.random() * paths.length)];
        
        return `
            <p>Based on your profile, I recommend considering <strong>${randomPath}</strong> as a career path.</p>
            <div class="ai-suggestions">
                <h6>Why this path?</h6>
                <ul>
                    <li>High demand in the market</li>
                    <li>Good salary growth potential</li>
                    <li>Matches your current skills</li>
                </ul>
                <p class="mt-2"><a href="../pages/career-paths.html" class="ai-link">View detailed roadmap →</a></p>
            </div>
        `;
    }
    
    getSkillResponse() {
        const skills = ["React", "Node.js", "Python", "AWS", "Docker"];
        const neededSkills = skills.slice(0, 2 + Math.floor(Math.random() * 2));
        
        return `
            <p>Based on current market trends, I recommend focusing on these skills:</p>
            <div class="skill-recommendations">
                ${neededSkills.map(skill => `
                    <div class="skill-recommendation">
                        <strong>${skill}</strong>
                        <div class="progress mt-1">
                            <div class="progress-bar" style="width: ${30 + Math.random() * 50}%"></div>
                        </div>
                        <small>Market demand: ${70 + Math.random() * 30}%</small>
                    </div>
                `).join('')}
            </div>
            <p class="mt-2"><a href="../pages/courses.html" class="ai-link">Find relevant courses →</a></p>
        `;
    }
    
    getJobResponse() {
        return `
            <p>Here are some job search tips for you:</p>
            <div class="ai-tips">
                <div class="tip">
                    <i class="fas fa-search"></i>
                    <strong>Optimize your search:</strong> Use specific keywords like "React Developer" instead of just "Developer"
                </div>
                <div class="tip">
                    <i class="fas fa-network-wired"></i>
                    <strong>Leverage networks:</strong> Connect with alumni and attend virtual career fairs
                </div>
                <div class="tip">
                    <i class="fas fa-customize"></i>
                    <strong>Customize applications:</strong> Tailor your resume for each position
                </div>
            </div>
            <p class="mt-2"><a href="../pages/job-portal.html" class="ai-link">Browse current job openings →</a></p>
        `;
    }
    
    getInterviewResponse() {
        return `
            <p>Let me help you prepare for interviews:</p>
            <div class="ai-prep">
                <h6>Common interview questions for your field:</h6>
                <ul>
                    <li>Explain the difference between var, let, and const</li>
                    <li>What is React's virtual DOM?</li>
                    <li>How would you optimize website performance?</li>
                </ul>
                <div class="ai-action mt-3">
                    <a href="../pages/interview-prep.html" class="btn btn-sm btn-gradient">
                        <i class="fas fa-play-circle me-1"></i> Start Mock Interview
                    </a>
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
        const range = `$${Math.floor(60000 + Math.random() * 40000)} - $${Math.floor(90000 + Math.random() * 50000)}`;
        
        return `
            <p>Based on your experience and location, the expected salary range is:</p>
            <div class="salary-estimate">
                <h3 class="text-center my-3">${range}</h3>
                <p class="text-center text-muted">Annual base salary</p>
                
                <div class="salary-factors mt-3">
                    <h6>Factors considered:</h6>
                    <ul>
                        <li>Years of experience</li>
                        <li>Technical skills</li>
                        <li>Geographic location</li>
                        <li>Company size</li>
                    </ul>
                </div>
                
                <div class="ai-action mt-3">
                    <a href="../pages/salary-estimator.html" class="btn btn-sm btn-gradient">
                        <i class="fas fa-calculator me-1"></i> Get Detailed Estimate
                    </a>
                </div>
            </div>
        `;
    }
    
    getCourseResponse() {
        return `
            <p>Here are some highly-rated courses for your career path:</p>
            <div class="course-recommendations">
                <div class="course-rec">
                    <strong>The Complete Web Developer Bootcamp</strong>
                    <small>Udemy • 4.7/5 • 65 hours</small>
                    <a href="#" class="d-block mt-1">View Course →</a>
                </div>
                <div class="course-rec mt-2">
                    <strong>React - The Complete Guide</strong>
                    <small>Udemy • 4.8/5 • 48 hours</small>
                    <a href="#" class="d-block mt-1">View Course →</a>
                </div>
            </div>
            <p class="mt-2"><a href="../pages/courses.html" class="ai-link">Browse all courses →</a></p>
        `;
    }
    
    getGeneralResponse() {
        const responses = [
            "I'm here to help you with your career journey. You can ask me about career paths, skills, jobs, interviews, resumes, or salaries.",
            "I'm your AI Career Coach! I can help you find the right career path, improve your skills, prepare for interviews, and more.",
            "Tell me about your career goals and I'll help you create a plan to achieve them. You can ask me anything about career development.",
            "I specialize in helping fresh graduates navigate their career paths. How can I assist you today?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
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
            const greetings = [
                "Hello! I'm your AI Career Coach. How can I help you today?",
                "Hi there! Ready to take your career to the next level? What would you like to work on?",
                "Welcome back! I'm here to help you achieve your career goals. What's on your mind today?"
            ];
            
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];
            this.addMessage('ai', greeting);
        }
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
// CV Builder for Career Lens

class CVBuilder {
    constructor() {
        this.templates = window.appData?.cvTemplates || this.getDefaultTemplates();
        this.currentTemplate = 1;
        this.userData = this.getDefaultUserData();
        this.sections = ['header', 'summary', 'experience', 'education', 'skills', 'projects'];
        this.currentSection = 0;
        
        this.init();
    }
    
    init() {
        this.loadTemplates();
        this.loadUserData();
        this.initEventListeners();
        this.renderPreview();
        this.updateProgress();
    }
    
    loadTemplates() {
        const container = document.getElementById('templateGallery');
        if (!container) return;
        
        container.innerHTML = this.templates.map(template => `
            <div class="template-item ${template.id === this.currentTemplate ? 'selected' : ''}" 
                 onclick="cvBuilder.selectTemplate(${template.id})">
                <div class="template-preview" style="background: linear-gradient(135deg, ${template.color1 || '#4A00E0'}, ${template.color2 || '#8E2DE2'})">
                    <div class="template-name-preview">
                        <h4 style="color: white; text-align: center; margin-top: 60px;">${template.name}</h4>
                    </div>
                </div>
                <div class="template-name">${template.name}</div>
            </div>
        `).join('');
    }
    
    selectTemplate(templateId) {
        this.currentTemplate = templateId;
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`.template-item[onclick*="${templateId}"]`).classList.add('selected');
        this.renderPreview();
    }
    
    loadUserData() {
        const savedData = localStorage.getItem('cvData');
        if (savedData) {
            this.userData = JSON.parse(savedData);
        }
        
        // Populate form fields
        this.sections.forEach(section => {
            const inputs = document.querySelectorAll(`[data-field="${section}"]`);
            inputs.forEach(input => {
                if (this.userData[section] && this.userData[section][input.name]) {
                    input.value = this.userData[section][input.name];
                }
            });
        });
    }
    
    initEventListeners() {
        // Form inputs
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateField(e.target);
            });
        });
        
        // Section controls
        document.querySelectorAll('.add-section').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addSection();
            });
        });
        
        document.querySelectorAll('.remove-section').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.section-item');
                this.removeSection(section.dataset.section);
            });
        });
        
        // Color picker
        document.querySelectorAll('.color-option').forEach(color => {
            color.addEventListener('click', (e) => {
                this.changeColor(e.target.dataset.color);
            });
        });
        
        // Font picker
        document.querySelectorAll('.font-option').forEach(font => {
            font.addEventListener('click', (e) => {
                this.changeFont(e.target.dataset.font);
            });
        });
        
        // Action buttons
        document.getElementById('downloadPDF')?.addEventListener('click', () => {
            this.downloadPDF();
        });
        
        document.getElementById('downloadDOCX')?.addEventListener('click', () => {
            this.downloadDOCX();
        });
        
        document.getElementById('saveDraft')?.addEventListener('click', () => {
            this.saveDraft();
        });
        
        document.getElementById('resetCV')?.addEventListener('click', () => {
            this.resetCV();
        });
        
        // AI suggestions
        document.querySelectorAll('.ai-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.getAISuggestion(e.target.dataset.section);
            });
        });
        
        // Skill tags
        document.querySelectorAll('.add-tag-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.addSkillTag(e.target.closest('.field-group'));
            });
        });
    }
    
    updateField(input) {
        const section = input.dataset.section;
        const field = input.name;
        const value = input.value;
        
        if (!this.userData[section]) {
            this.userData[section] = {};
        }
        
        this.userData[section][field] = value;
        this.saveData();
        this.renderPreview();
    }
    
    addSection() {
        const sections = ['certifications', 'languages', 'awards', 'volunteer', 'references'];
        const availableSections = sections.filter(s => !this.sections.includes(s));
        
        if (availableSections.length > 0) {
            const newSection = availableSections[0];
            this.sections.push(newSection);
            
            // Add section to UI
            const sectionList = document.querySelector('.section-list');
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section-item';
            sectionDiv.dataset.section = newSection;
            sectionDiv.innerHTML = this.getSectionHTML(newSection);
            sectionList.appendChild(sectionDiv);
            
            // Update preview
            this.renderPreview();
        }
    }
    
    removeSection(sectionName) {
        this.sections = this.sections.filter(s => s !== sectionName);
        document.querySelector(`[data-section="${sectionName}"]`).remove();
        this.renderPreview();
    }
    
    changeColor(color) {
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        this.userData.colors = this.userData.colors || {};
        this.userData.colors.primary = color;
        this.renderPreview();
    }
    
    changeFont(font) {
        document.querySelectorAll('.font-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        event.target.classList.add('selected');
        
        this.userData.font = font;
        this.renderPreview();
    }
    
    addSkillTag(container) {
        const input = container.querySelector('input[type="text"]');
        const skill = input.value.trim();
        
        if (skill) {
            if (!this.userData.skills) {
                this.userData.skills = { items: [] };
            }
            
            this.userData.skills.items.push(skill);
            input.value = '';
            this.saveData();
            this.renderPreview();
            
            // Update skill tags display
            const tagsContainer = container.querySelector('.skill-tags');
            if (tagsContainer) {
                const tag = document.createElement('span');
                tag.className = 'skill-tag';
                tag.textContent = skill;
                tagsContainer.appendChild(tag);
            }
        }
    }
    
    renderPreview() {
        const preview = document.getElementById('cvPreview');
        if (!preview) return;
        
        const template = this.getTemplate(this.currentTemplate);
        preview.innerHTML = this.generateCVHTML(template);
    }
    
    generateCVHTML(template) {
        const colors = this.userData.colors || { primary: '#4A00E0', secondary: '#8E2DE2' };
        const font = this.userData.font || 'Arial, sans-serif';
        
        return `
            <div class="cv-template" style="font-family: ${font};">
                <!-- Header -->
                ${this.userData.header ? `
                    <div class="cv-header" style="border-bottom-color: ${colors.primary};">
                        <h1 class="cv-name" style="color: ${colors.primary};">${this.userData.header?.name || 'Your Name'}</h1>
                        <h2 class="cv-title">${this.userData.header?.title || 'Your Title'}</h2>
                        <div class="cv-contact">
                            ${this.userData.header?.email ? `<span>${this.userData.header.email}</span>` : ''}
                            ${this.userData.header?.phone ? `<span>${this.userData.header.phone}</span>` : ''}
                            ${this.userData.header?.location ? `<span>${this.userData.header.location}</span>` : ''}
                            ${this.userData.header?.linkedin ? `<span>${this.userData.header.linkedin}</span>` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Summary -->
                ${this.userData.summary ? `
                    <div class="cv-section">
                        <h3 class="section-title" style="color: ${colors.primary};">Professional Summary</h3>
                        <div class="section-content">
                            <p>${this.userData.summary?.text || ''}</p>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Experience -->
                ${this.userData.experience ? `
                    <div class="cv-section">
                        <h3 class="section-title" style="color: ${colors.primary};">Work Experience</h3>
                        <div class="section-content">
                            ${this.userData.experience.items?.map(exp => `
                                <div class="experience-item">
                                    <h4>${exp.title || 'Job Title'}</h4>
                                    <p class="company">${exp.company || 'Company'} | ${exp.duration || 'Duration'}</p>
                                    <p class="description">${exp.description || ''}</p>
                                </div>
                            `).join('') || ''}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Education -->
                ${this.userData.education ? `
                    <div class="cv-section">
                        <h3 class="section-title" style="color: ${colors.primary};">Education</h3>
                        <div class="section-content">
                            ${this.userData.education.items?.map(edu => `
                                <div class="education-item">
                                    <h4>${edu.degree || 'Degree'}</h4>
                                    <p class="institution">${edu.institution || 'Institution'} | ${edu.year || 'Year'}</p>
                                    <p class="details">${edu.details || ''}</p>
                                </div>
                            `).join('') || ''}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Skills -->
                ${this.userData.skills ? `
                    <div class="cv-section">
                        <h3 class="section-title" style="color: ${colors.primary};">Skills</h3>
                        <div class="section-content">
                            <div class="skill-tags">
                                ${this.userData.skills.items?.map(skill => `
                                    <span class="skill-tag" style="background: ${colors.primary};">${skill}</span>
                                `).join('') || ''}
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Projects -->
                ${this.userData.projects ? `
                    <div class="cv-section">
                        <h3 class="section-title" style="color: ${colors.primary};">Projects</h3>
                        <div class="section-content">
                            ${this.userData.projects.items?.map(project => `
                                <div class="project-item">
                                    <h4>${project.name || 'Project Name'}</h4>
                                    <p class="description">${project.description || ''}</p>
                                    <p class="technologies">Technologies: ${project.technologies || ''}</p>
                                </div>
                            `).join('') || ''}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    downloadPDF() {
        // Create a PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Get CV content
        const cvContent = document.getElementById('cvPreview');
        
        // Use html2canvas to capture the CV as an image
        html2canvas(cvContent).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = canvas.height * imgWidth / canvas.width;
            
            doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            doc.save('cv.pdf');
        });
    }
    
    downloadDOCX() {
        // Create a DOCX using docx
        const { Document, Packer, Paragraph, TextRun } = window.docx;
        
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Curriculum Vitae",
                                bold: true,
                                size: 32
                            })
                        ]
                    }),
                    // Add more content here
                ]
            }]
        });
        
        Packer.toBlob(doc).then(blob => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'cv.docx';
            link.click();
        });
    }
    
    saveDraft() {
        localStorage.setItem('cvData', JSON.stringify(this.userData));
        this.showNotification('CV saved as draft!', 'success');
    }
    
    resetCV() {
        if (confirm('Are you sure you want to reset your CV? All changes will be lost.')) {
            this.userData = this.getDefaultUserData();
            localStorage.removeItem('cvData');
            this.renderPreview();
            this.showNotification('CV reset to default', 'info');
        }
    }
    
    getAISuggestion(section) {
        const suggestions = {
            summary: "Results-driven software developer with 2+ years of experience in building web applications using React and Node.js. Passionate about creating efficient, scalable solutions and continuously learning new technologies.",
            skills: "Consider adding: TypeScript, Next.js, GraphQL, MongoDB, AWS, Docker, Jest, Agile/Scrum",
            experience: "Focus on quantifying achievements: 'Increased application performance by 40%' or 'Reduced page load time by 2 seconds'"
        };
        
        if (suggestions[section]) {
            this.showAISuggestion(suggestions[section], section);
        }
    }
    
    showAISuggestion(suggestion, section) {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'ai-suggestion-popup';
        suggestionDiv.innerHTML = `
            <div class="ai-popup-header">
                <h6><i class="fas fa-robot"></i> AI Suggestion for ${section}</h6>
                <button class="close-btn">&times;</button>
            </div>
            <div class="ai-popup-content">
                <p>${suggestion}</p>
                <button class="btn btn-sm btn-gradient mt-2" onclick="cvBuilder.applySuggestion('${section}')">
                    Apply Suggestion
                </button>
            </div>
        `;
        
        document.body.appendChild(suggestionDiv);
        
        // Close button
        suggestionDiv.querySelector('.close-btn').addEventListener('click', () => {
            suggestionDiv.remove();
        });
    }
    
    applySuggestion(section) {
        const suggestions = {
            summary: "Results-driven software developer with 2+ years of experience in building web applications using React and Node.js. Passionate about creating efficient, scalable solutions and continuously learning new technologies."
        };
        
        if (suggestions[section]) {
            const input = document.querySelector(`[data-field="${section}"] textarea`);
            if (input) {
                input.value = suggestions[section];
                this.updateField(input);
            }
        }
        
        document.querySelector('.ai-suggestion-popup')?.remove();
    }
    
    updateProgress() {
        let filledFields = 0;
        let totalFields = 0;
        
        this.sections.forEach(section => {
            const inputs = document.querySelectorAll(`[data-field="${section}"]`);
            totalFields += inputs.length;
            
            inputs.forEach(input => {
                if (input.value.trim()) {
                    filledFields++;
                }
            });
        });
        
        const progress = Math.round((filledFields / totalFields) * 100);
        document.querySelectorAll('.progress-percent').forEach(el => {
            el.textContent = `${progress}%`;
        });
        
        document.querySelectorAll('.progress-bar').forEach(el => {
            el.style.width = `${progress}%`;
        });
    }
    
    saveData() {
        localStorage.setItem('cvData', JSON.stringify(this.userData));
        this.updateProgress();
    }
    
    getDefaultTemplates() {
        return [
            {
                id: 1,
                name: 'Modern Professional',
                color1: '#4A00E0',
                color2: '#8E2DE2',
                category: 'professional'
            },
            {
                id: 2,
                name: 'Creative',
                color1: '#FF8E00',
                color2: '#FFC400',
                category: 'creative'
            },
            {
                id: 3,
                name: 'Minimalist',
                color1: '#00b894',
                color2: '#00cec9',
                category: 'minimalist'
            },
            {
                id: 4,
                name: 'Executive',
                color1: '#2d3436',
                color2: '#636e72',
                category: 'executive'
            }
        ];
    }
    
    getDefaultUserData() {
        return {
            header: {
                name: 'John Doe',
                title: 'Frontend Developer',
                email: 'john.doe@example.com',
                phone: '+1 (555) 123-4567',
                location: 'San Francisco, CA',
                linkedin: 'linkedin.com/in/johndoe'
            },
            summary: {
                text: 'Passionate frontend developer with 2+ years of experience building responsive web applications using React, JavaScript, and modern web technologies. Strong problem-solving skills and a commitment to writing clean, efficient code.'
            },
            experience: {
                items: [
                    {
                        title: 'Junior Frontend Developer',
                        company: 'Tech Solutions Inc.',
                        duration: '2022 - Present',
                        description: 'Developed and maintained responsive web applications using React and Redux. Collaborated with backend developers to integrate REST APIs.'
                    },
                    {
                        title: 'Web Developer Intern',
                        company: 'Digital Agency',
                        duration: '2021 - 2022',
                        description: 'Assisted in building client websites using HTML, CSS, and JavaScript. Participated in code reviews and team meetings.'
                    }
                ]
            },
            education: {
                items: [
                    {
                        degree: 'Bachelor of Science in Computer Science',
                        institution: 'State University',
                        year: '2018 - 2022',
                        details: 'GPA: 3.8/4.0'
                    }
                ]
            },
            skills: {
                items: ['JavaScript', 'React', 'HTML/CSS', 'Git', 'Responsive Design', 'REST APIs']
            },
            projects: {
                items: [
                    {
                        name: 'E-commerce Platform',
                        description: 'Built a full-featured e-commerce platform with React and Node.js',
                        technologies: 'React, Node.js, MongoDB, Stripe API'
                    },
                    {
                        name: 'Task Management App',
                        description: 'Developed a collaborative task management application',
                        technologies: 'React, Firebase, Material-UI'
                    }
                ]
            }
        };
    }
    
    getTemplate(id) {
        return this.templates.find(t => t.id === id) || this.templates[0];
    }
    
    getSectionHTML(section) {
        const sections = {
            certifications: `
                <div class="section-header">
                    <h6>Certifications</h6>
                    <div class="section-controls">
                        <button class="control-btn remove-section" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="section-content">
                    <div class="field-group">
                        <label class="field-label">Certification Name</label>
                        <input type="text" class="field-input" data-section="certifications" name="name1">
                    </div>
                    <div class="field-group">
                        <label class="field-label">Issuing Organization</label>
                        <input type="text" class="field-input" data-section="certifications" name="org1">
                    </div>
                    <div class="field-group">
                        <label class="field-label">Date Earned</label>
                        <input type="text" class="field-input" data-section="certifications" name="date1">
                    </div>
                </div>
            `,
            languages: `
                <div class="section-header">
                    <h6>Languages</h6>
                    <div class="section-controls">
                        <button class="control-btn remove-section" title="Remove">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="section-content">
                    <div class="field-group">
                        <label class="field-label">Languages and Proficiency</label>
                        <textarea class="field-input field-textarea" data-section="languages" name="list"></textarea>
                    </div>
                </div>
            `
        };
        
        return sections[section] || '';
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `cv-notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        `;
        
        document.querySelector('.cv-builder-container').appendChild(notification);
        
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

// Initialize CV Builder
document.addEventListener('DOMContentLoaded', () => {
    window.cvBuilder = new CVBuilder();
});
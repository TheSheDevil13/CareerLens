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
        
        // Apply template styles if template was previously selected
        if (this.userData.templateId) {
            const template = this.getTemplate(this.userData.templateId);
            if (template) {
                this.applyTemplateStyles(template);
            }
        } else {
            // Apply default template styles
            const defaultTemplate = this.getTemplate(this.currentTemplate);
            this.applyTemplateStyles(defaultTemplate);
            this.selectTemplate(this.currentTemplate);
        }
        
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
        const template = this.getTemplate(templateId);
        
        // Update selected state in UI
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('selected');
        });
        const selectedItem = document.querySelector(`.template-item[onclick*="${templateId}"]`);
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
        
        // Apply template colors to userData
        if (!this.userData.colors) {
            this.userData.colors = {};
        }
        this.userData.colors.primary = template.color1;
        this.userData.colors.secondary = template.color2;
        this.userData.templateId = templateId;
        
        // Apply template-specific styles
        this.applyTemplateStyles(template);
        
        this.saveData();
        this.renderPreview();
    }
    
    applyTemplateStyles(template) {
        // Store template style preferences
        if (!this.userData.templateStyles) {
            this.userData.templateStyles = {};
        }
        
        // Different templates can have different layouts
        const styles = {
            1: { // Modern Professional
                headerAlign: 'center',
                sectionStyle: 'standard',
                font: 'Arial, sans-serif'
            },
            2: { // Creative
                headerAlign: 'left',
                sectionStyle: 'creative',
                font: 'Georgia, serif'
            },
            3: { // Minimalist
                headerAlign: 'center',
                sectionStyle: 'minimal',
                font: 'Helvetica, sans-serif'
            }
        };
        
        this.userData.templateStyles = styles[template.id] || styles[1];
    }
    
    loadUserData() {
        const savedData = localStorage.getItem('cvData');
        if (savedData) {
            try {
                this.userData = JSON.parse(savedData);
                // Restore template selection if saved
                if (this.userData.templateId) {
                    this.currentTemplate = this.userData.templateId;
                }
            } catch (e) {
                this.userData = this.getDefaultUserData();
            }
        }
        
        // Populate form fields
        this.sections.forEach(section => {
            const inputs = document.querySelectorAll(`[data-field="${section}"]`);
            inputs.forEach(input => {
                if (section === 'experience' || section === 'education') {
                    // Handle array-based sections
                    const match = input.name.match(/(\d+)$/);
                    const index = match ? parseInt(match[1]) - 1 : 0;
                    const fieldName = input.name.replace(/\d+$/, '');
                    
                    if (this.userData[section]?.items?.[index]?.[fieldName]) {
                        input.value = this.userData[section].items[index][fieldName];
                    }
                } else if (this.userData[section] && this.userData[section][input.name]) {
                    input.value = this.userData[section][input.name];
                }
            });
        });
        
        // Load skill tags
        if (this.userData.skills?.items) {
            const skillsContainer = document.querySelector('.skill-tags');
            if (skillsContainer) {
                skillsContainer.innerHTML = '';
                this.userData.skills.items.forEach(skill => {
                    const tag = document.createElement('span');
                    tag.className = 'skill-tag';
                    tag.textContent = skill;
                    tag.innerHTML += `<button class="remove-tag" onclick="cvBuilder.removeSkillTag('${skill}')">&times;</button>`;
                    skillsContainer.appendChild(tag);
                });
            }
        }
    }
    
    initEventListeners() {
        // Form inputs - use event delegation for dynamic content
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[data-field], textarea[data-field]')) {
                this.updateField(e.target);
            }
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
        const section = input.dataset.section || input.dataset.field;
        const field = input.name;
        const value = input.value;
        
        if (!this.userData[section]) {
            this.userData[section] = {};
        }
        
        // Handle experience and education as arrays
        if (section === 'experience' || section === 'education') {
            if (!this.userData[section].items) {
                this.userData[section].items = [{}];
            }
            
            // Extract index from field name (e.g., "title1" -> index 0)
            const match = field.match(/(\d+)$/);
            const index = match ? parseInt(match[1]) - 1 : 0;
            
            // Ensure array is large enough
            while (this.userData[section].items.length <= index) {
                this.userData[section].items.push({});
            }
            
            // Extract field name without number (e.g., "title1" -> "title")
            const fieldName = field.replace(/\d+$/, '');
            this.userData[section].items[index][fieldName] = value;
        } else {
            this.userData[section][field] = value;
        }
        
        this.saveData();
        this.updateProgress();
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
        const target = event?.target || document.querySelector(`[data-color="${color}"]`);
        if (target) target.classList.add('selected');
        
        this.userData.colors = this.userData.colors || {};
        this.userData.colors.primary = color;
        this.renderPreview();
    }
    
    changeFont(font) {
        document.querySelectorAll('.font-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        const target = event?.target || document.querySelector(`[data-font="${font}"]`);
        if (target) target.classList.add('selected');
        
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
            
            // Check if skill already exists
            if (this.userData.skills.items.includes(skill)) {
                this.showNotification('Skill already added', 'info');
                return;
            }
            
            this.userData.skills.items.push(skill);
            input.value = '';
            this.saveData();
            this.updateProgress();
            this.renderPreview();
            
            // Update skill tags display
            const tagsContainer = container.querySelector('.skill-tags');
            if (tagsContainer) {
                const tag = document.createElement('span');
                tag.className = 'skill-tag';
                tag.innerHTML = `${skill}<button class="remove-tag" onclick="cvBuilder.removeSkillTag('${skill}')">&times;</button>`;
                tagsContainer.appendChild(tag);
            }
        }
    }
    
    removeSkillTag(skill) {
        if (this.userData.skills?.items) {
            this.userData.skills.items = this.userData.skills.items.filter(s => s !== skill);
            this.saveData();
            this.updateProgress();
            this.renderPreview();
            
            // Update UI
            const tagsContainer = document.querySelector('.skill-tags');
            if (tagsContainer) {
                tagsContainer.innerHTML = '';
                this.userData.skills.items.forEach(s => {
                    const tag = document.createElement('span');
                    tag.className = 'skill-tag';
                    tag.innerHTML = `${s}<button class="remove-tag" onclick="cvBuilder.removeSkillTag('${s}')">&times;</button>`;
                    tagsContainer.appendChild(tag);
                });
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
        // Use template colors if available, otherwise use userData colors, otherwise default
        const templateColors = template ? { primary: template.color1, secondary: template.color2 } : null;
        const colors = this.userData.colors || templateColors || { primary: '#4A00E0', secondary: '#8E2DE2' };
        const templateStyles = this.userData.templateStyles || { headerAlign: 'center', sectionStyle: 'standard' };
        const font = this.userData.font || templateStyles.font || 'Arial, sans-serif';
        
        // Determine header alignment
        const headerAlign = templateStyles.headerAlign || 'center';
        const headerClass = `cv-header cv-header-${templateStyles.sectionStyle || 'standard'}`;
        
        return `
            <div class="cv-template cv-template-${template?.category || 'professional'}" style="font-family: ${font};">
                <!-- Header -->
                ${this.userData.header ? `
                    <div class="${headerClass}" style="text-align: ${headerAlign}; border-bottom-color: ${colors.primary}; border-bottom-width: ${templateStyles.sectionStyle === 'minimal' ? '1px' : '3px'};">
                        <h1 class="cv-name" style="color: ${colors.primary};">${this.userData.header?.name || 'Your Name'}</h1>
                        <h2 class="cv-title" style="color: var(--text-secondary, #666);">
                            ${this.userData.header?.title || 'Your Title'}
                        </h2>
                        <div class="cv-contact" style="justify-content: ${headerAlign === 'center' ? 'center' : 'flex-start'};">
                            ${this.userData.header?.email ? `<span><i class="fas fa-envelope"></i> ${this.userData.header.email}</span>` : ''}
                            ${this.userData.header?.phone ? `<span><i class="fas fa-phone"></i> ${this.userData.header.phone}</span>` : ''}
                            ${this.userData.header?.location ? `<span><i class="fas fa-map-marker-alt"></i> ${this.userData.header.location}</span>` : ''}
                            ${this.userData.header?.linkedin ? `<span><i class="fab fa-linkedin"></i> ${this.userData.header.linkedin}</span>` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Summary -->
                ${this.userData.summary ? `
                    <div class="cv-section cv-section-${templateStyles.sectionStyle || 'standard'}">
                        <h3 class="section-title" style="color: ${colors.primary}; border-bottom-color: ${templateStyles.sectionStyle === 'minimal' ? '#eee' : colors.primary};">
                            ${templateStyles.sectionStyle === 'creative' ? '<i class="fas fa-user"></i> ' : ''}
                            Professional Summary
                        </h3>
                        <div class="section-content">
                            <p style="line-height: 1.6;">${this.userData.summary?.text || ''}</p>
                        </div>
                    </div>
                ` : ''}
                
                <!-- Experience -->
                ${this.userData.experience ? `
                    <div class="cv-section cv-section-${templateStyles.sectionStyle || 'standard'}">
                        <h3 class="section-title" style="color: ${colors.primary}; border-bottom-color: ${templateStyles.sectionStyle === 'minimal' ? '#eee' : colors.primary};">
                            ${templateStyles.sectionStyle === 'creative' ? '<i class="fas fa-briefcase"></i> ' : ''}
                            Work Experience
                        </h3>
                        <div class="section-content">
                            ${this.getExperienceItems().map(exp => `
                                <div class="experience-item">
                                    <h4>${exp.title || 'Job Title'}</h4>
                                    <p class="company">${exp.company || 'Company'} | ${exp.duration || 'Duration'}</p>
                                    <p class="description">${exp.description || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Education -->
                ${this.userData.education ? `
                    <div class="cv-section cv-section-${templateStyles.sectionStyle || 'standard'}">
                        <h3 class="section-title" style="color: ${colors.primary}; border-bottom-color: ${templateStyles.sectionStyle === 'minimal' ? '#eee' : colors.primary};">
                            ${templateStyles.sectionStyle === 'creative' ? '<i class="fas fa-graduation-cap"></i> ' : ''}
                            Education
                        </h3>
                        <div class="section-content">
                            ${this.getEducationItems().map(edu => `
                                <div class="education-item">
                                    <h4>${edu.degree || 'Degree'}</h4>
                                    <p class="institution">${edu.institution || 'Institution'} | ${edu.year || 'Year'}</p>
                                    <p class="details">${edu.details || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Skills -->
                ${this.userData.skills ? `
                    <div class="cv-section cv-section-${templateStyles.sectionStyle || 'standard'}">
                        <h3 class="section-title" style="color: ${colors.primary}; border-bottom-color: ${templateStyles.sectionStyle === 'minimal' ? '#eee' : colors.primary};">
                            ${templateStyles.sectionStyle === 'creative' ? '<i class="fas fa-code"></i> ' : ''}
                            Skills
                        </h3>
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
        const cvContent = document.getElementById('cvPreview');
        if (!cvContent) {
            this.showNotification('CV preview not found. Please fill in your CV details first.', 'error');
            return;
        }
        
        // Get CV styles
        const styles = Array.from(document.styleSheets)
            .map(sheet => {
                try {
                    return Array.from(sheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('\n');
                } catch (e) {
                    return '';
                }
            })
            .join('\n');
        
        // Create a new window with CV content
        const printWindow = window.open('', '_blank');
        const cvHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>CV - ${this.userData.header?.name || 'Resume'}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 40px;
                        background: white;
                        color: #333;
                    }
                    .cv-template { max-width: 800px; margin: 0 auto; }
                    .cv-header { 
                        border-bottom: 3px solid #4A00E0; 
                        padding-bottom: 20px; 
                        margin-bottom: 30px; 
                    }
                    .cv-name { 
                        font-size: 32px; 
                        font-weight: bold; 
                        margin-bottom: 5px; 
                        color: #4A00E0;
                    }
                    .cv-title { 
                        font-size: 18px; 
                        color: #666; 
                        margin-bottom: 15px; 
                    }
                    .cv-contact { 
                        display: flex; 
                        flex-wrap: wrap; 
                        gap: 15px; 
                        font-size: 14px; 
                        color: #666; 
                    }
                    .cv-section { 
                        margin-bottom: 30px; 
                    }
                    .section-title { 
                        font-size: 20px; 
                        font-weight: bold; 
                        margin-bottom: 15px; 
                        color: #4A00E0;
                        border-bottom: 2px solid #eee;
                        padding-bottom: 5px;
                    }
                    .experience-item, .education-item { 
                        margin-bottom: 20px; 
                    }
                    .experience-item h4, .education-item h4 { 
                        font-size: 16px; 
                        font-weight: bold; 
                        margin-bottom: 5px; 
                    }
                    .company, .institution { 
                        color: #666; 
                        font-size: 14px; 
                        margin-bottom: 8px; 
                    }
                    .description { 
                        margin-top: 8px; 
                        line-height: 1.6; 
                    }
                    .skill-tags { 
                        display: flex; 
                        flex-wrap: wrap; 
                        gap: 8px; 
                    }
                    .skill-tag { 
                        background: #4A00E0; 
                        color: white; 
                        padding: 5px 12px; 
                        border-radius: 15px; 
                        font-size: 14px; 
                    }
                    @media print {
                        body { padding: 0; }
                        .cv-template { max-width: 100%; }
                    }
                </style>
            </head>
            <body>
                ${cvContent.innerHTML}
            </body>
            </html>
        `;
        
        printWindow.document.write(cvHTML);
        printWindow.document.close();
        
        // Wait for content to load, then print
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }
    
    downloadDOCX() {
        // Simple text export
        const cvContent = document.getElementById('cvPreview');
        if (!cvContent) {
            alert('CV preview not found. Please fill in your CV details first.');
            return;
        }
        
        const text = cvContent.innerText || cvContent.textContent;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cv.txt';
        link.click();
        URL.revokeObjectURL(url);
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
                if (input.value && input.value.trim()) {
                    filledFields++;
                }
            });
        });
        
        // Also count skills
        if (this.userData.skills?.items?.length > 0) {
            filledFields += Math.min(this.userData.skills.items.length, 1);
            totalFields += 1;
        }
        
        const progress = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
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
    
    getExperienceItems() {
        if (this.userData.experience?.items) {
            return this.userData.experience.items;
        }
        
        // Fallback: build from form fields
        const items = [];
        const inputs = document.querySelectorAll('[data-field="experience"]');
        const titles = Array.from(inputs).filter(i => i.name.startsWith('title'));
        
        titles.forEach((titleInput, index) => {
            const num = index + 1;
            const title = titleInput.value || document.querySelector(`[data-field="experience"][name="title${num}"]`)?.value;
            const company = document.querySelector(`[data-field="experience"][name="company${num}"]`)?.value;
            const duration = document.querySelector(`[data-field="experience"][name="duration${num}"]`)?.value;
            const description = document.querySelector(`[data-field="experience"][name="description${num}"]`)?.value;
            
            if (title || company) {
                items.push({ title, company, duration, description });
            }
        });
        
        return items.length > 0 ? items : [{ title: '', company: '', duration: '', description: '' }];
    }
    
    getEducationItems() {
        if (this.userData.education?.items) {
            return this.userData.education.items;
        }
        
        // Fallback: build from form fields
        const items = [];
        const inputs = document.querySelectorAll('[data-field="education"]');
        const degrees = Array.from(inputs).filter(i => i.name.startsWith('degree'));
        
        degrees.forEach((degreeInput, index) => {
            const num = index + 1;
            const degree = degreeInput.value || document.querySelector(`[data-field="education"][name="degree${num}"]`)?.value;
            const institution = document.querySelector(`[data-field="education"][name="institution${num}"]`)?.value;
            const year = document.querySelector(`[data-field="education"][name="year${num}"]`)?.value;
            
            if (degree || institution) {
                items.push({ degree, institution, year });
            }
        });
        
        return items.length > 0 ? items : [{ degree: '', institution: '', year: '' }];
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
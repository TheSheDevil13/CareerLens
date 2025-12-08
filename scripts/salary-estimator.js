// Salary Estimator for Career Lens

class SalaryEstimator {
    constructor() {
        this.salaryData = window.appData?.salaryData || this.getDefaultSalaryData();
        this.userInput = {
            department: '',
            careerPath: '',
            experience: 'entry',
            location: 'remote',
            skills: []
        };
        
        this.init();
    }
    
    init() {
        this.initDepartments();
        this.initSkills();
        this.initEventListeners();
        this.initCharts();
    }
    
    initDepartments() {
        const deptSelect = document.getElementById('departmentSelect');
        const careerSelect = document.getElementById('careerPathSelect');
        
        // Populate departments
        const departments = ['CSE', 'EE', 'ME', 'CE', 'Finance', 'Marketing', 'Healthcare'];
        
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept;
            option.textContent = dept;
            deptSelect.appendChild(option);
        });
        
        // Department change handler
        deptSelect.addEventListener('change', (e) => {
            this.userInput.department = e.target.value;
            this.updateCareerPaths();
            this.updateSkills();
        });
        
        // Career path change handler
        careerSelect.addEventListener('change', (e) => {
            this.userInput.careerPath = e.target.value;
            this.updateSalaryEstimate();
        });
    }
    
    updateCareerPaths() {
        const careerSelect = document.getElementById('careerPathSelect');
        careerSelect.innerHTML = '<option value="">Select Career Path</option>';
        
        if (!this.userInput.department) return;
        
        const careers = this.getCareersForDepartment(this.userInput.department);
        
        careers.forEach(career => {
            const option = document.createElement('option');
            option.value = career.id;
            option.textContent = career.name;
            careerSelect.appendChild(option);
        });
    }
    
    getCareersForDepartment(department) {
        const careers = {
            'CSE': [
                { id: 'frontend', name: 'Frontend Developer' },
                { id: 'backend', name: 'Backend Developer' },
                { id: 'fullstack', name: 'Full Stack Developer' },
                { id: 'data-scientist', name: 'Data Scientist' },
                { id: 'devops', name: 'DevOps Engineer' }
            ],
            'EE': [
                { id: 'power', name: 'Power Systems Engineer' },
                { id: 'electronics', name: 'Electronics Engineer' },
                { id: 'control', name: 'Control Systems Engineer' }
            ],
            'Finance': [
                { id: 'financial-analyst', name: 'Financial Analyst' },
                { id: 'investment-banker', name: 'Investment Banker' },
                { id: 'accountant', name: 'Accountant' }
            ],
            'Marketing': [
                { id: 'marketing-manager', name: 'Marketing Manager' },
                { id: 'digital-marketing', name: 'Digital Marketing Specialist' },
                { id: 'brand-manager', name: 'Brand Manager' }
            ]
        };
        
        return careers[department] || [];
    }
    
    initSkills() {
        const container = document.getElementById('skillsSelector');
        const skills = [
            'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
            'AWS', 'Docker', 'Kubernetes', 'Git', 'HTML/CSS', 'TypeScript',
            'Machine Learning', 'Data Analysis', 'UI/UX Design'
        ];
        
        container.innerHTML = skills.map(skill => `
            <div class="skill-option" data-skill="${skill}">
                <input type="checkbox" id="skill-${skill.toLowerCase()}" class="skill-checkbox">
                <label for="skill-${skill.toLowerCase()}">${skill}</label>
            </div>
        `).join('');
        
        // Skill selection handler
        container.querySelectorAll('.skill-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const skill = e.target.id.replace('skill-', '').replace('-', ' ');
                if (e.target.checked) {
                    this.userInput.skills.push(skill);
                } else {
                    this.userInput.skills = this.userInput.skills.filter(s => s !== skill);
                }
                this.updateSalaryEstimate();
            });
        });
    }
    
    updateSkills() {
        // Update available skills based on department
        // This is a simplified version
        console.log('Updating skills for department:', this.userInput.department);
    }
    
    initEventListeners() {
        // Experience level
        document.getElementById('experienceSelect').addEventListener('change', (e) => {
            this.userInput.experience = e.target.value;
            this.updateSalaryEstimate();
        });
        
        // Location
        document.getElementById('locationSelect').addEventListener('change', (e) => {
            this.userInput.location = e.target.value;
            this.updateSalaryEstimate();
        });
        
        // Calculate button
        document.getElementById('calculateSalary').addEventListener('click', () => {
            this.calculateSalary();
        });
    }
    
    initCharts() {
        // Market comparison chart
        const marketCtx = document.getElementById('marketChart')?.getContext('2d');
        if (marketCtx) {
            this.marketChart = new Chart(marketCtx, {
                type: 'bar',
                data: {
                    labels: ['Your Estimate', 'Market Average', 'Top 25%', 'Top 10%'],
                    datasets: [{
                        label: 'Annual Salary ($)',
                        data: [0, 0, 0, 0],
                        backgroundColor: [
                            'rgba(74, 0, 224, 0.7)',
                            'rgba(142, 45, 226, 0.7)',
                            'rgba(0, 184, 148, 0.7)',
                            'rgba(9, 132, 227, 0.7)'
                        ],
                        borderColor: [
                            '#4A00E0',
                            '#8E2DE2',
                            '#00b894',
                            '#0984e3'
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
        
        // Growth projection chart
        const growthCtx = document.getElementById('growthChart')?.getContext('2d');
        if (growthCtx) {
            this.growthChart = new Chart(growthCtx, {
                type: 'line',
                data: {
                    labels: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
                    datasets: [{
                        label: 'Salary Growth',
                        data: [0, 0, 0, 0, 0],
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
    }
    
    calculateSalary() {
        if (!this.userInput.department || !this.userInput.careerPath) {
            alert('Please select a department and career path first.');
            return;
        }
        
        const baseSalary = this.getBaseSalary();
        const locationMultiplier = this.getLocationMultiplier();
        const experienceMultiplier = this.getExperienceMultiplier();
        const skillBonus = this.getSkillBonus();
        
        const adjustedSalary = baseSalary * locationMultiplier * experienceMultiplier + skillBonus;
        
        this.displaySalary(adjustedSalary);
        this.updateCharts(adjustedSalary);
        this.updateFactors();
        this.showNegotiationTips();
    }
    
    getBaseSalary() {
        // Base salaries by career path
        const baseSalaries = {
            'frontend': 75000,
            'backend': 80000,
            'fullstack': 85000,
            'data-scientist': 90000,
            'devops': 85000,
            'power': 70000,
            'electronics': 72000,
            'control': 75000,
            'finance': 65000,
            'marketing': 60000,
            'hr': 58000
        };
        
        return baseSalaries[this.userInput.careerPath] || 70000;
    }
    
    getLocationMultiplier() {
        const multipliers = {
            'remote': 1.0,
            'us': 1.2,
            'canada': 1.1,
            'europe': 1.0,
            'asia': 0.8,
            'other': 0.9
        };
        
        return multipliers[this.userInput.location] || 1.0;
    }
    
    getExperienceMultiplier() {
        const multipliers = {
            'entry': 1.0,
            'mid': 1.5,
            'senior': 2.0
        };
        
        return multipliers[this.userInput.experience] || 1.0;
    }
    
    getSkillBonus() {
        // Add bonus for each relevant skill
        const skillBonuses = {
            'JavaScript': 5000,
            'React': 4000,
            'Node.js': 4000,
            'Python': 3000,
            'AWS': 6000,
            'Docker': 4000,
            'Machine Learning': 7000
        };
        
        let totalBonus = 0;
        this.userInput.skills.forEach(skill => {
            if (skillBonuses[skill]) {
                totalBonus += skillBonuses[skill];
            }
        });
        
        return totalBonus;
    }
    
    displaySalary(salary) {
        const formattedSalary = this.formatSalary(salary);
        
        // Update salary display
        document.getElementById('salaryAmount').textContent = formattedSalary;
        document.getElementById('baseSalary').textContent = formattedSalary;
        
        // Calculate bonus (15-25% of base)
        const bonusPercentage = 0.15 + Math.random() * 0.1;
        const bonus = salary * bonusPercentage;
        document.getElementById('bonusAmount').textContent = this.formatSalary(bonus);
        
        // Total compensation
        const total = salary + bonus;
        document.getElementById('totalCompensation').textContent = this.formatSalary(total);
    }
    
    updateCharts(salary) {
        // Update market comparison chart
        if (this.marketChart) {
            const marketAvg = salary * 0.9;
            const top25 = salary * 1.2;
            const top10 = salary * 1.5;
            
            this.marketChart.data.datasets[0].data = [salary, marketAvg, top25, top10];
            this.marketChart.update();
        }
        
        // Update growth projection chart
        if (this.growthChart) {
            const growthRates = [0, 0.1, 0.25, 0.45, 0.7]; // Cumulative growth over years
            const projectedSalaries = growthRates.map(rate => salary * (1 + rate));
            
            this.growthChart.data.datasets[0].data = projectedSalaries;
            this.growthChart.update();
        }
    }
    
    updateFactors() {
        const factorsContainer = document.querySelector('.factors-list');
        factorsContainer.innerHTML = '';
        
        const factors = [
            {
                type: 'positive',
                icon: 'fa-check-circle',
                title: 'High Demand Skills',
                description: 'Your selected skills are in high demand'
            },
            {
                type: this.userInput.location === 'us' ? 'positive' : 'neutral',
                icon: 'fa-globe',
                title: 'Location Advantage',
                description: this.userInput.location === 'us' 
                    ? 'US locations offer higher salaries' 
                    : 'Consider remote US positions for higher pay'
            },
            {
                type: this.userInput.experience === 'entry' ? 'negative' : 'positive',
                icon: 'fa-chart-line',
                title: 'Experience Level',
                description: this.userInput.experience === 'entry'
                    ? 'Entry level positions have lower base salary'
                    : 'Your experience level commands higher pay'
            }
        ];
        
        // Add skill-specific factors
        this.userInput.skills.slice(0, 2).forEach(skill => {
            factors.push({
                type: 'positive',
                icon: 'fa-star',
                title: skill,
                description: 'This skill increases your market value'
            });
        });
        
        // Display factors
        factors.forEach(factor => {
            const factorDiv = document.createElement('div');
            factorDiv.className = `factor ${factor.type}`;
            factorDiv.innerHTML = `
                <i class="fas ${factor.icon}"></i>
                <div>
                    <strong>${factor.title}</strong>
                    <p>${factor.description}</p>
                </div>
            `;
            factorsContainer.appendChild(factorDiv);
        });
    }
    
    showNegotiationTips() {
        const tipsContainer = document.querySelector('.tips-list');
        tipsContainer.innerHTML = '';
        
        const tips = [
            {
                icon: 'fa-lightbulb',
                text: 'Research industry standards for your role and location before negotiations'
            },
            {
                icon: 'fa-comments',
                text: 'Practice discussing your achievements and how they add value to the company'
            },
            {
                icon: 'fa-handshake',
                text: 'Consider the total compensation package, not just the base salary'
            },
            {
                icon: 'fa-chart-line',
                text: 'Use this salary estimate as a reference point during negotiations'
            }
        ];
        
        tips.forEach(tip => {
            const tipDiv = document.createElement('div');
            tipDiv.className = 'tip';
            tipDiv.innerHTML = `
                <i class="fas ${tip.icon}"></i>
                <p>${tip.text}</p>
            `;
            tipsContainer.appendChild(tipDiv);
        });
    }
    
    formatSalary(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    updateSalaryEstimate() {
        // Update estimate when inputs change
        if (this.userInput.department && this.userInput.careerPath) {
            this.calculateSalary();
        }
    }
    
    getDefaultSalaryData() {
        return {
            'CSE': {
                'Frontend Developer': {
                    'entry': { min: 65000, avg: 75000, max: 85000 },
                    'mid': { min: 90000, avg: 110000, max: 130000 },
                    'senior': { min: 130000, avg: 150000, max: 200000 }
                }
            }
        };
    }
}

// Initialize salary estimator
document.addEventListener('DOMContentLoaded', () => {
    window.salaryEstimator = new SalaryEstimator();
});
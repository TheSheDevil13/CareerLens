// Skill Assessment for Carrier Lens

class SkillAssessment {
    constructor() {
        this.questions = this.getQuestions();
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.categories = {};
        this.timeLimit = 30 * 60; // 30 minutes in seconds
        this.timeLeft = this.timeLimit;
        this.timer = null;
        
        this.init();
    }
    
    init() {
        this.renderQuestion();
        this.initEventListeners();
        this.startTimer();
        this.updateProgress();
    }
    
    getQuestions() {
        return [
            {
                id: 1,
                question: "What is the time complexity of binary search?",
                type: "mcq",
                options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
                correct: 1,
                category: "Algorithms",
                difficulty: "easy",
                explanation: "Binary search divides the search space in half each time, resulting in logarithmic time complexity."
            },
            {
                id: 2,
                question: "Which method adds a new element to the end of an array in JavaScript?",
                type: "mcq",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correct: 0,
                category: "JavaScript",
                difficulty: "easy",
                explanation: "The push() method adds one or more elements to the end of an array."
            },
            {
                id: 3,
                question: "What does CSS stand for?",
                type: "mcq",
                options: [
                    "Computer Style Sheets",
                    "Creative Style System",
                    "Cascading Style Sheets",
                    "Colorful Style Sheets"
                ],
                correct: 2,
                category: "CSS",
                difficulty: "easy",
                explanation: "CSS stands for Cascading Style Sheets, used for styling web pages."
            },
            {
                id: 4,
                question: "Which React hook is used for side effects?",
                type: "mcq",
                options: ["useState", "useEffect", "useContext", "useReducer"],
                correct: 1,
                category: "React",
                difficulty: "medium",
                explanation: "useEffect hook lets you perform side effects in function components."
            },
            {
                id: 5,
                question: "What is the purpose of a database index?",
                type: "mcq",
                options: [
                    "To store backup data",
                    "To improve query performance",
                    "To encrypt data",
                    "To compress data"
                ],
                correct: 1,
                category: "Database",
                difficulty: "medium",
                explanation: "Indexes improve the speed of data retrieval operations on database tables."
            }
        ];
    }
    
    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const container = document.getElementById('questionContainer');
        
        container.innerHTML = `
            <div class="question-header">
                <div class="question-meta">
                    <span class="badge bg-${question.difficulty === 'easy' ? 'success' : question.difficulty === 'medium' ? 'warning' : 'danger'}">
                        ${question.difficulty}
                    </span>
                    <span class="category-badge">${question.category}</span>
                    <span class="question-counter">
                        Question ${this.currentQuestion + 1} of ${this.questions.length}
                    </span>
                </div>
                <div class="question-timer">
                    <i class="fas fa-clock"></i>
                    <span id="timerDisplay">${this.formatTime(this.timeLeft)}</span>
                </div>
            </div>
            
            <div class="question-body">
                <h3>${question.question}</h3>
                
                <div class="options-container">
                    ${question.type === 'mcq' ? this.renderMCQ(question) : this.renderCodingQuestion(question)}
                </div>
                
                ${this.currentQuestion > 0 ? `
                    <div class="navigation-buttons">
                        <button class="btn btn-outline-primary" id="prevQuestion">
                            <i class="fas fa-arrow-left"></i> Previous
                        </button>
                        ${this.currentQuestion < this.questions.length - 1 ? `
                            <button class="btn btn-primary" id="nextQuestion">
                                Next <i class="fas fa-arrow-right"></i>
                            </button>
                        ` : `
                            <button class="btn btn-success" id="submitAssessment">
                                Submit Assessment
                            </button>
                        `}
                    </div>
                ` : `
                    <div class="navigation-buttons">
                        ${this.currentQuestion < this.questions.length - 1 ? `
                            <button class="btn btn-primary" id="nextQuestion">
                                Next <i class="fas fa-arrow-right"></i>
                            </button>
                        ` : `
                            <button class="btn btn-success" id="submitAssessment">
                                Submit Assessment
                            </button>
                        `}
                    </div>
                `}
            </div>
            
            <div class="question-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(this.currentQuestion + 1) / this.questions.length * 100}%"></div>
                </div>
            </div>
        `;
        
        this.attachQuestionEventListeners();
    }
    
    renderMCQ(question) {
        return `
            <div class="mcq-options">
                ${question.options.map((option, index) => `
                    <div class="option-item" data-option="${index}">
                        <div class="option-selector">
                            <div class="selector-circle"></div>
                        </div>
                        <div class="option-text">${option}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderCodingQuestion(question) {
        return `
            <div class="coding-question">
                <div class="code-editor">
                    <textarea class="code-input" placeholder="Write your code here..."></textarea>
                </div>
                <div class="code-actions">
                    <button class="btn btn-outline-primary" id="runCode">
                        <i class="fas fa-play"></i> Run Code
                    </button>
                    <button class="btn btn-outline-primary" id="showHint">
                        <i class="fas fa-lightbulb"></i> Hint
                    </button>
                </div>
                <div class="code-output"></div>
            </div>
        `;
    }
    
    attachQuestionEventListeners() {
        // MCQ options
        document.querySelectorAll('.option-item').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectOption(parseInt(e.currentTarget.dataset.option));
            });
        });
        
        // Navigation buttons
        document.getElementById('prevQuestion')?.addEventListener('click', () => {
            this.prevQuestion();
        });
        
        document.getElementById('nextQuestion')?.addEventListener('click', () => {
            this.nextQuestion();
        });
        
        document.getElementById('submitAssessment')?.addEventListener('click', () => {
            this.submitAssessment();
        });
        
        // Code execution
        document.getElementById('runCode')?.addEventListener('click', () => {
            this.runCode();
        });
        
        document.getElementById('showHint')?.addEventListener('click', () => {
            this.showHint();
        });
    }
    
    selectOption(optionIndex) {
        const question = this.questions[this.currentQuestion];
        
        // Update UI
        document.querySelectorAll('.option-item').forEach((item, index) => {
            if (index === optionIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // Save answer
        this.userAnswers[this.currentQuestion] = {
            selected: optionIndex,
            isCorrect: optionIndex === question.correct
        };
        
        // Auto-advance after selection (optional)
        // setTimeout(() => this.nextQuestion(), 500);
    }
    
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
            this.restoreAnswer();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
            this.restoreAnswer();
        }
    }
    
    restoreAnswer() {
        const savedAnswer = this.userAnswers[this.currentQuestion];
        if (savedAnswer) {
            document.querySelectorAll('.option-item').forEach((item, index) => {
                if (index === savedAnswer.selected) {
                    item.classList.add('selected');
                }
            });
        }
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            
            const timerDisplay = document.getElementById('timerDisplay');
            if (timerDisplay) {
                timerDisplay.textContent = this.formatTime(this.timeLeft);
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.autoSubmit();
            }
        }, 1000);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    runCode() {
        const code = document.querySelector('.code-input')?.value;
        const output = document.querySelector('.code-output');
        
        if (code && output) {
            try {
                // Execute code in a safe manner
                const result = eval(code);
                output.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`;
            } catch (error) {
                output.innerHTML = `<pre class="error">Error: ${error.message}</pre>`;
            }
        }
    }
    
    showHint() {
        const question = this.questions[this.currentQuestion];
        alert(`Hint: ${question.explanation}`);
    }
    
    submitAssessment() {
        clearInterval(this.timer);
        
        // Calculate score
        this.calculateScore();
        this.showResults();
    }
    
    autoSubmit() {
        clearInterval(this.timer);
        alert('Time is up! Assessment will be submitted automatically.');
        this.calculateScore();
        this.showResults();
    }
    
    calculateScore() {
        this.score = 0;
        this.categories = {};
        
        this.userAnswers.forEach((answer, index) => {
            const question = this.questions[index];
            
            if (answer && answer.isCorrect) {
                this.score += 10;
                
                // Track category performance
                if (!this.categories[question.category]) {
                    this.categories[question.category] = {
                        correct: 0,
                        total: 0
                    };
                }
                this.categories[question.category].correct++;
            }
            
            // Update category totals
            if (question.category) {
                if (!this.categories[question.category]) {
                    this.categories[question.category] = {
                        correct: 0,
                        total: 0
                    };
                }
                this.categories[question.category].total++;
            }
        });
    }
    
    showResults() {
        const totalScore = this.score;
        const maxScore = this.questions.length * 10;
        const percentage = Math.round((totalScore / maxScore) * 100);
        
        const resultsHTML = `
            <div class="assessment-results">
                <div class="results-header">
                    <h2>Assessment Results</h2>
                    <div class="overall-score">
                        <div class="score-circle">
                            <span class="score-percentage">${percentage}%</span>
                            <span class="score-text">${totalScore}/${maxScore}</span>
                        </div>
                    </div>
                </div>
                
                <div class="score-breakdown">
                    <h4>Performance by Category</h4>
                    <div class="category-scores">
                        ${Object.entries(this.categories).map(([category, data]) => {
                            const percent = Math.round((data.correct / data.total) * 100);
                            return `
                                <div class="category-score">
                                    <div class="category-header">
                                        <span class="category-name">${category}</span>
                                        <span class="category-percent">${percent}%</span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${percent}%"></div>
                                    </div>
                                    <div class="category-details">
                                        ${data.correct}/${data.total} correct
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="detailed-results">
                    <h4>Question Review</h4>
                    <div class="questions-review">
                        ${this.questions.map((question, index) => {
                            const userAnswer = this.userAnswers[index];
                            const isCorrect = userAnswer?.isCorrect || false;
                            const userChoice = userAnswer?.selected !== undefined ? question.options[userAnswer.selected] : 'Not answered';
                            const correctAnswer = question.options[question.correct];
                            
                            return `
                                <div class="question-review ${isCorrect ? 'correct' : 'incorrect'}">
                                    <div class="review-header">
                                        <span class="question-number">Q${index + 1}</span>
                                        <span class="question-status">
                                            ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                        </span>
                                    </div>
                                    <div class="review-body">
                                        <p class="question-text">${question.question}</p>
                                        <div class="answer-comparison">
                                            <div class="user-answer">
                                                <strong>Your answer:</strong> ${userChoice}
                                            </div>
                                            ${!isCorrect ? `
                                                <div class="correct-answer">
                                                    <strong>Correct answer:</strong> ${correctAnswer}
                                                </div>
                                            ` : ''}
                                        </div>
                                        <div class="explanation">
                                            <strong>Explanation:</strong> ${question.explanation}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="recommendations">
                    <h4>Recommendations</h4>
                    <div class="recommendation-list">
                        ${this.generateRecommendations().map(rec => `
                            <div class="recommendation-item">
                                <i class="fas fa-lightbulb"></i>
                                <span>${rec}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-primary" onclick="skillAssessment.retryAssessment()">
                        <i class="fas fa-redo me-2"></i>Retry Assessment
                    </button>
                    <button class="btn btn-success" onclick="skillAssessment.downloadCertificate()">
                        <i class="fas fa-certificate me-2"></i>Download Certificate
                    </button>
                    <button class="btn btn-outline-primary" onclick="skillAssessment.shareResults()">
                        <i class="fas fa-share me-2"></i>Share Results
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('assessmentContainer').innerHTML = resultsHTML;
    }
    
    generateRecommendations() {
        const recommendations = [];
        const weakCategories = [];
        
        // Find weak categories (below 70%)
        Object.entries(this.categories).forEach(([category, data]) => {
            const percent = (data.correct / data.total) * 100;
            if (percent < 70) {
                weakCategories.push(category);
            }
        });
        
        // Generate recommendations based on performance
        const totalPercentage = (this.score / (this.questions.length * 10)) * 100;
        
        if (totalPercentage >= 80) {
            recommendations.push(
                "Excellent performance! Keep up the good work.",
                "Consider taking advanced assessments to challenge yourself.",
                "Share your results with potential employers."
            );
        } else if (totalPercentage >= 60) {
            recommendations.push(
                "Good performance, but there's room for improvement.",
                "Focus on practicing questions in your weak areas.",
                "Review fundamental concepts regularly."
            );
        } else {
            recommendations.push(
                "Focus on building strong fundamentals.",
                "Take beginner-friendly courses to strengthen your knowledge.",
                "Practice daily with coding exercises."
            );
        }
        
        // Add specific category recommendations
        if (weakCategories.length > 0) {
            recommendations.push(`Focus on improving: ${weakCategories.join(', ')}`);
        }
        
        return recommendations.slice(0, 5);
    }
    
    retryAssessment() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.timeLeft = this.timeLimit;
        this.categories = {};
        
        this.renderQuestion();
        this.startTimer();
    }
    
    downloadCertificate() {
        const totalPercentage = Math.round((this.score / (this.questions.length * 10)) * 100);
        
        if (totalPercentage >= 70) {
            // Create certificate
            const certificate = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; }
                        .certificate { border: 20px solid #4A00E0; padding: 50px; text-align: center; }
                        h1 { color: #4A00E0; }
                        .score { font-size: 24px; color: #00b894; }
                    </style>
                </head>
                <body>
                    <div class="certificate">
                        <h1>Certificate of Achievement</h1>
                        <p>This certifies that</p>
                        <h2>${localStorage.getItem('userName') || 'Participant'}</h2>
                        <p>has successfully completed the Skill Assessment with a score of</p>
                        <div class="score">${totalPercentage}%</div>
                        <p>Date: ${new Date().toLocaleDateString()}</p>
                        <p>Carrier Lens Skill Assessment</p>
                    </div>
                </body>
                </html>
            `;
            
            const blob = new Blob([certificate], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'skill-assessment-certificate.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            alert('Certificate requires a score of 70% or higher.');
        }
    }
    
    shareResults() {
        const totalPercentage = Math.round((this.score / (this.questions.length * 10)) * 100);
        const text = `I scored ${totalPercentage}% on my Carrier Lens skill assessment! #CareerDevelopment #Skills`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Skill Assessment Results',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text);
            alert('Results copied to clipboard!');
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        document.querySelector('.progress-fill')?.style.width = `${progress}%`;
    }
}

// Initialize Skill Assessment
document.addEventListener('DOMContentLoaded', () => {
    window.skillAssessment = new SkillAssessment();
});

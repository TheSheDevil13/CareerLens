// Interview Preparation Simulator for Career Lens

class InterviewPrep {
    constructor() {
        this.questions = this.getQuestions();
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.timer = null;
        this.timeLeft = 180; // 3 minutes per question
        this.isRecording = false;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        
        this.init();
    }
    
    init() {
        this.loadQuestions();
        this.initEventListeners();
        this.initRecorder();
        this.showQuestion();
        this.startTimer();
    }
    
    loadQuestions() {
        // Load questions based on selected career path
        const path = localStorage.getItem('selectedCareerPath') || 'frontend';
        this.questions = this.getQuestionsByPath(path);
    }
    
    getQuestionsByPath(path) {
        const questions = {
            frontend: [
                {
                    id: 1,
                    question: "Explain the difference between var, let, and const in JavaScript",
                    type: "theory",
                    difficulty: "easy",
                    category: "JavaScript",
                    time: "3 minutes",
                    sampleAnswer: "var is function-scoped and can be redeclared, let is block-scoped and can be reassigned, const is block-scoped and cannot be reassigned.",
                    tips: ["Focus on scope", "Mention hoisting", "Discuss reassignment"]
                },
                {
                    id: 2,
                    question: "What is the Virtual DOM in React?",
                    type: "theory",
                    difficulty: "medium",
                    category: "React",
                    time: "4 minutes",
                    sampleAnswer: "The Virtual DOM is a lightweight copy of the actual DOM that allows React to perform efficient updates.",
                    tips: ["Compare with real DOM", "Explain reconciliation", "Discuss performance benefits"]
                },
                {
                    id: 3,
                    question: "Write a function to reverse a string",
                    type: "coding",
                    difficulty: "easy",
                    category: "Algorithms",
                    time: "5 minutes",
                    testCases: [
                        { input: ["hello"], expected: "olleh" },
                        { input: ["world"], expected: "dlrow" },
                        { input: [""], expected: "" }
                    ],
                    hints: ["Use string methods", "Try a for loop"]
                }
            ],
            backend: [
                {
                    id: 4,
                    question: "Explain REST API principles",
                    type: "theory",
                    difficulty: "medium",
                    category: "Backend",
                    time: "4 minutes"
                },
                {
                    id: 5,
                    question: "What is database normalization?",
                    type: "theory",
                    difficulty: "medium",
                    category: "Database",
                    time: "5 minutes"
                }
            ]
        };
        
        return questions[path] || questions.frontend;
    }
    
    initEventListeners() {
        // Navigation buttons
        document.getElementById('prevQuestion')?.addEventListener('click', () => {
            this.prevQuestion();
        });
        
        document.getElementById('nextQuestion')?.addEventListener('click', () => {
            this.nextQuestion();
        });
        
        document.getElementById('submitInterview')?.addEventListener('click', () => {
            this.submitInterview();
        });
        
        // Answer submission
        document.getElementById('submitAnswer')?.addEventListener('click', () => {
            this.submitAnswer();
        });
        
        // Recording controls
        document.getElementById('startRecording')?.addEventListener('click', () => {
            this.toggleRecording();
        });
        
        document.getElementById('playRecording')?.addEventListener('click', () => {
            this.playRecording();
        });
        
        // Timer controls
        document.getElementById('pauseTimer')?.addEventListener('click', () => {
            this.pauseTimer();
        });
        
        document.getElementById('resetTimer')?.addEventListener('click', () => {
            this.resetTimer();
        });
        
        // Hint toggle
        document.getElementById('showHint')?.addEventListener('click', () => {
            this.toggleHint();
        });
        
        // Sample answer toggle
        document.getElementById('showSample')?.addEventListener('click', () => {
            this.toggleSampleAnswer();
        });
    }
    
    initRecorder() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ 
                audio: true,
                video: false 
            }).then(stream => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.recordedChunks = [];
                
                this.mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        this.recordedChunks.push(event.data);
                    }
                };
                
                this.mediaRecorder.onstop = () => {
                    const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
                    const url = URL.createObjectURL(blob);
                    this.audioUrl = url;
                };
                
                console.log('Audio recorder initialized');
            }).catch(error => {
                console.error('Error accessing microphone:', error);
            });
        }
    }
    
    showQuestion() {
        const question = this.questions[this.currentQuestion];
        const container = document.getElementById('questionContainer');
        
        container.innerHTML = `
            <div class="question-header">
                <div class="question-meta">
                    <span class="badge bg-${question.difficulty === 'easy' ? 'success' : question.difficulty === 'medium' ? 'warning' : 'danger'}">
                        ${question.difficulty}
                    </span>
                    <span class="ms-2"><i class="fas fa-clock"></i> ${question.time}</span>
                    <span class="ms-2"><i class="fas fa-tag"></i> ${question.category}</span>
                </div>
                <div class="question-counter">
                    Question ${this.currentQuestion + 1} of ${this.questions.length}
                </div>
            </div>
            
            <div class="question-body">
                <h4>${question.question}</h4>
                
                <div class="answer-container">
                    ${question.type === 'coding' ? this.getCodingEditor() : this.getTextAnswerArea()}
                </div>
                
                <div class="question-hint" id="questionHint" style="display: none;">
                    <strong>Hint:</strong> ${question.hints ? question.hints[0] : 'Think step by step'}
                </div>
                
                <div class="sample-answer" id="sampleAnswer" style="display: none;">
                    <strong>Sample Answer:</strong> ${question.sampleAnswer || 'No sample answer available'}
                </div>
            </div>
            
            <div class="question-footer">
                <div class="timer-display">
                    <i class="fas fa-clock"></i>
                    <span id="timer">${Math.floor(this.timeLeft / 60)}:${(this.timeLeft % 60).toString().padStart(2, '0')}</span>
                </div>
                
                <div class="question-actions">
                    <button class="btn btn-outline-primary" id="showHint">
                        <i class="fas fa-lightbulb"></i> Show Hint
                    </button>
                    <button class="btn btn-outline-primary" id="showSample">
                        <i class="fas fa-eye"></i> Sample Answer
                    </button>
                    <button class="btn btn-primary" id="submitAnswer">
                        Submit Answer
                    </button>
                </div>
            </div>
        `;
        
        // Re-attach event listeners
        this.attachQuestionEventListeners();
        
        // Initialize code editor for coding questions
        if (question.type === 'coding') {
            this.initCodeEditor();
        }
    }
    
    getCodingEditor() {
        return `
            <div class="code-editor">
                <div class="editor-header">
                    <span>JavaScript</span>
                    <button class="btn btn-sm btn-outline-secondary" id="runCode">
                        <i class="fas fa-play"></i> Run Code
                    </button>
                </div>
                <div class="editor-container">
                    <textarea id="codeInput" class="code-input" placeholder="Write your solution here..."></textarea>
                    <div class="output-container">
                        <h6>Output:</h6>
                        <div id="codeOutput" class="code-output"></div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getTextAnswerArea() {
        return `
            <div class="text-answer">
                <textarea id="textAnswer" class="form-control" rows="6" 
                          placeholder="Type your answer here..."></textarea>
            </div>
        `;
    }
    
    attachQuestionEventListeners() {
        // Hint button
        document.getElementById('showHint')?.addEventListener('click', () => {
            this.toggleHint();
        });
        
        // Sample answer button
        document.getElementById('showSample')?.addEventListener('click', () => {
            this.toggleSampleAnswer();
        });
        
        // Submit answer button
        document.getElementById('submitAnswer')?.addEventListener('click', () => {
            this.submitAnswer();
        });
        
        // Run code button (for coding questions)
        document.getElementById('runCode')?.addEventListener('click', () => {
            this.runCode();
        });
    }
    
    initCodeEditor() {
        // Initialize code editor with syntax highlighting
        const codeInput = document.getElementById('codeInput');
        if (codeInput) {
            codeInput.value = `function solution(input) {\n    // Your code here\n    return input;\n}`;
        }
    }
    
    startTimer() {
        clearInterval(this.timer);
        this.timeLeft = 180; // Reset to 3 minutes
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            
            const timerElement = document.getElementById('timer');
            if (timerElement) {
                const minutes = Math.floor(this.timeLeft / 60);
                const seconds = this.timeLeft % 60;
                timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.autoSubmit();
            }
        }, 1000);
    }
    
    pauseTimer() {
        clearInterval(this.timer);
    }
    
    resetTimer() {
        this.timeLeft = 180;
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = '3:00';
        }
    }
    
    toggleRecording() {
        if (!this.isRecording) {
            this.startRecording();
        } else {
            this.stopRecording();
        }
    }
    
    startRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'inactive') {
            this.recordedChunks = [];
            this.mediaRecorder.start();
            this.isRecording = true;
            
            const recordBtn = document.getElementById('startRecording');
            recordBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
            recordBtn.classList.remove('btn-outline-primary');
            recordBtn.classList.add('btn-danger');
            
            console.log('Recording started...');
        }
    }
    
    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            const recordBtn = document.getElementById('startRecording');
            recordBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
            recordBtn.classList.remove('btn-danger');
            recordBtn.classList.add('btn-outline-primary');
            
            console.log('Recording stopped');
        }
    }
    
    playRecording() {
        if (this.audioUrl) {
            const audio = new Audio(this.audioUrl);
            audio.play();
        } else {
            alert('No recording available. Please record your answer first.');
        }
    }
    
    toggleHint() {
        const hintElement = document.getElementById('questionHint');
        if (hintElement) {
            hintElement.style.display = hintElement.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    toggleSampleAnswer() {
        const sampleElement = document.getElementById('sampleAnswer');
        if (sampleElement) {
            sampleElement.style.display = sampleElement.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    submitAnswer() {
        const question = this.questions[this.currentQuestion];
        let answer = '';
        
        if (question.type === 'coding') {
            answer = document.getElementById('codeInput')?.value || '';
            const result = this.evaluateCode(answer, question.testCases);
            this.score += result.score;
            
            this.userAnswers.push({
                questionId: question.id,
                answer: answer,
                score: result.score,
                feedback: result.feedback
            });
            
            this.showCodeResult(result);
        } else {
            answer = document.getElementById('textAnswer')?.value || '';
            const score = this.evaluateTextAnswer(answer, question);
            
            this.userAnswers.push({
                questionId: question.id,
                answer: answer,
                score: score,
                feedback: 'Good answer! Consider adding more specific examples.'
            });
            
            this.showTextResult(score);
        }
        
        // Move to next question after delay
        setTimeout(() => {
            if (this.currentQuestion < this.questions.length - 1) {
                this.nextQuestion();
            } else {
                this.showResults();
            }
        }, 2000);
    }
    
    evaluateCode(code, testCases) {
        let passed = 0;
        let results = [];
        
        try {
            // Create a function from the code
            const func = new Function('return ' + code)();
            
            testCases.forEach((testCase, index) => {
                const output = func(...testCase.input);
                const expected = testCase.expected;
                const isPassed = JSON.stringify(output) === JSON.stringify(expected);
                
                if (isPassed) passed++;
                
                results.push({
                    testCase: index + 1,
                    input: testCase.input,
                    expected: expected,
                    output: output,
                    passed: isPassed
                });
            });
            
            const score = Math.floor((passed / testCases.length) * 10);
            
            return {
                score: score,
                passed: passed,
                total: testCases.length,
                results: results,
                feedback: passed === testCases.length ? 
                    'Excellent! All test cases passed.' :
                    `${passed}/${testCases.length} test cases passed.`
            };
        } catch (error) {
            return {
                score: 0,
                passed: 0,
                total: testCases.length,
                results: [],
                feedback: `Error: ${error.message}`
            };
        }
    }
    
    evaluateTextAnswer(answer, question) {
        // Simple scoring based on answer length and keywords
        let score = 5; // Base score
        
        // Check for keywords in sample answer
        const keywords = question.sampleAnswer?.toLowerCase().split(' ') || [];
        const answerLower = answer.toLowerCase();
        
        keywords.forEach(keyword => {
            if (answerLower.includes(keyword) && keyword.length > 3) {
                score += 1;
            }
        });
        
        // Bonus for longer answers (within reason)
        const wordCount = answer.split(' ').length;
        if (wordCount > 50) score += 2;
        if (wordCount > 100) score += 1;
        
        return Math.min(score, 10);
    }
    
    showCodeResult(result) {
        const outputElement = document.getElementById('codeOutput');
        if (outputElement) {
            outputElement.innerHTML = `
                <div class="test-results">
                    <h6>Test Results: ${result.passed}/${result.total} passed</h6>
                    <div class="test-cases">
                        ${result.results.map((test, index) => `
                            <div class="test-case ${test.passed ? 'passed' : 'failed'}">
                                <span>Test ${test.testCase}: ${test.passed ? '✓' : '✗'}</span>
                                ${!test.passed ? `
                                    <small>Expected: ${JSON.stringify(test.expected)}</small>
                                    <small>Got: ${JSON.stringify(test.output)}</small>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <div class="score-display">
                        <strong>Score: ${result.score}/10</strong>
                    </div>
                </div>
            `;
        }
    }
    
    showTextResult(score) {
        const answerElement = document.getElementById('textAnswer');
        if (answerElement) {
            const container = document.createElement('div');
            container.className = 'text-result';
            container.innerHTML = `
                <div class="score-display">
                    <h6>Answer Submitted!</h6>
                    <div class="score-circle">
                        <span>${score}/10</span>
                    </div>
                    <p class="feedback">Good job! Your answer has been recorded.</p>
                </div>
            `;
            
            answerElement.parentNode.appendChild(container);
        }
    }
    
    runCode() {
        const code = document.getElementById('codeInput')?.value;
        const question = this.questions[this.currentQuestion];
        
        if (code && question.testCases) {
            const result = this.evaluateCode(code, question.testCases);
            this.showCodeResult(result);
        }
    }
    
    autoSubmit() {
        alert('Time is up! Moving to next question...');
        this.submitAnswer();
    }
    
    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.resetTimer();
            this.startTimer();
            this.showQuestion();
        }
    }
    
    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.resetTimer();
            this.startTimer();
            this.showQuestion();
        }
    }
    
    submitInterview() {
        this.pauseTimer();
        this.stopRecording();
        this.showResults();
    }
    
    showResults() {
        const totalScore = this.userAnswers.reduce((sum, answer) => sum + answer.score, 0);
        const maxScore = this.questions.length * 10;
        const percentage = Math.round((totalScore / maxScore) * 100);
        
        const resultsHTML = `
            <div class="results-container">
                <div class="results-header">
                    <h2>Interview Results</h2>
                    <div class="overall-score">
                        <div class="score-circle">
                            <svg width="120" height="120">
                                <circle cx="60" cy="60" r="54" stroke="#e0e0e0" stroke-width="8" fill="none"/>
                                <circle cx="60" cy="60" r="54" stroke="${this.getScoreColor(percentage)}" 
                                        stroke-width="8" fill="none"
                                        stroke-dasharray="${2 * Math.PI * 54}"
                                        stroke-dashoffset="${2 * Math.PI * 54 * (1 - percentage / 100)}"/>
                                <text x="60" y="65" text-anchor="middle" font-size="24" font-weight="bold">
                                    ${percentage}%
                                </text>
                            </svg>
                        </div>
                        <p class="score-text">${totalScore}/${maxScore} points</p>
                    </div>
                </div>
                
                <div class="results-details">
                    <div class="detail-card">
                        <h5>Strengths</h5>
                        <ul>
                            ${this.getStrengths().map(strength => `<li>${strength}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-card">
                        <h5>Areas for Improvement</h5>
                        <ul>
                            ${this.getImprovements().map(improvement => `<li>${improvement}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="detail-card">
                        <h5>Recommendations</h5>
                        <ul>
                            ${this.getRecommendations().map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="question-breakdown">
                    <h5>Question-by-Question Analysis</h5>
                    <div class="breakdown-list">
                        ${this.userAnswers.map((answer, index) => `
                            <div class="breakdown-item">
                                <div class="question-number">Q${index + 1}</div>
                                <div class="question-score">
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${answer.score * 10}%"></div>
                                    </div>
                                    <span>${answer.score}/10</span>
                                </div>
                                <button class="btn btn-sm btn-outline-primary" onclick="interviewPrep.viewAnswer(${index})">
                                    View Answer
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-primary" onclick="interviewPrep.retryInterview()">
                        <i class="fas fa-redo me-2"></i>Retry Interview
                    </button>
                    <button class="btn btn-success" onclick="interviewPrep.downloadReport()">
                        <i class="fas fa-download me-2"></i>Download Report
                    </button>
                    <button class="btn btn-outline-primary" onclick="interviewPrep.shareResults()">
                        <i class="fas fa-share me-2"></i>Share Results
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('interviewContainer').innerHTML = resultsHTML;
    }
    
    getStrengths() {
        const strengths = [];
        const categories = {};
        
        this.userAnswers.forEach((answer, index) => {
            if (answer.score >= 8) {
                const category = this.questions[index].category;
                if (!categories[category]) {
                    categories[category] = true;
                    strengths.push(`Strong in ${category}`);
                }
            }
        });
        
        if (strengths.length === 0) {
            strengths.push('Good effort on all questions');
        }
        
        return strengths.slice(0, 3);
    }
    
    getImprovements() {
        const improvements = [];
        const categories = {};
        
        this.userAnswers.forEach((answer, index) => {
            if (answer.score <= 6) {
                const category = this.questions[index].category;
                if (!categories[category]) {
                    categories[category] = true;
                    improvements.push(`Need practice with ${category}`);
                }
            }
        });
        
        if (improvements.length === 0) {
            improvements.push('Keep practicing to maintain skills');
        }
        
        return improvements.slice(0, 3);
    }
    
    getRecommendations() {
        const totalScore = this.userAnswers.reduce((sum, answer) => sum + answer.score, 0);
        const percentage = (totalScore / (this.questions.length * 10)) * 100;
        
        if (percentage >= 80) {
            return [
                'Continue practicing advanced topics',
                'Consider taking mock interviews with different companies',
                'Focus on system design questions'
            ];
        } else if (percentage >= 60) {
            return [
                'Review fundamental concepts',
                'Practice coding problems daily',
                'Work on time management during interviews'
            ];
        } else {
            return [
                'Focus on basic concepts first',
                'Take beginner-friendly courses',
                'Practice explaining your thought process'
            ];
        }
    }
    
    getScoreColor(percentage) {
        if (percentage >= 80) return '#00b894';
        if (percentage >= 60) return '#fdcb6e';
        return '#d63031';
    }
    
    viewAnswer(index) {
        const answer = this.userAnswers[index];
        const question = this.questions[index];
        
        alert(`
            Question: ${question.question}
            
            Your Answer: ${answer.answer}
            
            Score: ${answer.score}/10
            Feedback: ${answer.feedback}
            
            ${question.sampleAnswer ? `Sample Answer: ${question.sampleAnswer}` : ''}
        `);
    }
    
    retryInterview() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = [];
        this.resetTimer();
        this.showQuestion();
        this.startTimer();
    }
    
    downloadReport() {
        const report = {
            date: new Date().toISOString(),
            totalScore: this.userAnswers.reduce((sum, answer) => sum + answer.score, 0),
            maxScore: this.questions.length * 10,
            questions: this.questions.map((q, i) => ({
                question: q.question,
                category: q.category,
                difficulty: q.difficulty,
                userScore: this.userAnswers[i]?.score || 0,
                userAnswer: this.userAnswers[i]?.answer || '',
                feedback: this.userAnswers[i]?.feedback || ''
            })),
            strengths: this.getStrengths(),
            improvements: this.getImprovements(),
            recommendations: this.getRecommendations()
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    shareResults() {
        const totalScore = this.userAnswers.reduce((sum, answer) => sum + answer.score, 0);
        const maxScore = this.questions.length * 10;
        const percentage = Math.round((totalScore / maxScore) * 100);
        
        const text = `I scored ${percentage}% on my mock interview! #CareerLens #InterviewPrep`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Interview Results',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text);
            alert('Results copied to clipboard!');
        }
    }
    
    getQuestions() {
        return [
            {
                id: 1,
                question: "Explain the difference between var, let, and const in JavaScript",
                type: "theory",
                difficulty: "easy",
                category: "JavaScript",
                time: "3 minutes"
            }
        ];
    }
}

// Initialize Interview Prep
document.addEventListener('DOMContentLoaded', () => {
    window.interviewPrep = new InterviewPrep();
});
// Extensive Dummy Data for Career Lens

const departments = [
    {
        id: 1,
        name: "Computer Science & Engineering",
        category: "tech",
        icon: "fas fa-laptop-code",
        color: "#4A00E0",
        description: "Software development, AI, data science, and more",
        demandScore: 95,
        avgEntrySalary: "$75,000",
        growthRate: "22% (Much faster than average)",
        
        careerPaths: [
            {
                id: "cse-1",
                title: "Full Stack Developer",
                description: "Build complete web applications",
                difficulty: "Intermediate",
                timeToHire: "2-4 months",
                skills: [
                    { name: "JavaScript", level: 90, importance: "High" },
                    { name: "React", level: 85, importance: "High" },
                    { name: "Node.js", level: 80, importance: "High" },
                    { name: "MongoDB", level: 75, importance: "Medium" },
                    { name: "Git", level: 85, importance: "High" }
                ],
                courses: [
                    { name: "The Complete Web Developer Bootcamp", platform: "Udemy", duration: "60h", rating: 4.7, cost: "$89.99" },
                    { name: "Full Stack Open", platform: "University of Helsinki", duration: "200h", rating: 4.8, cost: "Free" },
                    { name: "Meta Back-End Developer", platform: "Coursera", duration: "8 months", rating: 4.6, cost: "$49/month" }
                ],
                certifications: [
                    "AWS Certified Developer",
                    "Google Cloud Associate",
                    "MongoDB Certified Developer"
                ],
                jobTitles: ["Frontend Developer", "Backend Developer", "Full Stack Engineer", "Web Developer"],
                companies: ["Google", "Microsoft", "Amazon", "Startups"],
                salaryRange: { entry: "$65,000", mid: "$110,000", senior: "$150,000+" },
                marketTrend: "Growing demand for full-stack developers with cloud experience"
            },
            {
                id: "cse-2",
                title: "Data Scientist",
                description: "Extract insights from complex data",
                difficulty: "Advanced",
                timeToHire: "4-6 months",
                skills: [
                    { name: "Python", level: 90, importance: "High" },
                    { name: "Machine Learning", level: 85, importance: "High" },
                    { name: "Statistics", level: 80, importance: "High" },
                    { name: "SQL", level: 75, importance: "Medium" },
                    { name: "Data Visualization", level: 70, importance: "Medium" }
                ],
                courses: [
                    { name: "Machine Learning Specialization", platform: "Coursera", duration: "8 months", rating: 4.9, cost: "$49/month" },
                    { name: "Data Science Bootcamp", platform: "Springboard", duration: "6 months", rating: 4.7, cost: "$8,900" }
                ],
                jobTitles: ["Data Analyst", "ML Engineer", "Data Scientist", "Business Intelligence Analyst"],
                salaryRange: { entry: "$85,000", mid: "$130,000", senior: "$180,000+" }
            }
        ],
        
        roadmap: {
            month1: ["Learn Programming Fundamentals", "Complete HTML/CSS/JS"],
            month2: ["Build Simple Projects", "Learn React Basics"],
            month3: ["Learn Backend Development", "Build Full Stack App"],
            month4: ["Learn Databases", "Deploy Projects"],
            month5: ["Prepare Resume", "Start Applying"],
            month6: ["Interview Preparation", "Land First Job"]
        },
        
        successStories: [
            {
                name: "Alex Chen",
                role: "Software Engineer at Spotify",
                timeline: "6 months",
                salaryIncrease: "300%",
                testimonial: "Career Lens showed me exactly what skills I needed to learn. The roadmap was spot on!"
            }
        ]
    },
    
    {
        id: 2,
        name: "Electrical Engineering",
        category: "tech",
        icon: "fas fa-bolt",
        color: "#FF8E00",
        description: "Power systems, electronics, telecommunications",
        demandScore: 85,
        avgEntrySalary: "$68,000",
        growthRate: "7% (As fast as average)",
        
        careerPaths: [
            {
                id: "ee-1",
                title: "Power Systems Engineer",
                description: "Design and maintain electrical power systems",
                skills: ["MATLAB", "AutoCAD", "Circuit Design", "Renewable Energy"],
                salaryRange: { entry: "$65,000", mid: "$95,000", senior: "$130,000" }
            }
        ]
    },
    
    // Add 20+ more departments...
];

const jobListings = [
    {
        id: 1,
        title: "Junior Frontend Developer",
        company: "TechCorp Inc.",
        logo: "assets/images/companies/techcorp.png",
        location: "San Francisco, CA (Remote Available)",
        type: "Full-time",
        salary: "$65,000 - $80,000",
        equity: "0.01% - 0.05%",
        experience: "0-2 years",
        posted: "2 days ago",
        deadline: "2024-06-30",
        department: "CSE",
        requirements: ["React", "JavaScript", "HTML/CSS", "Git"],
        perks: ["Health Insurance", "Remote Work", "Stock Options", "Learning Budget"],
        description: "Join our team building the next generation of web applications...",
        applicationCount: 145,
        matchScore: 92,
        culture: {
            workLifeBalance: 4.5,
            careerGrowth: 4.7,
            diversity: 4.2,
            overall: 4.5
        }
    },
    // 50+ more job listings...
];

const courses = {
    "CSE": [
        {
            id: 1,
            name: "The Complete Web Developer Bootcamp 2024",
            instructor: "Dr. Angela Yu",
            platform: "Udemy",
            duration: "65 hours",
            level: "Beginner to Advanced",
            rating: 4.7,
            students: "1,200,000+",
            price: {
                original: "$189.99",
                discount: "$89.99",
                free: false
            },
            skills: ["HTML", "CSS", "JavaScript", "Node.js", "React", "MongoDB"],
            certificate: true,
            projects: 15,
            completionRate: "78%",
            avgSalaryIncrease: "42%"
        }
    ]
};

const cvTemplates = [
    {
        id: 1,
        name: "Modern Professional",
        category: "Technical",
        style: "modern",
        colorScheme: "blue",
        preview: "assets/images/templates/template1.jpg",
        sections: ["Header", "Summary", "Experience", "Education", "Skills", "Projects"],
        aiScore: 92,
        downloadCount: 12450
    },
    // More templates...
];

const interviewQuestions = {
    "CSE": {
        "Frontend Developer": [
            {
                question: "Explain the Virtual DOM in React",
                difficulty: "Medium",
                category: "React",
                time: "3 minutes",
                sampleAnswer: "The Virtual DOM is a lightweight copy of the actual DOM...",
                tips: ["Compare with real DOM", "Mention reconciliation", "Discuss performance benefits"]
            },
            // More questions...
        ]
    }
};

const skillAssessmentQuestions = [
    {
        id: 1,
        category: "Programming",
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1,
        explanation: "Binary search divides the search space in half each time..."
    },
    // 100+ questions...
];

const salaryData = {
    "CSE": {
        "Frontend Developer": {
            "entry": { min: 65000, avg: 75000, max: 85000 },
            "mid": { min: 90000, avg: 110000, max: 130000 },
            "senior": { min: 130000, avg: 150000, max: 200000 },
            "factors": ["Location", "Company Size", "Skills", "Experience"],
            "bonus": { avg: "15%", range: "5-30%" }
        }
    }
};

const communityPosts = [
    {
        id: 1,
        user: {
            name: "Sarah Johnson",
            avatar: "assets/images/avatars/avatar2.jpg",
            role: "Software Engineer",
            company: "Google"
        },
        content: "Just landed my dream job at Google! Thanks to Career Lens for the perfect roadmap.",
        likes: 245,
        comments: 42,
        shares: 18,
        tags: ["#success", "#google", "#careerpath"],
        timestamp: "2 hours ago"
    }
];

// Export data
window.appData = {
    departments,
    jobListings,
    courses,
    cvTemplates,
    interviewQuestions,
    skillAssessmentQuestions,
    salaryData,
    communityPosts
};
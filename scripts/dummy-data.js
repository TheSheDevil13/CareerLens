// Extensive Dummy Data for Career Lens - The "Local Database"
// This file acts as the backend, providing all data for the application.

// 1. Departments & Career Paths
const departments = [
    {
        id: 1,
        name: "Computer Science & Engineering",
        category: "stem",
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
                description: "Build complete web applications from front to back.",
                difficulty: "Intermediate",
                timeToHire: "2-4 months",
                skills: [
                    { name: "JavaScript", level: 90 }, { name: "React", level: 85 }, 
                    { name: "Node.js", level: 80 }, { name: "SQL", level: 75 }
                ],
                salaryRange: { entry: "$65,000", senior: "$150,000+" }
            },
            {
                id: "cse-2",
                title: "Data Scientist",
                description: "Extract insights from complex data using ML and stats.",
                difficulty: "Advanced",
                timeToHire: "4-6 months",
                skills: [
                    { name: "Python", level: 95 }, { name: "Machine Learning", level: 85 }, 
                    { name: "Statistics", level: 80 }
                ],
                salaryRange: { entry: "$85,000", senior: "$180,000+" }
            },
            {
                id: "cse-3",
                title: "DevOps Engineer",
                description: "Bridge the gap between development and operations.",
                difficulty: "Advanced",
                timeToHire: "3-5 months",
                skills: [
                    { name: "AWS/Azure", level: 90 }, { name: "Docker/Kubernetes", level: 85 }, 
                    { name: "CI/CD", level: 80 }
                ],
                salaryRange: { entry: "$80,000", senior: "$160,000+" }
            }
        ]
    },
    {
        id: 3,
        name: "Electrical Engineering",
        category: "stem",
        icon: "fas fa-bolt",
        color: "#FF8E00",
        description: "Power systems, electronics, and telecommunications.",
        demandScore: 85,
        avgEntrySalary: "$72,000",
        growthRate: "7% (Stable)",
        careerPaths: [
            {
                id: "ee-1",
                title: "Power Systems Engineer",
                description: "Design and maintain electrical power grids.",
                difficulty: "Intermediate",
                timeToHire: "3-5 months",
                skills: [
                    { name: "Circuit Design", level: 90 }, { name: "AutoCAD", level: 85 }
                ],
                salaryRange: { entry: "$70,000", senior: "$140,000+" }
            },
            {
                id: "ee-2",
                title: "Electronics Engineer",
                description: "Design and develop electronic circuits and systems.",
                difficulty: "Intermediate",
                timeToHire: "3-5 months",
                skills: [
                    { name: "Circuit Design", level: 90 }, { name: "Embedded Systems", level: 85 }, { name: "PCB Design", level: 80 }
                ],
                salaryRange: { entry: "$68,000", senior: "$135,000+" }
            }
        ]
    },
    {
        id: 4,
        name: "Mechanical Engineering",
        category: "stem",
        icon: "fas fa-cogs",
        color: "#0984e3",
        description: "Design and manufacturing of mechanical systems.",
        demandScore: 82,
        avgEntrySalary: "$68,000",
        growthRate: "5% (Average)",
        careerPaths: [
            {
                id: "me-1",
                title: "Mechanical Design Engineer",
                description: "Design mechanical components and systems.",
                difficulty: "Intermediate",
                timeToHire: "3-5 months",
                skills: [
                    { name: "CAD", level: 90 }, { name: "SolidWorks", level: 85 }
                ],
                salaryRange: { entry: "$65,000", senior: "$130,000+" }
            },
            {
                id: "me-2",
                title: "Manufacturing Engineer",
                description: "Optimize manufacturing processes and production systems.",
                difficulty: "Intermediate",
                timeToHire: "3-5 months",
                skills: [
                    { name: "Process Optimization", level: 90 }, { name: "Quality Control", level: 85 }, { name: "Lean Manufacturing", level: 80 }
                ],
                salaryRange: { entry: "$63,000", senior: "$125,000+" }
            }
        ]
    },
    {
        id: 5,
        name: "Civil Engineering",
        category: "stem",
        icon: "fas fa-building",
        color: "#a29bfe",
        description: "Infrastructure design and construction management.",
        demandScore: 80,
        avgEntrySalary: "$65,000",
        growthRate: "6% (Average)",
        careerPaths: [
            {
                id: "ce-1",
                title: "Structural Engineer",
                description: "Design and analyze structures for safety.",
                difficulty: "Intermediate",
                timeToHire: "3-6 months",
                skills: [
                    { name: "Structural Analysis", level: 90 }, { name: "AutoCAD", level: 85 }
                ],
                salaryRange: { entry: "$63,000", senior: "$125,000+" }
            },
            {
                id: "ce-2",
                title: "Project Manager (Construction)",
                description: "Oversee construction projects from planning to completion.",
                difficulty: "Advanced",
                timeToHire: "4-6 months",
                skills: [
                    { name: "Project Management", level: 90 }, { name: "Budgeting", level: 85 }, { name: "Team Leadership", level: 80 }
                ],
                salaryRange: { entry: "$70,000", senior: "$145,000+" }
            }
        ]
    },
    {
        id: 6,
        name: "Marketing",
        category: "business",
        icon: "fas fa-bullhorn",
        color: "#fd79a8",
        description: "Digital marketing, branding, and consumer engagement.",
        demandScore: 85,
        avgEntrySalary: "$55,000",
        growthRate: "10% (Faster than average)",
        careerPaths: [
            {
                id: "mkt-1",
                title: "Digital Marketing Manager",
                description: "Lead online marketing campaigns and strategies.",
                difficulty: "Intermediate",
                timeToHire: "2-4 months",
                skills: [
                    { name: "SEO/SEM", level: 90 }, { name: "Analytics", level: 85 }, { name: "Content Marketing", level: 80 }
                ],
                salaryRange: { entry: "$55,000", senior: "$120,000+" }
            },
            {
                id: "mkt-2",
                title: "Brand Manager",
                description: "Develop and maintain brand identity and positioning.",
                difficulty: "Intermediate",
                timeToHire: "3-5 months",
                skills: [
                    { name: "Brand Strategy", level: 90 }, { name: "Market Research", level: 85 }, { name: "Creative Direction", level: 80 }
                ],
                salaryRange: { entry: "$58,000", senior: "$125,000+" }
            }
        ]
    },
    {
        id: 7,
        name: "Psychology",
        category: "arts",
        icon: "fas fa-brain",
        color: "#fdcb6e",
        description: "Human behavior, mental health, and research.",
        demandScore: 75,
        avgEntrySalary: "$50,000",
        growthRate: "8% (Average)",
        careerPaths: [
            {
                id: "psy-1",
                title: "Clinical Psychologist",
                description: "Provide mental health counseling and therapy.",
                difficulty: "Advanced",
                timeToHire: "6-12 months",
                skills: [
                    { name: "Counseling", level: 95 }, { name: "Assessment", level: 90 }
                ],
                salaryRange: { entry: "$50,000", senior: "$100,000+" }
            },
            {
                id: "psy-2",
                title: "Industrial/Organizational Psychologist",
                description: "Apply psychology principles to workplace and organizational settings.",
                difficulty: "Advanced",
                timeToHire: "4-8 months",
                skills: [
                    { name: "Organizational Behavior", level: 90 }, { name: "Data Analysis", level: 85 }, { name: "HR Consulting", level: 80 }
                ],
                salaryRange: { entry: "$65,000", senior: "$130,000+" }
            }
        ]
    },
    {
        id: 8,
        name: "Finance",
        category: "business",
        icon: "fas fa-chart-pie",
        color: "#00cec9",
        description: "Financial analysis, investment, and banking.",
        demandScore: 90,
        avgEntrySalary: "$70,000",
        growthRate: "12% (Faster than average)",
        careerPaths: [
            {
                id: "fin-1",
                title: "Financial Analyst",
                description: "Analyze financial data and market trends.",
                difficulty: "Intermediate",
                timeToHire: "2-4 months",
                skills: [
                    { name: "Financial Modeling", level: 90 }, { name: "Excel", level: 95 }, { name: "Analysis", level: 85 }
                ],
                salaryRange: { entry: "$65,000", senior: "$140,000+" }
            },
            {
                id: "fin-2",
                title: "Investment Banker",
                description: "Help companies raise capital and provide financial advisory services.",
                difficulty: "Advanced",
                timeToHire: "4-6 months",
                skills: [
                    { name: "Financial Analysis", level: 95 }, { name: "Deal Structuring", level: 90 }, { name: "Client Relations", level: 85 }
                ],
                salaryRange: { entry: "$85,000", senior: "$200,000+" }
            }
        ]
    }
];

// 2. Job Listings (Used by Job Portal & AI Search)
const jobListings = [
    // Computer Science & Engineering
    {
        id: 1,
        title: "Full Stack Developer",
        company: "TechCorp Inc.",
        location: "Remote",
        type: "Full-time",
        salary: "$65,000 - $80,000",
        experience: "0-2 years",
        posted: "2 days ago",
        department: "Computer Science & Engineering",
        requirements: ["JavaScript", "React", "Node.js", "SQL"],
        description: "Build complete web applications from front to back. Work with modern frameworks and databases to create scalable solutions."
    },
    {
        id: 2,
        title: "Data Scientist",
        company: "AI Solutions",
        location: "Remote",
        type: "Full-time",
        salary: "$85,000 - $110,000",
        experience: "1-3 years",
        posted: "Just now",
        department: "Computer Science & Engineering",
        requirements: ["Python", "Machine Learning", "Statistics"],
        description: "Extract insights from complex data using ML and stats. Build predictive models and analyze large datasets to drive business decisions."
    },
    {
        id: 3,
        title: "DevOps Engineer",
        company: "CloudTech Solutions",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$80,000 - $120,000",
        experience: "2-4 years",
        posted: "4 days ago",
        department: "Computer Science & Engineering",
        requirements: ["AWS/Azure", "Docker/Kubernetes", "CI/CD"],
        description: "Bridge the gap between development and operations. Manage cloud infrastructure and deployment pipelines."
    },
    // Electrical Engineering
    {
        id: 4,
        title: "Power Systems Engineer",
        company: "EnergyGrid Corp",
        location: "Chicago, IL",
        type: "Full-time",
        salary: "$70,000 - $95,000",
        experience: "1-3 years",
        posted: "3 days ago",
        department: "Electrical Engineering",
        requirements: ["Circuit Design", "AutoCAD"],
        description: "Design and maintain electrical power grids. Work on renewable energy integration and grid optimization."
    },
    {
        id: 5,
        title: "Electronics Engineer",
        company: "CircuitDesign Inc.",
        location: "Austin, TX",
        type: "Full-time",
        salary: "$68,000 - $92,000",
        experience: "0-3 years",
        posted: "1 week ago",
        department: "Electrical Engineering",
        requirements: ["Circuit Design", "Embedded Systems", "PCB Design"],
        description: "Design and develop electronic circuits and systems for consumer and industrial applications."
    },
    // Mechanical Engineering
    {
        id: 6,
        title: "Mechanical Design Engineer",
        company: "DesignWorks LLC",
        location: "Detroit, MI",
        type: "Full-time",
        salary: "$65,000 - $90,000",
        experience: "1-4 years",
        posted: "5 days ago",
        department: "Mechanical Engineering",
        requirements: ["CAD", "SolidWorks"],
        description: "Design mechanical components and systems. Create detailed drawings and specifications for manufacturing."
    },
    {
        id: 7,
        title: "Manufacturing Engineer",
        company: "Production Systems",
        location: "Cleveland, OH",
        type: "Full-time",
        salary: "$63,000 - $88,000",
        experience: "1-3 years",
        posted: "2 days ago",
        department: "Mechanical Engineering",
        requirements: ["Process Optimization", "Quality Control", "Lean Manufacturing"],
        description: "Optimize manufacturing processes and production systems. Improve efficiency and quality metrics."
    },
    // Civil Engineering
    {
        id: 8,
        title: "Structural Engineer",
        company: "BuildRight Construction",
        location: "Boston, MA",
        type: "Full-time",
        salary: "$63,000 - $85,000",
        experience: "1-3 years",
        posted: "6 days ago",
        department: "Civil Engineering",
        requirements: ["Structural Analysis", "AutoCAD"],
        description: "Design and analyze structures for safety. Work on residential and commercial projects ensuring compliance with building codes."
    },
    {
        id: 9,
        title: "Project Manager (Construction)",
        company: "MegaBuild Corp",
        location: "Dallas, TX",
        type: "Full-time",
        salary: "$70,000 - $100,000",
        experience: "3-5 years",
        posted: "1 week ago",
        department: "Civil Engineering",
        requirements: ["Project Management", "Budgeting", "Team Leadership"],
        description: "Oversee construction projects from planning to completion. Manage teams, budgets, and timelines effectively."
    },
    // Marketing
    {
        id: 10,
        title: "Digital Marketing Manager",
        company: "Creative Agency",
        location: "Austin, TX",
        type: "Full-time",
        salary: "$55,000 - $75,000",
        experience: "1-3 years",
        posted: "5 days ago",
        department: "Marketing",
        requirements: ["SEO/SEM", "Analytics", "Content Marketing"],
        description: "Lead online marketing campaigns and strategies. Drive brand awareness and customer engagement through digital channels."
    },
    {
        id: 11,
        title: "Brand Manager",
        company: "BrandWorks Inc.",
        location: "New York, NY",
        type: "Full-time",
        salary: "$58,000 - $80,000",
        experience: "2-4 years",
        posted: "3 days ago",
        department: "Marketing",
        requirements: ["Brand Strategy", "Market Research", "Creative Direction"],
        description: "Develop and maintain brand identity and positioning. Create compelling brand stories and campaigns that resonate with target audiences."
    },
    // Psychology
    {
        id: 12,
        title: "Clinical Psychologist",
        company: "Mental Health Center",
        location: "Portland, OR",
        type: "Full-time",
        salary: "$50,000 - $75,000",
        experience: "1-3 years",
        posted: "4 days ago",
        department: "Psychology",
        requirements: ["Counseling", "Assessment"],
        description: "Provide mental health counseling and therapy. Help clients overcome challenges and improve well-being through evidence-based practices."
    },
    {
        id: 13,
        title: "Industrial/Organizational Psychologist",
        company: "HR Solutions Group",
        location: "Remote",
        type: "Full-time",
        salary: "$65,000 - $95,000",
        experience: "2-4 years",
        posted: "1 week ago",
        department: "Psychology",
        requirements: ["Organizational Behavior", "Data Analysis", "HR Consulting"],
        description: "Apply psychology principles to workplace and organizational settings. Improve organizational effectiveness and employee satisfaction."
    },
    // Finance
    {
        id: 14,
        title: "Financial Analyst",
        company: "FinanceFirst Corp",
        location: "New York, NY",
        type: "Full-time",
        salary: "$65,000 - $90,000",
        experience: "1-3 years",
        posted: "2 days ago",
        department: "Finance",
        requirements: ["Financial Modeling", "Excel", "Analysis"],
        description: "Analyze financial data and market trends. Prepare reports and recommendations for strategic decisions."
    },
    {
        id: 15,
        title: "Investment Banker",
        company: "Capital Markets Group",
        location: "New York, NY",
        type: "Full-time",
        salary: "$85,000 - $150,000",
        experience: "2-5 years",
        posted: "Just now",
        department: "Finance",
        requirements: ["Financial Analysis", "Deal Structuring", "Client Relations"],
        description: "Help companies raise capital and provide financial advisory services. Work on high-profile transactions and M&A deals."
    }
];

// 3. Courses (Used by AI & Courses Page)
const courses = {
    "Programming": [
        {
            id: 1,
            name: "The Complete Web Developer Bootcamp",
            platform: "Udemy",
            rating: 4.7,
            skills: ["HTML", "CSS", "JS", "React"],
            url: "#"
        },
        {
            id: 2,
            name: "Advanced Node.js & Microservices",
            platform: "Coursera",
            rating: 4.8,
            skills: ["Node.js", "Docker", "Kubernetes"],
            url: "#"
        }
    ],
    "Data Science": [
        {
            id: 3,
            name: "Machine Learning A-Z",
            platform: "Udemy",
            rating: 4.6,
            skills: ["Python", "ML", "Pandas"],
            url: "#"
        }
    ],
    "Business": [
        {
            id: 4,
            name: "Product Management Fundamentals",
            platform: "LinkedIn Learning",
            rating: 4.5,
            skills: ["Strategy", "Agile"],
            url: "#"
        }
    ]
};

// 4. Salary Data (Used by AI & Salary Estimator)
const salaryData = {
    "CSE": {
        "Frontend Developer": {
            "entry": { min: 65000, max: 85000 },
            "mid": { min: 90000, max: 130000 },
            "senior": { min: 130000, max: 180000 }
        },
        "Backend Developer": {
            "entry": { min: 70000, max: 90000 },
            "mid": { min: 95000, max: 140000 },
            "senior": { min: 140000, max: 190000 }
        },
        "Data Scientist": {
            "entry": { min: 85000, max: 110000 },
            "mid": { min: 120000, max: 160000 },
            "senior": { min: 160000, max: 220000 }
        }
    }
};

// 5. Interview Questions (Used by Interview Prep)
const interviewQuestions = [
    {
        id: 1,
        category: "JavaScript",
        question: "Explain the difference between var, let, and const.",
        difficulty: "easy",
        answer: "Var is function scoped, let/const are block scoped. Const cannot be reassigned."
    },
    {
        id: 2,
        category: "React",
        question: "What is the Virtual DOM?",
        difficulty: "medium",
        answer: "A lightweight copy of the real DOM used to optimize rendering performance."
    },
    {
        id: 3,
        category: "Behavioral",
        question: "Tell me about a time you failed.",
        difficulty: "medium",
        answer: "Focus on the learning outcome and how you improved."
    }
];

// 6. CV Templates
const cvTemplates = [
    {
        id: 1,
        name: "Modern Professional",
        color: "#4A00E0"
    },
    {
        id: 2,
        name: "Creative Minimalist",
        color: "#00b894"
    },
    {
        id: 3,
        name: "Executive Suite",
        color: "#2d3436"
    }
];

// 7. Community Posts
const communityPosts = [
    {
        id: 1,
        user: "Sarah J.",
        role: "Frontend Dev",
        content: "Just landed my first job after using the AI Coach! Don't give up!",
        likes: 45
    },
    {
        id: 2,
        user: "Mike T.",
        role: "Data Scientist",
        content: "Does anyone have tips for the Google technical interview?",
        likes: 12
    }
];

// Export to Window object
window.appData = {
    departments,
    jobListings,
    courses,
    salaryData,
    interviewQuestions,
    cvTemplates,
    communityPosts
};

// Dispatch event to notify app that data is loaded
window.dispatchEvent(new Event('appDataLoaded'));
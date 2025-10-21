// Mock Data
const mockUsers = [
    { id: 1, name: 'Abhinaya', email: 'abhinaya@gmail.com', password: 'password123', role: 'participant' },
    { id: 2, name: 'Teja', email: 'tejasree@gmail.com', password: 'password123', role: 'organizer' }
];

const mockHackathons = [
    {
        id: 1,
        title: 'AI Innovation Challenge',
        description: 'Create AI solutions for real-world problems',
        startDate: '2025-03-01',
        endDate: '2025-03-03',
        status: 'upcoming',
        maxTeamSize: 4
    },
    {
        id: 2,
        title: 'Web3 Hackathon',
        description: 'Building the future of decentralized applications',
        startDate: '2025-03-15',
        endDate: '2025-03-17',
        status: 'upcoming',
        maxTeamSize: 3
    },
    {
        id: 3,
        title: 'Cyber Security and Blockchain',
        description: 'Phishing Attacks Detection and Awareness',
        startDate: '2025-03-17',
        endDate: '2025-03-20',
        status: 'upcoming',
        maxTeamSize: 3
    }
];

const mockTeams = [
    {
        id: 1,
        name: 'Tech Innovators',
        hackathonId: 1,
        members: [
            { userId: 1, role: 'leader' }
        ],
        projectSubmission: null
    }
];

// DOM Elements
const authContainer = document.getElementById('authContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const tabBtns = document.querySelectorAll('.tab-btn');
const logoutBtn = document.getElementById('logoutBtn');
const hackathonsList = document.getElementById('hackathonsList');
const teamInfo = document.getElementById('teamInfo');
const submissionsList = document.getElementById('submissionsList');

// Current User State
let currentUser = null;

// Tab Switching Logic
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => form.classList.remove('active'));
        
        const targetForm = btn.dataset.tab === 'login' ? loginForm : registerForm;
        targetForm.classList.add('active');
    });
});

// Login Form Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        showDashboard();
    } else {
        alert('Invalid credentials');
    }
});

// Register Form Handler
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.getElementById('registerRole').value;

    if (mockUsers.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }

    const newUser = {
        id: mockUsers.length + 1,
        name,
        email,
        password,
        role
    };

    mockUsers.push(newUser);

    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = "Registered successfully! Redirecting to login...";
    successMessage.classList.remove('hidden');

    setTimeout(() => {
        successMessage.classList.add('hidden');
        document.querySelector('.tab-btn[data-tab="login"]').click();
    }, 2000);
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    authContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
    loginForm.reset();
    registerForm.reset();
});

// Dashboard Functions
function showDashboard() {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
    document.getElementById('userName').textContent = currentUser.name;
    
    renderHackathons();
    renderTeamInfo();
    renderSubmissions();
}

function renderHackathons() {
    hackathonsList.innerHTML = mockHackathons.map(hackathon => `
        <div class="hackathon-card">
            <h3>${hackathon.title}</h3>
            <p>${hackathon.description}</p>
            <div class="hackathon-details">
                <p>Start: ${hackathon.startDate}</p>
                <p>End: ${hackathon.endDate}</p>
                <p>Team Size: ${hackathon.maxTeamSize}</p>
                <p>Status: ${hackathon.status}</p>
            </div>
            <button class="btn-primary" onclick="joinHackathon(${hackathon.id})">
                Join Hackathon
            </button>
        </div>
    `).join('');
}

function renderTeamInfo() {
    const userTeam = mockTeams.find(team => team.members.some(member => member.userId === currentUser.id));
    
    if (userTeam) {
        teamInfo.innerHTML = `
            <h3>${userTeam.name}</h3>
            <p>Role: ${userTeam.members.find(m => m.userId === currentUser.id).role}</p>
            <button class="btn-primary" onclick="showSubmissionForm(${userTeam.id})">
                Submit Project
            </button>
        `;
    } else {
        teamInfo.innerHTML = '<p>You are not part of any team yet.</p>';
    }
}

function joinHackathon(hackathonId) {
    const hackathon = mockHackathons.find(h => h.id === hackathonId);
    if (hackathon) {
        alert(`Joined ${hackathon.title}! Create or join a team to participate.`);
    }
}

function showSubmissionForm(teamId) {
    const title = prompt('Enter project title:');
    const description = prompt('Enter project description:');
    
    if (title && description) {
        const team = mockTeams.find(t => t.id === teamId);
        team.projectSubmission = { title, description, submissionDate: new Date().toISOString() };
        renderSubmissions();
    }
}

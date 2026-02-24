window.addEventListener("DOMContentLoaded", () => {
  // Hide all sections initially
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");

  // Show welcome section as the first screen
  document.getElementById("welcome-section").style.display = "block";
});

document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    // Hide welcome section permanently once user navigates
    document.getElementById("welcome-section").style.display = "none";
  });
});


// Utility $
function $(id){ return document.getElementById(id); }
// Sections & history
const SECTION_IDS = ['auth-section','profile-form','recommendations','skill-gap','tracker','dashboard','application-tracker','trending-courses', 'coding-interview','quiz-section'];
let historyStack = [];
// User & data
let currentUser = null; 
let applications = [];
let currentQuizInternshipId = null;
const LOCAL_USER_KEY = 'pm_user_v2';
const LOCAL_APPS_KEY = 'pm_apps_v2';
const LOCAL_RES_KEY = 'pm_res_v2';
const INTERN_DATA = [
  { id:1, title:"AI Research Intern", sector:"Technology", requiredSkills:["Python","Machine Learning","Data Visualization"], location:"Bengaluru", salary:"₹20,000" },
  { id:2, title:"Frontend Intern", sector:"Technology", requiredSkills:["JavaScript","React","CSS","HTML"], location:"Remote", salary:"₹12,000" },
  { id:3, title:"Digital Marketing Intern", sector:"Marketing", requiredSkills:["SEO","Content Creation","Analytics"], location:"Mumbai", salary:"₹10,000" },
  { id:4, title:"UI/UX Intern", sector:"Design", requiredSkills:["Figma","Creativity","Wireframing"], location:"Remote", salary:"₹11,000" },
  { id:5, title:"Backend Developer Intern", sector:"Technology", requiredSkills:["Node.js","MongoDB","API Development"], location:"Hyderabad", salary:"₹15,000" },
  { id:6, title:"Data Science Intern", sector:"Technology", requiredSkills:["Python","Statistics","Pandas","SQL"], location:"Remote", salary:"₹18,000" },
  { id:7, title:"Healthcare Analyst Intern", sector:"Healthcare", requiredSkills:["Data Analysis","Excel","Medical Terminology"], location:"Chennai", salary:"₹14,000" },
  { id:8, title:"Content Writer Intern", sector:"Marketing", requiredSkills:["Writing","SEO","Social Media"], location:"Bengaluru", salary:"₹9,000" },
  { id:9, title:"Graphic Design Intern", sector:"Design", requiredSkills:["Photoshop","Illustrator","Creativity"], location:"Remote", salary:"₹10,500" },
  { id:10, title:"Finance Intern", sector:"Finance", requiredSkills:["Excel","Accounting","Financial Analysis"], location:"Mumbai", salary:"₹12,500" },
  { id:11, title:"Machine Learning Intern", sector:"Technology", requiredSkills:["Python","TensorFlow","Data Modeling"], location:"Bengaluru", salary:"₹22,000" },
  { id:12, title:"Hospital Admin Intern", sector:"Healthcare", requiredSkills:["Management","Data Entry","Healthcare Policies"], location:"Delhi", salary:"₹13,000" }
];

const RESOURCES = [
  { id:'r_py', title:'Python Basics (Course) 📘', type:'course', skill:'Python', completed:false },
  { id:'r_react', title:'React Crash Course 🎥', type:'video', skill:'React', completed:false },
  { id:'r_seo', title:'SEO Fundamentals 🌐', type:'course', skill:'SEO', completed:false }
];

// NEW: Quizzes for specific internships
const INTERN_QUIZZES = {
    1: { // AI Research Intern
        title: "AI Research Fundamentals Quiz",
        questions: [
            { q: "Which of the following is a popular library for Machine Learning in Python?", options: ["Flask", "Scikit-learn", "Django", "NumPy"], answer: "Scikit-learn" },
            { q: "What is the primary purpose of a neural network?", options: ["To store data in a database", "To manage web servers", "To simulate the human brain for pattern recognition", "To create user interfaces"], answer: "To simulate the human brain for pattern recognition" },
            { q: "What is 'supervised learning'?", options: ["Learning from unlabeled data", "Learning with labeled data", "Learning without a teacher", "Learning from a search engine"], answer: "Learning with labeled data" }
        ]
    },
    2: { // Frontend Intern
        title: "Frontend Development Quiz",
        questions: [
            { q: "Which CSS property is used to change the background color?", options: ["color", "bgcolor", "background-color", "background"], answer: "background-color" },
            { q: "Which JavaScript framework is used to build user interfaces?", options: ["Angular", "Django", "Laravel", "React"], answer: "React" },
            { q: "How do you declare a variable in JavaScript that cannot be reassigned?", options: ["var", "let", "const", "variable"], answer: "const" }
        ]
    },
    3: { // Digital Marketing Intern
        title: "Digital Marketing Basics Quiz",
        questions: [
            { q: "What is SEO?", options: ["Search Engine Optimization", "Social Engagement Operation", "System Error Output", "Software Engineering Operation"], answer: "Search Engine Optimization" },
            { q: "Which metric indicates website traffic quality?", options: ["Bounce Rate", "Page Color", "Font Size", "Image Resolution"], answer: "Bounce Rate" },
            { q: "Organic traffic is:", options: ["Paid advertisements", "Unpaid search traffic", "Social media shares", "Email newsletters"], answer: "Unpaid search traffic" }
        ]
    },
    4: { // UI/UX Intern
        title: "UI/UX Design Quiz",
        questions: [
            { q: "What is a wireframe?", options: ["A type of computer virus", "A skeletal outline of a web page or app", "A font style", "A CSS framework"], answer: "A skeletal outline of a web page or app" },
            { q: "UX stands for:", options: ["User eXperience", "User Example", "Unique Xylophone", "Uniform Execution"], answer: "User eXperience" },
            { q: "What is the rule of thirds in design?", options: ["Dividing a layout into three parts for balance", "Using three colors only", "Three types of fonts", "Three steps in coding"], answer: "Dividing a layout into three parts for balance" }
        ]
    },
    5: { // Backend Developer Intern
        title: "Backend Development Quiz",
        questions: [
            { q: "What is a REST API?", options: ["A type of database", "A web service architectural style", "A frontend framework", "A testing tool"], answer: "A web service architectural style" },
            { q: "SQL is used for:", options: ["Styling web pages", "Database queries", "Server deployment", "Mobile app development"], answer: "Database queries" },
            { q: "Which Node.js module is used to handle HTTP requests?", options: ["http", "fs", "path", "os"], answer: "http" }
        ]
    },
    6: { // Data Science Intern
        title: "Data Science Quiz",
        questions: [
            { q: "How do you handle missing data in a dataset?", options: ["Ignore it", "Remove or impute it", "Copy random data", "Convert it to text"], answer: "Remove or impute it" },
            { q: "Which library is used for data analysis in Python?", options: ["NumPy", "Pandas", "Matplotlib", "Flask"], answer: "Pandas" },
            { q: "What is feature scaling?", options: ["Normalizing dataset features", "Encrypting data", "Converting data to images", "Splitting dataset randomly"], answer: "Normalizing dataset features" }
        ]
    },
    7: { // Healthcare Analyst Intern
        title: "Healthcare Analytics Quiz",
        questions: [
            { q: "HIPAA ensures:", options: ["Healthcare data privacy", "Hospital construction", "Medical coding", "Patient scheduling"], answer: "Healthcare data privacy" },
            { q: "Which tool is often used for healthcare data analysis?", options: ["Excel", "Photoshop", "React", "Node.js"], answer: "Excel" },
            { q: "Which metric measures hospital efficiency?", options: ["Bed occupancy rate", "Font size", "Web traffic", "Image resolution"], answer: "Bed occupancy rate" }
        ]
    },
    8: { // Marketing Analyst Intern
        title: "Marketing Analysis Quiz",
        questions: [
            { q: "What is CTR in digital marketing?", options: ["Click-Through Rate", "Customer Total Revenue", "Content Tracking Record", "Cumulative Traffic Ratio"], answer: "Click-Through Rate" },
            { q: "Which tool is used for keyword research?", options: ["Google Analytics", "Google Keyword Planner", "Photoshop", "Excel"], answer: "Google Keyword Planner" },
            { q: "A/B testing is used to:", options: ["Compare two versions of a webpage", "Measure server uptime", "Create email templates", "Design logos"], answer: "Compare two versions of a webpage" }
        ]
    },
    9: { // Cloud Engineering Intern
        title: "Cloud Engineering Quiz",
        questions: [
            { q: "Which cloud platform is provided by Microsoft?", options: ["AWS", "Azure", "Google Cloud", "Heroku"], answer: "Azure" },
            { q: "What is IaaS?", options: ["Infrastructure as a Service", "Interface as a Software", "Internet as a Service", "Integration and Service"], answer: "Infrastructure as a Service" },
            { q: "Docker is used for:", options: ["Containerization", "Database management", "Web design", "Cloud cost monitoring"], answer: "Containerization" }
        ]
    },
    10: { // Product Management Intern
        title: "Product Management Quiz",
        questions: [
            { q: "A product roadmap is:", options: ["A long-term plan for product development", "A financial statement", "A coding framework", "A marketing campaign"], answer: "A long-term plan for product development" },
            { q: "MVP in product management stands for:", options: ["Most Valuable Product", "Minimum Viable Product", "Maximum Value Plan", "Managed Variable Process"], answer: "Minimum Viable Product" },
            { q: "User stories are:", options: ["Descriptions of product features from the user perspective", "Programming scripts", "Marketing slogans", "Financial reports"], answer: "Descriptions of product features from the user perspective" }
        ]
    }
};


// Sample questions
const codingQs = [
  "Write a program to reverse a string.",
  "Find the maximum element in an array.",
  "Check if a number is prime.",
];
const aptitudeQs = [
  "If 3x + 5 = 20, what is x?",
  "A train travels 120 km in 2 hours. Find its speed.",
  "What is the probability of getting a head when tossing a coin?",
];
const hrQs = [
  "Tell me about yourself.",
  "Why should we hire you?",
  "Describe a challenge you faced and how you solved it.",
];
const MOCK_QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want this internship?",
  "Describe a technical project you built.",
  "How do you handle tight deadlines?",
  "Where do you see yourself in 5 years?",
  "Explain a situation where you failed and learned from it.",
  "How do you manage teamwork conflicts?",
  "Which technologies are you currently learning?",
  "Why should we hire you?",
  "Describe your biggest strength and weakness."
];
let currentMockQIndex = 0;
// Index trackers
let cqIndex = 0, aqIndex = 0, hqIndex = 0;


// Save/load funcs
function saveToStorage(){
  if (currentUser) localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(currentUser));
  localStorage.setItem(LOCAL_APPS_KEY, JSON.stringify(applications));
  localStorage.setItem(LOCAL_RES_KEY, JSON.stringify(RESOURCES));
}
function loadFromStorage(){
  try {
    const u = localStorage.getItem(LOCAL_USER_KEY);
    if (u) currentUser = JSON.parse(u);
    const a = localStorage.getItem(LOCAL_APPS_KEY);
    if (a) applications = JSON.parse(a);
    const r = localStorage.getItem(LOCAL_RES_KEY);
    if (r){
      const arr = JSON.parse(r);
      arr.forEach(item => {
        const found = RESOURCES.find(x => x.id === item.id);
        if (found) found.completed = !!item.completed;
      });
    }
  } catch (e){
    console.error('loadFromStorage fail', e);
  }
}
loadFromStorage();
// UI helpers
function toast(msg, time=1500){
  const t = $('toast');
  if (!t) return;
  t.innerText = msg;
  t.style.display = 'block';
  setTimeout(()=> t.style.display='none', time);
}
function validateEmail(e){ return /\S+@\S+\.\S+/.test(e); }
function showSection(id){
  const current = SECTION_IDS.find(s => $(s) && $(s).style.display === 'block');
  if (current && current !== id) historyStack.push(current);
  SECTION_IDS.forEach(s => {
    const el = $(s);
    if (el) el.style.display = (s === id ? 'block' : 'none');
  });
  const backBtn = $('backBtn');
  if (backBtn) backBtn.style.display = historyStack.length>0 ? 'block':'none';
  if (id === 'recommendations') renderRecommendations();
  if (id === 'skill-gap') renderSkillGap();
  if (id === 'tracker') renderResources();
  if (id === 'dashboard') renderDashboard();
  if (id === 'application-tracker') renderApplications();
  if (id === 'profile-form'){
    populateProfileForm();
  }
  if (id === 'trending-courses') renderTrendingCourses();
  if (id === 'coding-interview') renderCodingQuestion();
}

// -- Fixed function for View Skill Gap --
function viewSkillGap(internId){
  console.log('View Skill Gap clicked for internship ID:', internId);
  const internship = INTERN_DATA.find(i => i.id === Number(internId));
  if (!internship){
    console.warn('No internship found for ID:', internId);
    return;
  }
  showSection('skill-gap');
  renderSkillGap(internship.requiredSkills);
}

// Password toggle
function initPasswordToggles(){
  document.querySelectorAll('.toggle-password').forEach(icon=>{
    icon.addEventListener('click', ()=>{
      const target = $(icon.dataset.target);
      if (!target) return;
      if (target.type === 'password'){ target.type = 'text'; icon.textContent='🙈'; }
      else { target.type = 'password'; icon.textContent='👁'; }
    });
  });
}
// File utils
function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onload = ()=> resolve({ name: file.name, type: file.type, data: reader.result });
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}
// Event Listeners on DOMContentLoaded
window.addEventListener('DOMContentLoaded', ()=>{
  initPasswordToggles();
  const showLogin = $('show-login'), showSignup = $('show-signup');
  if (showLogin) showLogin.addEventListener('click', ()=>{ $('login-form').style.display='block'; $('signup-form').style.display='none'; });
  if (showSignup) showSignup.addEventListener('click', ()=>{ $('signup-form').style.display='block'; $('login-form').style.display='none'; });
  const goSignup = $('go-signup'), goLogin = $('go-login');
  if (goSignup) goSignup.addEventListener('click', ()=> showSignup.click());
  if (goLogin) goLogin.addEventListener('click', ()=> showLogin.click());
  const loginForm = $('login-form');
  if (loginForm) loginForm.addEventListener('submit', onLogin);
  const signupForm = $('signup-form');
  if (signupForm) signupForm.addEventListener('submit', onSignup);
  const profileForm = $('userProfileForm');
  if (profileForm) profileForm.addEventListener('submit', onSaveProfile);
  $('resume-input')?.addEventListener('change', async (e)=> {
    const f = e.target.files[0];
    if (!f) return;
    if (f.type !== 'application/pdf') { toast('Resume must be PDF'); e.target.value=''; return; }
    try {
      const b = await fileToBase64(f);
      currentUser = currentUser||{};
      currentUser.profile = currentUser.profile||{};
      currentUser.profile.resume = b;
      saveToStorage();
      toast('Resume uploaded');
    } catch(err){ console.error(err); toast('Failed to read resume'); }
  });
  $('certificates-input')?.addEventListener('change', async (e)=> {
    const files = Array.from(e.target.files||[]);
    if (files.length === 0) return;
    const certs = currentUser?.profile?.certificates ? currentUser.profile.certificates.slice() : [];
    for (let f of files){
      if (f.type !== 'application/pdf') { toast(`${f.name} skipped - must be PDF`); continue; }
      try {
        const b = await fileToBase64(f);
        certs.push(b);
      } catch(err){ console.error('cert read fail', err); }
    }
    currentUser = currentUser||{};
    currentUser.profile = currentUser.profile||{};
    currentUser.profile.certificates = certs;
    saveToStorage();
    toast('Certificates uploaded');
    e.target.value = '';
  });
  $('skip-profile')?.addEventListener('click', ()=> showSection('recommendations'));
  $('backBtn')?.addEventListener('click', ()=>{
    if (historyStack.length>0){
      const prev = historyStack.pop();
      showSection(prev);
    } else toast('No previous page');
  });
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    const t = btn.dataset.target;
    if (t) btn.addEventListener('click', ()=> showSection(t));
  });
  
  initMockInterview();
  renderApplications();
  updateOverallProgress();
  showSection('auth-section');
  if (currentUser?.email){
    const le = $('login-email');
    if(le) le.value = currentUser.email;
  }
  const darkToggle = $('darkModeToggle');
  if (darkToggle) {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      darkToggle.innerText = '☀️ Light Mode';
    }
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        darkToggle.innerText = '☀️ Light Mode';
      } else {
        localStorage.setItem('theme', 'light');
        darkToggle.innerText = '🌙 Dark Mode';
      }
    });
  }

  // NEW: Setup tabs and render initial questions on load
  setupTabs();
  renderCodingQ();
  renderAptitudeQ();
  renderHRQ();
});

// Auth functions
function onSignup(e){
  e.preventDefault();
  const n = $('signup-name').value.trim(), em = $('signup-email').value.trim(), pw = $('signup-password').value;
  const err = $('signup-error'); if(!n) return err&&(err.innerText='Name required');
  if(!validateEmail(em)) return err&&(err.innerText='Valid email required');
  if(!pw || pw.length<6) return err&&(err.innerText='Password >=6 chars');
  currentUser = {name:n,email:em,password:pw,profile:{},profileCompleted:false};
  saveToStorage();
  toast('Account created — complete your profile');
  $('login-form').style.display='none';
  $('signup-form').style.display='none';
  showSection('profile-form');
  populateProfileForm();
}

function onLogin(e){
  e.preventDefault();
  const em = $('login-email').value.trim(), pw=$('login-password').value;
  const err = $('login-error');
  if(!validateEmail(em)) return err&&(err.innerText='Enter valid email');
  if(!pw) return err&&(err.innerText='Enter password');
  const savedRaw = localStorage.getItem(LOCAL_USER_KEY);
  if(savedRaw){
    try {
      const saved = JSON.parse(savedRaw);
      if(saved.email===em && saved.password===pw){
        currentUser = saved;
        toast(`Welcome back, ${currentUser.name}`);
        if(!currentUser.profileCompleted) showSection('profile-form');
        else showSection('dashboard');
        populateProfileForm();
        return;
      }
    } catch(e){ console.error(e); }
  }
  err&&(err.innerText='Incorrect email or password (demo)');
}
// Profile functions
function populateProfileForm(){
  if(!currentUser) return;
  const p = currentUser.profile || {};
  $('profile-name').value = currentUser.name || '';
  $('profile-email').value = currentUser.email || '';
  $('profile-mobile').value = p.mobile || '';
  $('profile-education').value = p.education || '';
  $('profile-skills-comma').value = (p.skills && p.skills.join ? p.skills.join(', ') : (p.skills||''))||'';
  $('profile-goals').value = p.goals || '';
  $('preferred-location').value = p.preferredLocation || '';
  if(p.sector) $('profile-sector').value = p.sector;
}
async function onSaveProfile(e){
  e.preventDefault();
  const errEl = $('profile-error');
  errEl&&(errEl.innerText='');
  const name = $('profile-name').value.trim();
  const email = $('profile-email').value.trim();
  const mobile = $('profile-mobile').value.trim();
  const education = $('profile-education').value.trim();
  const skillsRaw = $('profile-skills-comma').value.trim();
  const skills = skillsRaw ? skillsRaw.split(',').map(s=>s.trim()).filter(Boolean) : [];
  const goals = $('profile-goals').value.trim();
  const preferredLocation = $('preferred-location').value;
  const sector = $('profile-sector') ? $('profile-sector').value:'';
  if(!name)return errEl&&(errEl.innerText='Full name required');
  if(!validateEmail(email))return errEl&&(err.innerText='Valid email required');
  if(!mobile)return errEl&&(err.innerText='Mobile number required');
  if(!preferredLocation)return errEl&&(errEl.innerText='Preferred location required');
  const existingProfile = currentUser?.profile||{};
  currentUser.name = name;
  currentUser.email = email;
  currentUser.profile = {
    mobile,
    education,
    skills,
    goals,
    preferredLocation,
    sector,
    resume: existingProfile.resume || null,
    certificates: existingProfile.certificates || []
  };
  currentUser.profileCompleted = true;
  saveToStorage();
  toast('Profile saved');
  showSection('dashboard');
  renderDashboard();
}


  // ---- Certificates Feature ----
function saveCertificates(){
  const input = $("certificates");
  const list = $("cert-list");
  list.innerHTML = "";

  if(input.files.length === 0){
    showToast("No certificates selected");
    return;
  }

  let certs = [];
  let filesProcessed = 0;

  for(let file of input.files){
    const reader = new FileReader();
    reader.onload = function(e){
      certs.push({ name: file.name, data: e.target.result });

      // Display immediately
      const li = document.createElement("li");
      li.innerHTML = `<a href="${e.target.result}" target="_blank">${file.name}</a>`;
      list.appendChild(li);

      filesProcessed++;
      if(filesProcessed === input.files.length){
        localStorage.setItem("certificates", JSON.stringify(certs));
        toast("Certificates saved!");
      }
    };
    reader.readAsDataURL(file); // Convert to Base64
  }
}

function loadCertificates(){
  const certs = JSON.parse(localStorage.getItem("certificates") || "[]");
  const list = $("cert-list");
  if(!list) return;
  list.innerHTML = "";

  certs.forEach(cert=>{
    const li = document.createElement("li");
    li.innerHTML = `<a href="${cert.data}" target="_blank">${cert.name}</a>`;
    list.appendChild(li);
  });
}

loadCertificates();

// Recommendations
function calcMatchPercent(requiredSkills,userSkills){
  if(!requiredSkills||requiredSkills.length===0) return 0;
  const us = (userSkills||[]).map(x=>x.toLowerCase());
  const matched = requiredSkills.filter(r=>us.includes(r.toLowerCase())).length;
  const bonus = RESOURCES.filter(r=>r.completed && us.includes((r.skill||'').toLowerCase())).length * 5;
  let pct = Math.round((matched/requiredSkills.length)*100) + bonus;
  return Math.min(100,pct);
}
function canApplyOrTakeQuiz(item, userSkills, quizResults) {
  const skillMatch = calcMatchPercent(item.requiredSkills, userSkills);
  const passedQuiz = quizResults && quizResults[item.id] && quizResults[item.id].passed === true;

  if (skillMatch >= 50) {
    // Eligible to apply directly
    return { apply: true, takeQuiz: false };
  } else if (skillMatch >= 50 && !passedQuiz) {
    // Qualified for quiz only if skillMatch is at least 50 but hasn't passed quiz yet
    return { apply: false, takeQuiz: true };
  } else {
    // No apply or quiz if skillMatch less than 50 and no passed quiz
    return { apply: passedQuiz, takeQuiz: false };
  }
}

// Use this in renderRecommendations
function renderRecommendations() {
  const grid = $('rec-grid');
  if (!grid) return;
  grid.innerHTML = '';

  const userSkills = currentUser?.profile?.skills || [];
  const quizResults = currentUser?.quizResults || {};

  const userSector = currentUser?.profile?.sector || '';
  let filteredInterns = userSector
    ? INTERN_DATA.filter(item => item.sector.toLowerCase() === userSector.toLowerCase())
    : INTERN_DATA.slice();

  let scoredInterns = filteredInterns.map(item => ({
    ...item,
    match: calcMatchPercent(item.requiredSkills, userSkills)
  })).sort((a,b) => b.match - a.match).slice(0,4);

  scoredInterns.forEach(item => {
    const missing = item.requiredSkills.filter(
      s => !userSkills.map(u => u.toLowerCase()).includes(s.toLowerCase())
    );
    const card = document.createElement('div');
    card.className = 'internship-card';

    card.innerHTML = `
      <h4>${item.title}</h4>
      <small class="muted">${item.sector} • ${item.location} • ${item.salary} </small>
      <p><strong>Required:</strong> ${item.requiredSkills.map(s=>`<span class="skill-badge">${s}</span>`).join(' ')}</p>
      <div class="card-details">
        <div class="badge">Match: ${item.match}%</div>
        <div class="${missing.length ? 'missing-skills' : 'all-skills-present'}">
          ${missing.length ? missing.map(s => `<span class="skill-badge">${s}</span>`).join(' ') : '✅ All skills present'}
        </div>
      </div>
      <div class="btn-container" style="margin-top:8px;"></div>
    `;

    const btnContainer = card.querySelector('.btn-container');
    const hasQuiz = INTERN_QUIZZES && INTERN_QUIZZES[item.id];
    const quizPassed = quizResults[item.id]?.passed === true;

    if (item.match >= 50) {
      if (hasQuiz && !quizPassed) {
        const quizBtn = document.createElement('button');
        quizBtn.className = 'btn primary';
        quizBtn.textContent = 'Take Quiz';
        quizBtn.addEventListener('click', () => showQuiz(item.id));
        btnContainer.appendChild(quizBtn);
      } else {
        const applyBtn = document.createElement('button');
        applyBtn.className = 'btn primary';
        applyBtn.textContent = 'Apply';
        applyBtn.addEventListener('click', () => applyToInternship(item.id));
        btnContainer.appendChild(applyBtn);
      }
    } else {
      const notEligibleBtn = document.createElement('button');
      notEligibleBtn.className = 'btn outline';
      notEligibleBtn.textContent = 'Not eligible';
      notEligibleBtn.disabled = true;
      btnContainer.appendChild(notEligibleBtn);
    }

    const viewSkillBtn = document.createElement('button');
    viewSkillBtn.className = 'btn outline';
    viewSkillBtn.textContent = 'View Skill Gap';
    viewSkillBtn.addEventListener('click', () => viewSkillGap(item.id));
    btnContainer.appendChild(viewSkillBtn);

    grid.appendChild(card);
  });
}



// Skill Gap
let lastRenderedRequired = [];
function renderSkillGap(requiredSkills = []) {
  const userSkills = currentUser?.profile?.skills || [];
  // Show user skills as badges
  document.getElementById('user-skills-list').innerHTML = userSkills.length
    ? userSkills.map(skill =>
      `<span class="skill-badge">${skill}</span>`).join('')
    : '<span style="color:#888; font-size:0.98em;">No skills yet</span>';

  // For missing skills
  const allRequired = requiredSkills.length ? requiredSkills : INTERN_DATA.flatMap(i => i.requiredSkills);
  const uniqueMissing = [...new Set(allRequired)].filter(
    req => !userSkills.map(u => u.toLowerCase()).includes(req.toLowerCase())
  );

  let missingHtml = '';
uniqueMissing.forEach(skill => {
  missingHtml += `
    <div class="missing-skill-block">
      <div class="missing-skill-header">
        <span class="skill-badge missing">${skill}</span>
      </div>
      <div style="margin-top:7px; font-size:0.95em;">
        Suggested: <a href="https://www.coursera.org/search?query=${encodeURIComponent(skill)}" target="_blank">Courses for ${skill}</a>
      </div>
      <button class="btn outline" style="margin-top:12px;" onclick="markSkillLearned('${skill.replace(/'/g,"\\'")}')">Mark as learned</button>
    </div>
  `;
});
document.getElementById('missing-skills-cards').innerHTML = missingHtml || '<span style="color:#5bb85d;">No missing skills!</span>';


renderRoadmap(uniqueMissing);   // Not uniqueMissing, but requiredSkills array
}
function renderRoadmap(requiredSkills){
  const container = document.getElementById('roadmap-list');
  if(!container) return;
  if(!requiredSkills || requiredSkills.length === 0){
    container.innerHTML = '<p class="muted"></p>';
    return;
  }
  
  let roadmapHtml = '';
  requiredSkills.forEach(skill => {
    const isLearned = currentUser?.profile?.skills?.map(s => s.toLowerCase()).includes(skill.toLowerCase());
    const checked = isLearned ? 'checked' : '';
    const buttonLabel = isLearned ? 'Already learned' : 'Mark as learned';

    const related = RESOURCES.filter(r => (r.skill || '').toLowerCase() === skill.toLowerCase());
    if (related.length > 0){
      const itemsHtml = related.map(r => {
        const completed = r.completed ? 'checked' : '';
        return `
          <div class="roadmap-item">
            <div class="roadmap-left">
              <input type="checkbox" data-resid="${r.id}" ${completed}>
              <div>
                <div><strong>${r.title}</strong></div>
                <small class="muted">${r.type} • Skill: ${r.skill}</small>
              </div>
            </div>
            <div>
              <a target="_blank" href="https://www.coursera.org/search?query=${encodeURIComponent(r.skill)}" class="link">Open Courses</a>
            </div>
          </div>
        `;
      }).join('');
      roadmapHtml += `
        <div style="margin-bottom:10px;">
          <h4>${skill}</h4>
          ${itemsHtml}
          <div style="margin-top:6px;">
            <button class="btn primary" onclick="markSkillLearned('${skill.replace(/'/g,"\\'")}')">${buttonLabel}</button>
          </div>
        </div>`;
    } else {
      roadmapHtml += `
        <div class="roadmap-item">
          <div class="roadmap-left">
            <input type="checkbox" class="manual-skill-checkbox" data-skill="${skill}" ${checked} disabled>
            <div>
              <div><strong>${skill} - Manual tracking</strong></div>
              <small class="muted">No automated resource linked</small>
            </div>
          </div>
          <div>
            <button class="btn outline" onclick="markSkillLearned('${skill.replace(/'/g,"\\'")}')">${buttonLabel}</button>
          </div>
        </div>`;
    }
  });

  container.innerHTML = roadmapHtml;

  // Add event listeners for resource checkboxes
  container.querySelectorAll('input[data-resid]').forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.resid;
      const res = RESOURCES.find(r => r.id === id);
      if (res){
        res.completed = !!cb.checked;
        if (res.completed && currentUser?.profile?.skills && !currentUser.profile.skills.map(s => s.toLowerCase()).includes(res.skill.toLowerCase())){
          currentUser.profile.skills.push(res.skill);
          toast(`${res.skill} added to skills automatically.`);
        }
        saveToStorage();
        updateOverallProgress();
        renderRecommendations();
        toast(`${res.title} ${res.completed ? 'marked complete' : 'marked incomplete'}`);
      }
    });
  });

  // Add event listeners for manual skill checkboxes
  container.querySelectorAll('.manual-skill-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const skill = cb.dataset.skill;
      if (cb.checked){
        markSkillLearned(skill);
      } else {
        if (currentUser?.profile?.skills){
          currentUser.profile.skills = currentUser.profile.skills.filter(s => s.toLowerCase() !== skill.toLowerCase());
          saveToStorage();
          renderSkillGap(lastRenderedRequired);
          renderDashboard();
          renderRecommendations();
          toast(`${skill} removed.`);
        }
      }
    });
  });
}

function markSkillLearned(skill){
  if (!skill) return;
  if(!currentUser) {
    toast('Please login and save profile first');
    return;
  }
  currentUser.profile = currentUser.profile || {};
  currentUser.profile.skills = currentUser.profile.skills || [];
  if(!currentUser.profile.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())){
    currentUser.profile.skills.push(skill);
    toast(`${skill} added to your skills`);
  } else {
    toast(`${skill} already in your skills`);
  }
  saveToStorage();
  renderSkillGap(lastRenderedRequired);
  renderDashboard();
  renderRecommendations();
  renderTrendingCourses();
  updateOverallProgress();
}


// Resources Tracker
function renderResources(){
  const container = $('resources');
  if(!container) return;
  container.innerHTML = '';
  RESOURCES.forEach(r=>{
    const label = document.createElement('label');
    label.style.display = 'block';
    label.style.marginBottom = '8px';
    label.innerHTML = `<input type="checkbox" ${r.completed ? 'checked':''}> ${r.title} — <small class="muted">${r.type} • skill: ${r.skill}</small>`;
    const cb = label.querySelector('input');
    cb.addEventListener('change', ()=>{
      r.completed = cb.checked;
      if(r.completed && currentUser?.profile?.skills && !currentUser.profile.skills.map(s => s.toLowerCase()).includes(r.skill.toLowerCase())){
        currentUser.profile.skills.push(r.skill);
        toast(`${r.skill} added to skills automatically`);
      }
      saveToStorage();
      updateOverallProgress();
      renderRecommendations();
      renderTrendingCourses();
    });
    container.appendChild(label);
  });
  updateOverallProgress();
}

function updateOverallProgress(){
  const total = RESOURCES.length; if(total === 0) return;
  const done = RESOURCES.filter(r=>r.completed).length;
  const pct = Math.round((done/total)*100);
  if ($('overallProgress')) {
    $('overallProgress').style.width = pct + '%';
    $('overallProgress').innerText = pct + '%';
  }
  if ($('readinessProgress')) {
    $('readinessProgress').style.width = pct + '%';
    $('readinessProgress').innerText = pct + '%';
    if ($('readiness-label')) {
      $('readiness-label').innerText = `Estimated readiness: ${pct}% (based on courses completed)`;
    }
  }
}

// Applications
function applyToInternship(id){
  const exists = applications.find(a => a.internshipId === id);
  if(exists){
    toast('Already applied');
    showSection('application-tracker');
    setTimeout(() => showSection('dashboard'), 1400);
    return;
  }
  const intern = INTERN_DATA.find(i => i.id === id);
  if(!intern) return;
  applications.push({
    id: applications.length + 1,
    internshipId: id,
    title: intern.title,
    date: new Date().toLocaleDateString(),
    status: 'Applied'
  });
  saveToStorage();
  toast('Application submitted!');
  renderApplications();
  showSection('application-tracker');
  setTimeout(() => showSection('dashboard'), 1600);
}

function renderApplications(){
  const list = $('application-list');
  if(!list) return;
  if(applications.length === 0) {
    list.innerHTML = '<p>No applications yet.</p>';
    return;
  }
  list.innerHTML = applications.map(a=>{
    const icon = a.status === 'Applied' ? '📩' : a.status === 'Interview' ? '🗓' : a.status === 'Accepted' ? '🎉' : '❌';
    return `<div style="padding:8px 0;"><strong>${a.title}</strong> ${icon}<br/><small>Applied: ${a.date} • Status: ${a.status}</small></div>`;
  }).join('');
}

// Dashboard
function renderDashboard(){
  const dashProfile = $('dash-profile');
  if(dashProfile){
    if(currentUser && currentUser.profile){
      const p = currentUser.profile;
      dashProfile.innerHTML = `<h3>Profile</h3>
        <div><strong>${currentUser.name || ''}</strong></div>
        <div>${currentUser.email || ''}</div>
        <div>${p.mobile || ''}</div>
        <div style="margin-top:8px;">
          <button class="btn outline" onclick="showSection('profile-form')">Edit Profile</button>
        </div>`;
    } else {
      dashProfile.innerHTML = '<em>No profile</em>';
    }
  }
function renderDashboardApplications() {
  const appTracker = document.getElementById('app-tracker');
  if (!appTracker) return;

  const currentUserId = currentUser?.id;   // or however user is identified in your app

  // Filter applications where the user id matches the logged-in user
  const userApplications = applications.filter(app => app.userId === currentUserId);

  if (userApplications.length === 0) {
    appTracker.innerHTML = '<p>No applications found.</p>';
    return;
  }

  appTracker.innerHTML = userApplications.map(app =>
    `<div class="application-item">
      <strong>${app.title}</strong> — <em>${app.status}</em>
    </div>`
  ).join('');
}

  const userSkills = currentUser?.profile?.skills || [];
  const dashRecs = $('dash-recs');
  if(dashRecs){
    // Get current sector if any
    const userSector = currentUser?.profile?.sector || '';

    // Filter INTERN_DATA by user sector or recommend all if none
    let filtered = userSector
      ? INTERN_DATA.filter(i => i.sector.toLowerCase() === userSector.toLowerCase())
      : INTERN_DATA;

    // Sort by match % descending
    filtered = filtered.map(i => {
      return {...i, match: calcMatchPercent(i.requiredSkills, userSkills)};
    }).sort((a,b) => b.match - a.match);

    // Limit to top 3 or 4, adjust as needed
    const topRecs = filtered.slice(0,4);

    if(topRecs.length === 0){
      dashRecs.innerHTML = '<em>No recommendations</em>';
    } else {
      dashRecs.innerHTML = '<h3>Recommendations</h3>' + 
        topRecs.map(i => 
          `<div style="margin:8px 0;">
            <strong>${i.title}</strong>
            <div class="muted-text">Match: ${i.match}% • ${i.location}</div>
          </div>`
        ).join('');
    }
  }

  // Applications matching top recommendations
  const appTracker = $('app-tracker');
  if(appTracker){
    const userSector = currentUser?.profile?.sector || '';
    let filteredRecs = userSector
      ? INTERN_DATA.filter(i => i.sector.toLowerCase() === userSector.toLowerCase())
      : INTERN_DATA;
    filteredRecs = filteredRecs.map(i => ({
      ...i,
      match: calcMatchPercent(i.requiredSkills, userSkills)
    })).sort((a,b) => b.match - a.match).slice(0, 4);

    // Filter applications to those in top recs
    const recIds = filteredRecs.map(r => r.id);
    const filteredApps = applications.filter(a => recIds.includes(a.internshipId));

    appTracker.innerHTML = '<h3>Your Applications</h3>' + 
      (filteredApps.length
        ? filteredApps.map(a => 
            `<div>${a.title} — ${a.status}</div>`
          ).join('')
        : '<em>No applications yet</em>');
  }

  updateOverallProgress();
}

// Trending Courses
function renderTrendingCourses() {
  const container = document.getElementById("trending-list");
  if (!container) return;
  container.innerHTML = "";

  const courses = [
    { title: "Java for Beginners", provider: "Coursera", link: "https://www.coursera.org/learn/java-programming" },
    { title: "DSA Crash Course", provider: "Udemy", link: "https://www.udemy.com/course/datastructurescncpp/" },
    { title: "Aptitude Practice", provider: "GeeksforGeeks", link: "https://practice.geeksforgeeks.org/courses/aptitude" },
    { title: "HR Interview Prep", provider: "LinkedIn Learning", link: "https://www.linkedin.com/learning/topics/hr-interview" },
    { title: "Python Basics", provider: "edX", link: "https://www.edx.org/course/python-basics-for-data-science" },
    { title: "React Crash Course", provider: "Scrimba", link: "https://scrimba.com/learn/learnreact" },
    { title: "Machine Learning Fundamentals", provider: "Coursera", link: "https://www.coursera.org/learn/machine-learning" },
    { title: "SQL for Data Science", provider: "Coursera", link: "https://www.coursera.org/learn/sql-for-data-science" }
  ];

  // Responsive flex grid container
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.justifyContent = 'flex-start';
  container.style.gap = '20px';

  courses.forEach(c => {
    const card = document.createElement("div");
    card.className = "course-card";
    card.style.flex = "1 1 260px";
    card.style.maxWidth = "275px";
    card.style.minWidth = "220px";
    card.style.background = "white";
    card.style.border = "1px solid #e3e8ee";
    card.style.borderRadius = "11px";
    card.style.padding = "20px 16px";
    card.style.margin = "0";
    card.style.boxShadow = "0 3px 14px rgba(45,55,65,.08)";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.justifyContent = "space-between";
    card.style.height = "180px";

    card.innerHTML = `
      <h3 style="margin:0 0 12px 0; font-size:1.18rem;">${c.title}</h3>
      <p style="margin:0 0 10px 0;"><strong>Provider:</strong> ${c.provider}</p>
      <a href="${c.link}" target="_blank" class="link" style="margin-top:auto;text-decoration:underline;color:#2575fc;font-weight:500;">View Course</a>
    `;
    container.appendChild(card);
  });
}

function toggleResource(id){
  const r = RESOURCES.find(x => x.id === id);
  if(!r) return;
  r.completed = !r.completed;
  if(r.completed && currentUser?.profile?.skills && !currentUser.profile.skills.map(s=>s.toLowerCase()).includes(r.skill.toLowerCase())){
    currentUser.profile.skills.push(r.skill);
    toast(`${r.skill} added automatically`);
  }
  saveToStorage();
  renderResources();
  renderTrendingCourses();
  renderRecommendations();
  updateOverallProgress();
  toast(r.completed ? `${r.title} marked complete` : `${r.title} marked incomplete`);
}

// Interview Questions
function initMockInterview() {
  const nextBtn = $('nextMockBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentMockQIndex = (currentMockQIndex + 1) % MOCK_QUESTIONS.length;
      renderMockQuestion();
    });
  }
  renderMockQuestion();
}

function renderMockQuestion() {
  const qEl = $('mock-question');
  if (qEl) {
    qEl.innerText = MOCK_QUESTIONS[currentMockQIndex];
    const answerEl = $('mock-answer');
    if (answerEl) {
      answerEl.value = '';
    }
  }
}

function renderCodingQuestion() {
  const container = document.getElementById("coding-question");
  if (!container) return;
  container.innerText = codingQs[cqIndex];
}

// Rendering
function renderCodingQ(){ document.getElementById("coding-question").innerText = codingQs[cqIndex]; }
function renderAptitudeQ(){ document.getElementById("aptitude-question").innerText = aptitudeQs[aqIndex]; }
function renderHRQ(){ document.getElementById("hr-question").innerText = hrQs[hqIndex]; }

// Navigation
function nextCQ(){ cqIndex=(cqIndex+1)%codingQs.length; renderCodingQ(); }
function prevCQ(){ cqIndex=(cqIndex-1+codingQs.length)%codingQs.length; renderCodingQ(); }
function nextAQ(){ aqIndex=(aqIndex+1)%aptitudeQs.length; renderAptitudeQ(); }
function prevAQ(){ aqIndex=(aqIndex-1+aptitudeQs.length)%aptitudeQs.length; renderAptitudeQ(); }
function nextHQ(){ hqIndex=(hqIndex+1)%hrQs.length; renderHRQ(); }
function prevHQ(){ hqIndex=(hqIndex-1+hrQs.length)%hrQs.length; renderHRQ(); }

// Tab switching logic
function setupTabs() {
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
        btn.classList.add("active");
        document.getElementById(`tab-${btn.dataset.tab}`).classList.remove("hidden");

        // Render the question for the newly active tab
        if (btn.dataset.tab === 'coding') renderCodingQ();
        if (btn.dataset.tab === 'aptitude') renderAptitudeQ();
        if (btn.dataset.tab === 'hr') renderHRQ();
        if (btn.dataset.tab === 'mock-interview') renderMockQuestion();
      });
    });
}

// NEW QUIZ FUNCTIONALITY
function showQuiz(internshipId) {
    const quiz = INTERN_QUIZZES[internshipId];
    if (!quiz) {
        toast("No quiz available for this internship.");
        return;
    }

    currentQuizInternshipId = internshipId;
    showSection('quiz-section');
    
    $('quiz-title').innerText = quiz.title;
    $('quiz-questions-container').innerHTML = '';
    $('quiz-result').style.display = 'none';
    $('quiz-apply-btn').style.display = 'none';
    $('quiz-submit-btn').style.display = 'block';

    quiz.questions.forEach((q, index) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'quiz-question';
        qDiv.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${q.q}</p>
            <div class="quiz-options">
                ${q.options.map(option => `
                    <label>
                        <input type="radio" name="q${index}" value="${option}"> ${option}
                    </label>
                `).join('')}
            </div>
        `;
        $('quiz-questions-container').appendChild(qDiv);
    });

    $('quiz-submit-btn').onclick = submitQuiz;
}

function submitQuiz() {
    const quiz = INTERN_QUIZZES[currentQuizInternshipId];
    let score = 0;
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;
    const results = $('quiz-result');
    results.innerHTML = '';
    results.style.display = 'block';

    quiz.questions.forEach((q, index) => {
        const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
        const qResultDiv = document.createElement('div');
        qResultDiv.innerHTML = `<p><strong>Q${index + 1}:</strong> ${q.q}</p>`;

        if (selectedOption && selectedOption.value === q.answer) {
            score++;
            correctAnswers++;
            qResultDiv.innerHTML += `<p style="color:green;">✅ Correct!</p>`;
        } else {
            qResultDiv.innerHTML += `<p style="color:red;">❌ Incorrect. Correct answer: ${q.answer}</p>`;
        }
        results.appendChild(qResultDiv);
    });

    const finalScore = (correctAnswers / totalQuestions) * 100;
    const resultMsg = document.createElement('h3');
    resultMsg.innerText = `Your Score: ${finalScore.toFixed(0)}%`;
    results.prepend(resultMsg);

    if (finalScore >= 80) {
        const successMsg = document.createElement('p');
        successMsg.style.color = 'green';
        successMsg.innerText = "Congratulations! You passed the quiz. You are eligible to apply.";
        results.appendChild(successMsg);
        $('quiz-apply-btn').style.display = 'block';
        $('quiz-apply-btn').onclick = () => applyToInternship(currentQuizInternshipId);
    } else {
        const failMsg = document.createElement('p');
        failMsg.style.color = 'red';
        failMsg.innerText = "You did not pass the quiz. Please review your skills and try again.";
        results.appendChild(failMsg);
    }

    $('quiz-submit-btn').style.display = 'none';
}
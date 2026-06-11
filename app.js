// --- Configuration & Constants ---
const GITHUB_USERNAME = "MoonWIRaja";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;

// --- Fallback Data (In case GitHub API rate limits or is offline) ---
const FALLBACK_REPOS = [
  {
    name: "myney.core",
    description: "Sistem pengurusan kewangan peribadi moden berasaskan web, dibina untuk prestasi maksima dan UI bersih.",
    html_url: `https://github.com/${GITHUB_USERNAME}/myney.core`,
    language: "JavaScript",
    stargazers_count: 5,
    forks_count: 2
  },
  {
    name: "MemoryOfPlanet.core",
    description: "Core pengurusan ejen AI mudah-alih dengan protokol selamat dan autosinkronisasi git bersepadu.",
    html_url: `https://github.com/${GITHUB_USERNAME}/.MemoryOfPlanet.core`,
    language: "JavaScript",
    stargazers_count: 3,
    forks_count: 1
  },
  {
    name: "astro-portfolio",
    description: "Laman portfolio berasaskan framework Astro dengan reka bentuk neobrutalism yang bersih dan responsif.",
    html_url: `https://github.com/${GITHUB_USERNAME}`,
    language: "TypeScript",
    stargazers_count: 2,
    forks_count: 0
  }
];

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initClock();
  fetchGitHubData();
  setupTerminal();
  setup3DTilt();
});

// --- Dynamic Clock ---
function initClock() {
  const timeEl = document.getElementById("local-time");
  if (!timeEl) return;
  
  const updateClock = () => {
    const options = {
      timeZone: "Asia/Kuala_Lumpur",
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const formatter = new Intl.DateTimeFormat([], options);
    timeEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${formatter.format(new Date())} MYT`;
  };
  
  updateClock();
  setInterval(updateClock, 1000);
}

// --- GitHub Integration ---
async function fetchGitHubData() {
  const reposGrid = document.getElementById("repos-grid");
  const apiStatusEl = document.getElementById("github-api-status");
  
  try {
    // Fetch User Profile
    const profileRes = await fetch(GITHUB_API_URL);
    if (!profileRes.ok) throw new Error("GitHub profile fetch failed");
    const profileData = await profileRes.ok ? await profileRes.json() : null;
    
    // Fetch Repositories
    const reposRes = await fetch(`${GITHUB_API_URL}/repos?sort=updated&per_page=6`);
    if (!reposRes.ok) throw new Error("GitHub repos fetch failed");
    const repos = await reposRes.json();
    
    // Update Profile UI
    if (profileData) {
      document.getElementById("user-name").textContent = profileData.name || GITHUB_USERNAME;
      if (profileData.avatar_url) {
        document.getElementById("user-avatar").src = profileData.avatar_url;
      }
      
      // Update Stats
      document.getElementById("stat-repos").textContent = profileData.public_repos || 0;
      document.getElementById("stat-followers").textContent = profileData.followers || 0;
    }
    
    // Calculate total stars & forks
    let totalStars = 0;
    let totalForks = 0;
    repos.forEach(repo => {
      totalStars += repo.stargazers_count || 0;
      totalForks += repo.forks_count || 0;
    });
    document.getElementById("stat-stars").textContent = totalStars;
    document.getElementById("stat-forks").textContent = totalForks;
    
    // Render Repos Grid
    renderRepos(repos);
    
    // API Status OK
    apiStatusEl.innerHTML = `<i class="fa-brands fa-github"></i> API: <span class="api-ok text-green">ONLINE</span>`;
    
  } catch (error) {
    console.warn("Using fallback repo data due to API error/rate-limit:", error);
    
    // API Status Offline/Rate-Limited
    if (apiStatusEl) {
      apiStatusEl.innerHTML = `<i class="fa-brands fa-github"></i> API: <span class="api-err text-yellow">RATE_LIMIT</span>`;
    }
    
    // Fallback UI Stats
    document.getElementById("stat-repos").textContent = FALLBACK_REPOS.length;
    document.getElementById("stat-stars").textContent = 10;
    document.getElementById("stat-forks").textContent = 3;
    document.getElementById("stat-followers").textContent = 5;
    
    renderRepos(FALLBACK_REPOS);
  }
}

function renderRepos(repos) {
  const reposGrid = document.getElementById("repos-grid");
  if (!reposGrid) return;
  
  reposGrid.innerHTML = "";
  
  if (repos.length === 0) {
    reposGrid.innerHTML = `<p class="text-mono text-center">Tiada repositori awam ditemui.</p>`;
    return;
  }
  
  repos.forEach(repo => {
    // Avoid forks for main showcase if possible
    if (repo.fork) return;
    
    const lang = repo.language || "Web";
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    
    const card = document.createElement("a");
    card.href = repo.html_url;
    card.target = "_blank";
    card.className = "repo-card-3d";
    
    card.innerHTML = `
      <div class="repo-card-inner">
        <h3 class="repo-name text-accent">${repo.name}</h3>
        <p class="repo-desc">${repo.description || "Tiada penerangan disediakan untuk projek ini."}</p>
        <div class="repo-footer">
          <div class="repo-lang">
            <span class="lang-dot"></span>
            <span>${lang}</span>
          </div>
          <div class="repo-stats">
            <span><i class="fa-regular fa-star"></i> ${stars}</span>
            <span><i class="fa-solid fa-code-fork"></i> ${forks}</span>
          </div>
        </div>
      </div>
    `;
    
    reposGrid.appendChild(card);
  });
  
  // Re-run 3D effect listener for dynamic elements
  setup3DTilt();
}

// --- Terminal Simulator ---
const terminalOutputs = {
  help: `
  <span>Perintah yang disokong:</span><br>
  - <span class="text-accent">about</span>    : Maklumat ringkas mengenai saya<br>
  - <span class="text-accent">repos</span>    : Senarai projek/repositori utama<br>
  - <span class="text-accent">skills</span>   : Kemahiran teknologi & stack pilihan<br>
  - <span class="text-accent">contact</span>  : Cara untuk menghubungi saya<br>
  - <span class="text-accent">clear</span>    : Bersihkan skrin terminal
  `,
  about: `
  <span>Halo! Saya <span class="text-accent">MoonWiRaja</span>.</span><br>
  Seorang Full-Stack Creator dari Malaysia. Saya suka membina aplikasi web moden,
  alat automasi pintar, dan reka bentuk visual premium dengan fokus kepada UX yang kemas.
  `,
  repos: `
  <span>Utama Repositori:</span><br>
  - <span class="text-green">MoonWiRaja</span>        : Repositori utama portfolio ini.<br>
  - <span class="text-green">myney.core</span>        : Sistem pengurusan kewangan peribadi.<br>
  - <span class="text-green">MemoryOfPlanet</span>    : AI Core pengurusan agentik.
  `,
  skills: `
  <span>Kemahiran & Teknologi Stack:</span><br>
  - <span class="text-blue">Frontend:</span> HTML5, CSS3, JavaScript (ES6+), React, Astro<br>
  - <span class="text-blue">Backend:</span> Node.js, Express, Python<br>
  - <span class="text-blue">Database:</span> PostgreSQL, SQLite, MongoDB<br>
  - <span class="text-blue">Kakas:</span> Git, GitHub Actions, Docker, Linux CLI
  `,
  contact: `
  <span>Hubungi Saya:</span><br>
  - Email: <a href="mailto:hakimmikah191@gmail.com" class="text-accent">hakimmikah191@gmail.com</a><br>
  - GitHub: <a href="https://github.com/MoonWIRaja" target="_blank" class="text-accent">github.com/MoonWIRaja</a>
  `
};

function setupTerminal() {
  const consoleInput = document.getElementById("console-input");
  const consoleBody = document.getElementById("console-body");
  
  if (!consoleInput || !consoleBody) return;
  
  // Focus on click
  consoleBody.addEventListener("click", () => {
    consoleInput.focus();
  });
  
  consoleInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const value = consoleInput.value.trim().toLowerCase();
      consoleInput.value = "";
      
      handleCommand(value);
    }
  });
}

function handleCommand(cmd) {
  const consoleBody = document.getElementById("console-body");
  const consoleOutput = consoleBody.querySelector(".console-output");
  
  if (!cmd) return;
  
  // Create output line
  const cmdRow = document.createElement("div");
  cmdRow.className = "text-mono";
  cmdRow.innerHTML = `<span class="console-prompt font-bold">moon@wiraja:~$</span> <span>${cmd}</span>`;
  consoleOutput.appendChild(cmdRow);
  
  const responseRow = document.createElement("div");
  responseRow.className = "text-mono mt-1 mb-3";
  
  if (cmd === "clear") {
    consoleOutput.innerHTML = "";
    consoleBody.scrollTop = 0;
    return;
  } else if (terminalOutputs[cmd]) {
    responseRow.innerHTML = terminalOutputs[cmd];
  } else {
    responseRow.innerHTML = `<span class="text-red">Ralat: Perintah "${cmd}" tidak ditemui. Taip "help" untuk bantuan.</span>`;
  }
  
  consoleOutput.appendChild(responseRow);
  
  // Auto scroll
  consoleBody.scrollTop = consoleBody.scrollHeight;
}

function executeQuickCommand(cmd) {
  const consoleInput = document.getElementById("console-input");
  if (consoleInput) {
    consoleInput.value = cmd;
    handleCommand(cmd);
    consoleInput.value = "";
    consoleInput.focus();
  }
}

// --- 3D Hover/Tilt Effect ---
function setup3DTilt() {
  const cards = document.querySelectorAll(".profile-card-3d, .repo-card-3d");
  
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xc = rect.width / 2;
      const yc = rect.height / 2;
      
      // Calculate rotation degree (max 10 degrees)
      const rotateY = ((x - xc) / xc) * 10;
      const rotateX = -((y - yc) / yc) * 10;
      
      card.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
    });
    
    card.addEventListener("mouseleave", () => {
      card.style.transform = `rotateY(0deg) rotateX(0deg)`;
      card.style.transition = "transform 0.5s ease";
    });
    
    card.addEventListener("mouseenter", () => {
      card.style.transition = "none";
    });
  });
}

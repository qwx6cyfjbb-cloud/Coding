// =========================================
// WINDOWS 12 SETUP SIMULATION
// =========================================

// Global state
let step = 0;
let setupState = {};
let openApps = new Set();
let currentTab = 'system';
let installationComplete = false;

// DOM elements
let title, desc, content, bar, status, stepNumber, backBtn;

// =========================================
// BOOT MANAGER
// =========================================

const bootPhases = [
  "Powering on...",
  "Loading system files...",
  "Starting Windows 12..."
];

const allCountries = [
  "United States", "United Kingdom", "Canada", "Australia", "India", "Germany", "France", "Spain", "Italy", "Mexico", "Brazil", "Japan", "South Korea", "China", "Netherlands", "Sweden", "Norway", "Denmark", "Finland", "Russia", "South Africa", "Egypt", "Turkey", "Saudi Arabia", "Argentina", "Chile", "Colombia", "New Zealand", "Ireland", "Switzerland", "Austria", "Belgium", "Poland", "Portugal", "Greece", "Israel", "United Arab Emirates", "Singapore", "Malaysia", "Thailand", "Vietnam", "Indonesia"
];

const allLanguages = [
  "English", "Spanish", "French", "German", "Chinese", "Japanese", "Korean", "Hindi", "Arabic", "Portuguese", "Russian", "Italian", "Dutch", "Swedish", "Turkish", "Vietnamese", "Polish", "Indonesian", "Thai", "Bengali", "Greek", "Hebrew", "Malay", "Czech", "Danish", "Finnish", "Norwegian", "Romanian", "Ukrainian", "Hungarian"
];

const allTimezones = [
  "Pacific Time (US & Canada)", "Mountain Time (US & Canada)", "Central Time (US & Canada)", "Eastern Time (US & Canada)", "Greenwich Mean Time", "Central European Time", "Eastern European Time", "China Standard Time", "Japan Standard Time", "India Standard Time", "Australia Eastern Time", "Mexico City", "Buenos Aires", "Sao Paulo", "Moscow", "Dubai", "Singapore", "Hong Kong", "Seoul", "New Zealand"
];

function boot(next) {
  show("boot");
  // Boot animation takes 2.4s, then transition to install
  setTimeout(() => {
    slideScreen("boot", "install", next);
  }, 2600);
}

// =========================================
// SCREEN MANAGER
// =========================================

function slideScreen(from, to, cb, direction = 'right') {
  let a = document.getElementById(from);
  let b = document.getElementById(to);

  b.style.display = "flex";
  b.style.transform = direction === 'right' ? "translateX(100%)" : "translateX(-100%)";

  // Add blur effect during transition
  if (from === 'desktop' || to === 'desktop') {
    document.getElementById('wallpaper').classList.add('blur');
  }

  setTimeout(() => {
    a.style.transition = "0.5s";
    b.style.transition = "0.5s";
    a.style.transform = direction === 'right' ? "translateX(-100%)" : "translateX(100%)";
    b.style.transform = "translateX(0)";
  }, 10);

  setTimeout(() => {
    a.style.display = "none";
    a.style.transform = "";
    b.style.transform = "";
    document.getElementById('wallpaper').classList.remove('blur');
    if (cb) cb();
  }, 500);
}

function show(id) {
  document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "flex";
}

function showRestartScreen() {
  show("restart");
  const restartScreen = document.getElementById('restart');
  restartScreen.classList.add('fade-in');

  setTimeout(() => {
    restartScreen.classList.remove('fade-in');
    show("install");
    step++;
    render();
  }, 2600);
}

// =========================================
// SETUP LOGIC
// =========================================

const steps = [
  {
    title: "Welcome to Windows 12 Setup",
    desc: "This setup will guide you through installing Windows 12 on your computer. You will be able to choose your preferred configuration such as storage location, edition, and system preferences. Make sure your device remains powered on during the process.",
    type: "button",
    canSkip: false
  },
  {
    title: "Select Drive",
    desc: "Choose the storage drive where Windows 12 will be installed. All existing data on the selected drive may be modified or removed during installation. It is recommended to select a fast storage device such as an SSD for optimal performance.",
    type: "list",
    options: ["Windows HD", "SSD", "External", "Backup"],
    canSkip: false
  },
  {
    title: "Select Edition",
    desc: "Select the edition of Windows 12 you would like to install. Each edition offers different features and capabilities. Professional and Enterprise editions provide advanced tools for power users and organizations.",
    type: "list",
    options: ["Home", "Pro", "Enterprise", "Developer"],
    canSkip: false
  },
  {
    title: "System Configuration",
    desc: "Configure your system settings. You can skip this step to use default settings.",
    type: "config",
    canSkip: true
  },
  {
    title: "Privacy Level",
    desc: "Choose how much diagnostic and personalization data is shared with Windows.",
    type: "list",
    options: ["Basic", "Enhanced", "Personalized"],
    canSkip: true
  },
  {
    title: "Country",
    desc: "Select your country or region to configure system settings such as time, currency, and regional formats automatically.",
    type: "list",
    options: allCountries,
    canSkip: false
  },
  {
    title: "Language",
    desc: "Choose your preferred language for the Windows interface. This will be used across menus, apps, and system dialogs.",
    type: "list",
    options: allLanguages,
    canSkip: false
  },
  {
    title: "Time Zone",
    desc: "Choose the local time zone for your system clock.",
    type: "list",
    options: allTimezones,
    canSkip: false
  },
  {
    title: "Choose Theme",
    desc: "Select a look and feel for your desktop and apps.",
    type: "list",
    options: ["Light", "Dark", "System"],
    canSkip: true
  },
  { type: "restart" },
  {
    title: "Product Key",
    desc: "Enter your Windows product key to activate your copy of Windows 12. The key must follow the format XXXX-XXXX-XXXX-XXXX and ensures that your installation is genuine and properly licensed.",
    type: "product",
    canSkip: true
  },
  {
    title: "Sign In",
    desc: "Enter your Microsoft account email to continue. This allows you to sync your settings, files, and preferences across devices securely.",
    type: "email",
    canSkip: false
  },
  { type: "microsoft" },
  { type: "installing" }
];

window.addEventListener("DOMContentLoaded", () => {
  // Initialize DOM elements
  title = document.getElementById("title");
  desc = document.getElementById("desc");
  content = document.getElementById("content");
  bar = document.getElementById("bar");
  status = document.getElementById("status");
  stepNumber = document.getElementById("stepNumber");
  backBtn = document.getElementById("backBtn");

  // Check if installation is already complete
  const savedInstallationState = localStorage.getItem('windowsSetupComplete');
  if (savedInstallationState === 'true') {
    installationComplete = true;
    show("login");
    initDesktop();
  } else {
    // Initialize desktop for first-time setup
    initDesktop();
    // Start boot sequence
    boot(() => {
      show("install");
      render();
    });
  }
});

function render() {
  let s = steps[step];

  if (s.type === "restart") {
    showRestartScreen();
    return;
  }
  if (s.type === "microsoft") {
    microsoft();
    return;
  }
  if (s.type === "installing") {
    installing();
    return;
  }

  // Update step indicator
  stepNumber.textContent = `Step ${step + 1}/${steps.length}`;

  // Show/hide back button
  backBtn.style.display = step > 0 ? "block" : "none";

  animateBox(() => {
    title.innerText = s.title;
    desc.innerText = s.desc;
    content.innerHTML = "";

    if (s.type === "button") {
      content.innerHTML = `<button onclick="next()">Next</button>`;
      if (s.canSkip) {
        content.innerHTML += `<button onclick="skip()" style="background: rgba(255,255,255,0.02);">Skip</button>`;
      }
    }

      if (s.type === "list") {
      const maxPreview = 4;
      const options = s.options || [];
      const listWrapper = document.createElement('div');
      listWrapper.id = 'optionList';
      content.appendChild(listWrapper);

      const showAllButton = document.createElement('button');
      showAllButton.className = 'show-all-button';
      showAllButton.innerText = options.length > maxPreview ? 'Show all options' : 'Show options';
      showAllButton.onclick = () => renderAllOptions(s);

      options.slice(0, maxPreview).forEach((o, i) => {
        let b = document.createElement("button");
        b.innerText = o;
        b.onclick = () => selectOption(i, o);
        listWrapper.appendChild(b);
      });

      if (options.length > maxPreview) {
        content.appendChild(showAllButton);
        let overflow = document.createElement('div');
        overflow.id = 'optionOverflow';
        overflow.className = 'option-overflow hidden';
        content.appendChild(overflow);
      }

      if (s.canSkip) {
        let skipBtn = document.createElement("button");
        skipBtn.innerText = "Skip";
        skipBtn.style.background = "rgba(255,255,255,0.02)";
        skipBtn.onclick = skip;
        content.appendChild(skipBtn);
      }
    }

    if (s.type === "config") {
      content.innerHTML = `
        <div style="text-align: left; margin-bottom: 20px;">
          <label><input type="checkbox" id="updates"> Enable automatic updates</label><br>
          <label><input type="checkbox" id="telemetry" checked> Send diagnostic data</label><br>
          <label><input type="checkbox" id="cortana"> Enable Cortana assistant</label>
        </div>
        <button onclick="saveConfig()">Continue</button>
        <button onclick="skip()" style="background: rgba(255,255,255,0.02);">Skip</button>
      `;
    }

    if (s.type === "product") {
      content.innerHTML = `
        <input id="key" placeholder="XXXX-XXXX-XXXX-XXXX">
        <button onclick="validateKey()">Activate</button>
        <button onclick="skip()" style="background: rgba(255,255,255,0.02);">Skip</button>
        <p id="error"></p>
      `;
    }

    if (s.type === "email") {
      content.innerHTML = `
        <input id="email" type="email" placeholder="your@email.com">
        <button onclick="validateEmail()">Continue</button>
        <p id="error"></p>
      `;
    }

    bar.style.width = ((step + 1) / steps.length) * 100 + "%";
  });
}

function animateBox(cb) {
  let box = document.getElementById("box");
  box.classList.add("slide-out");

  setTimeout(() => {
    cb();
    box.classList.remove("slide-out");
    box.classList.add("slide-in");

    setTimeout(() => box.classList.remove("slide-in"), 300);
  }, 250);
}

function next() {
  step++;
  render();
}

function goBack() {
  if (step > 0) {
    step--;
    slideScreen('install', 'install', () => render(), 'left');
  }
}

function skip() {
  step++;
  render();
}

function selectOption(index, value) {
  setupState[steps[step].title.toLowerCase().replace(/\s+/g, '')] = value;
  next();
}

function getDefaultOption(stepConfig) {
  if (!stepConfig || !stepConfig.title) return stepConfig.options?.[0];
  if (stepConfig.title.includes('Country')) return 'United States';
  if (stepConfig.title.includes('Language')) return 'English';
  if (stepConfig.title.includes('Time Zone')) return 'Pacific Time (US & Canada)';
  if (stepConfig.title.includes('Theme')) return 'System';
  return stepConfig.options?.[0];
}

function renderAllOptions(stepConfig) {
  let overflow = document.getElementById('optionOverflow');
  if (!overflow) return;

  overflow.classList.toggle('hidden');
  if (!overflow.classList.contains('hidden') && !overflow.dataset.rendered) {
    overflow.innerHTML = '';
    const defaultOption = getDefaultOption(stepConfig);

    stepConfig.options.forEach((o, i) => {
      let item = document.createElement('div');
      item.className = 'option-item';
      if (o === defaultOption) {
        item.classList.add('default-selected');
      }
      item.innerText = o;
      item.onclick = () => selectOption(i, o);
      overflow.appendChild(item);
    });

    overflow.dataset.rendered = 'true';
  }
}

function saveConfig() {
  setupState.updates = document.getElementById('updates').checked;
  setupState.telemetry = document.getElementById('telemetry').checked;
  setupState.cortana = document.getElementById('cortana').checked;
  next();
}

// Validation functions
function validateKey() {
  let key = document.getElementById('key').value;
  let r = /^[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/;
  if (r.test(key)) {
    setupState.productKey = key;
    next();
  } else {
    error("Invalid key format");
  }
}

function validateEmail() {
  let email = document.getElementById('email').value;
  let r = /^[a-zA-Z]{3,}@(gmail\.com|ms\.com|vgos\.com)$/;
  if (r.test(email)) {
    setupState.email = email;
    next();
  } else {
    error("Invalid email");
  }
}


function error(msg) {
  const errorElem = document.getElementById("error");
  if (errorElem) {
    errorElem.innerText = msg;
  } else {
    console.warn("Error container not found:", msg);
  }
}

// Special screens
function microsoft() {
  // Ensure we have the content element
  if (!content) {
    content = document.getElementById("content");
  }

  content.innerHTML = `
    <div style="text-align: center;">
      <div class="spinner" style="margin: 20px auto;"></div>
      <div style="font-size: 18px; margin-bottom: 10px; color: white;">Connecting to Microsoft</div>
      <div style="font-size: 14px; opacity: 0.8; color: white;">Verifying your account</div>
    </div>
  `;

  // Update title and desc
  if (title) title.innerText = "Connecting to Microsoft";
  if (desc) desc.innerText = "Please wait while we connect to Microsoft's servers to verify your account information.";

  setTimeout(next, 2000);
}

function installing() {
  // Ensure we have the content element
  if (!content) {
    content = document.getElementById("content");
  }

  // Clear the box content and show installation progress
  content.innerHTML = `
    <div style="text-align: center;">
      <div class="spinner" style="margin: 20px auto;"></div>
      <div id="install-status" style="font-size: 18px; margin-bottom: 10px; color: white;">Preparing installation...</div>
      <div id="install-detail" style="font-size: 14px; opacity: 0.8; color: white;">This may take a few minutes</div>
    </div>
  `;

  // Also update title and desc for consistency
  if (title) title.innerText = "Installing Windows 12";
  if (desc) desc.innerText = "Please wait while Windows 12 is being installed on your computer.";

  let tasks = [
    "Copying system files...",
    "Installing core components...",
    "Configuring settings...",
    "Installing drivers...",
    "Applying updates...",
    "Finalizing installation..."
  ];

  let progress = 0;

  function updateProgress() {
    if (progress >= 100) {
      show("desktop");
      initDesktop();
      // Mark installation as complete and load saved settings
      installationComplete = true;
      localStorage.setItem('windowsSetupComplete', 'true');
      loadSettings();
      return;
    }

    let currentTask = tasks[Math.floor(progress / (100 / tasks.length))];
    let installStatus = document.getElementById('install-status');
    let installDetail = document.getElementById('install-detail');

    if (installStatus) installStatus.innerText = currentTask || "Completing installation...";
    if (installDetail) installDetail.innerText = `Progress: ${Math.round(progress)}%`;

    // Update the global status as well
    if (status) status.innerText = currentTask || "Completing installation...";

    // Smooth progress animation
    let targetProgress = Math.min(progress + Math.random() * 15 + 5, 100);
    let increment = (targetProgress - progress) / 20;

    function animate() {
      progress += increment;
      if (bar) bar.style.width = progress + "%";

      if (progress < targetProgress) {
        requestAnimationFrame(animate);
      } else {
        progress = targetProgress;
        setTimeout(updateProgress, Math.random() * 1000 + 500);
      }
    }

    animate();
  }

  updateProgress();
}

// =========================================
// DESKTOP LOGIC
// =========================================

function initDesktop() {
  // Start clock
  updateClock();
  setInterval(updateClock, 1000);

  // Right-click context menu
  document.addEventListener('contextmenu', showContextMenu);

  // Hide context menu on click elsewhere
  document.addEventListener('click', hideContextMenu);
}

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById('clock').textContent = time;
}

function toggleStartMenu() {
  let menu = document.getElementById("startMenu");
  let wallpaper = document.getElementById("wallpaper");

  if (menu.style.display === "flex") {
    menu.style.display = "none";
    wallpaper.classList.remove('blur');
  } else {
    menu.style.display = "flex";
    wallpaper.classList.add('blur');
  }
}

function openApp(appName) {
  let appWindow = document.getElementById(appName + '-app');
  if (appWindow) {
    appWindow.style.display = 'flex';
    openApps.add(appName);
    updateTaskbar();
    
    // Close start menu when opening app
    let menu = document.getElementById("startMenu");
    if (menu.style.display === "flex") {
      menu.style.display = "none";
      let wallpaper = document.getElementById("wallpaper");
      wallpaper.classList.remove('blur');
    }
    
    // Initialize settings UI when opening settings app
    if (appName === 'settings') {
      initializeSettingsUI();
    }

    // Initialize explorer state when opening File Explorer
    if (appName === 'explorer') {
      updateExplorerPath();
      updateExplorerControls();
    }
  }
}

function closeApp(appName) {
  let appWindow = document.getElementById(appName + '-app');
  if (appWindow) {
    appWindow.style.display = 'none';
    openApps.delete(appName);
    updateTaskbar();
  }
}

function updateTaskbar() {
  let taskbarApps = document.getElementById('taskbar-apps');
  taskbarApps.innerHTML = '';

  openApps.forEach(app => {
    let taskbarApp = document.createElement('div');
    taskbarApp.className = 'taskbar-app';
    taskbarApp.onclick = () => toggleApp(app);
    taskbarApp.innerHTML = `<img src="${app}.png" style="width: 20px; height: 20px;">`;
    taskbarApps.appendChild(taskbarApp);
  });
}

function toggleApp(appName) {
  let appWindow = document.getElementById(appName + '-app');
  if (appWindow.style.display === 'flex') {
    appWindow.style.display = 'none';
  } else {
    appWindow.style.display = 'flex';
  }
}

function showContextMenu(e) {
  e.preventDefault();
  let menu = document.getElementById('contextMenu');
  menu.style.display = 'block';
  menu.style.left = e.pageX + 'px';
  menu.style.top = e.pageY + 'px';
}

function hideContextMenu() {
  document.getElementById('contextMenu').style.display = 'none';
}

function shutdown() {
  // Simple shutdown animation
  document.body.style.transition = 'opacity 1s';
  document.body.style.opacity = '0';
  setTimeout(() => {
    show('black');
    document.body.style.opacity = '1';
  }, 1000);
}

function restartWindows() {
  show('restart');
  const restartScreen = document.getElementById('restart');
  restartScreen.classList.add('fade-in');

  setTimeout(() => {
    // Clear installation and show login
    localStorage.removeItem('windowsSetupComplete');
    window.location.reload();
  }, 2600);
}

function loginUser() {
  slideScreen('login', 'desktop', () => {
    loadSettings();
  });
}

// =========================================
// CALCULATOR LOGIC
// =========================================

let calcExpression = '';
let calcDisplay = document.getElementById('calc-display');

function calcInput(value) {
  calcExpression += value;
  updateCalcDisplay();
}

function calcClear() {
  calcExpression = '';
  updateCalcDisplay();
}

function calcEquals() {
  try {
    let result = eval(calcExpression);
    calcExpression = result.toString();
    updateCalcDisplay();
  } catch (e) {
    calcExpression = 'Error';
    updateCalcDisplay();
    setTimeout(() => {
      calcExpression = '';
      updateCalcDisplay();
    }, 1500);
  }
}

function updateCalcDisplay() {
  if (calcDisplay) {
    calcDisplay.textContent = calcExpression || '0';
  }
}

// =========================================
// FILE EXPLORER LOGIC
// =========================================

let explorerHistory = ['This PC > Documents'];
let explorerIndex = 0;

function explorerBack() {
  if (explorerIndex > 0) {
    explorerIndex--;
    updateExplorerPath();
    updateExplorerControls();
  }
}

function explorerForward() {
  if (explorerIndex < explorerHistory.length - 1) {
    explorerIndex++;
    updateExplorerPath();
    updateExplorerControls();
  }
}

function openFolder(folderName) {
  const newPath = explorerHistory[explorerIndex] + ' > ' + folderName;
  explorerHistory = explorerHistory.slice(0, explorerIndex + 1);
  explorerHistory.push(newPath);
  explorerIndex = explorerHistory.length - 1;
  updateExplorerPath();
  updateExplorerControls();
}

function openFile(fileName) {
  // For now, just show an alert
  alert(`Opening file: ${fileName}`);
}

function updateExplorerPath() {
  const pathElement = document.getElementById('current-path');
  if (pathElement) {
    pathElement.textContent = explorerHistory[explorerIndex];
  }
}

function updateExplorerControls() {
  const backButton = document.querySelector('.explorer-toolbar button:nth-of-type(1)');
  const forwardButton = document.querySelector('.explorer-toolbar button:nth-of-type(2)');
  if (backButton) {
    backButton.disabled = explorerIndex <= 0;
  }
  if (forwardButton) {
    forwardButton.disabled = explorerIndex >= explorerHistory.length - 1;
  }
}

// =========================================
// SETTINGS LOGIC
// =========================================

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(tabName + '-tab').classList.add('active');

  currentTab = tabName;
}

// =========================================
// PERSONALIZATION SETTINGS
// =========================================

let settings = {
  darkMode: false,
  wallpaper: 'gradient-purple',
  accentColor: '#b84cff',
  taskbarPosition: 'bottom'
};

function loadSettings() {
  const saved = localStorage.getItem('windowsSettings');
  if (saved) {
    settings = JSON.parse(saved);
    applyAllSettings();
  }
}

function saveSettings() {
  localStorage.setItem('windowsSettings', JSON.stringify(settings));
}

function applyAllSettings() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.checked = settings.darkMode;
  }
  applyDarkMode();
  applyWallpaper();
  applyAccentColor();
  applyTaskbarPosition();
}

function toggleDarkMode() {
  settings.darkMode = !settings.darkMode;
  applyDarkMode();
  saveSettings();
  // Ensure checkbox state is updated
  const checkbox = document.getElementById('darkModeToggle');
  if (checkbox) {
    checkbox.checked = settings.darkMode;
  }
}

function applyDarkMode() {
  const body = document.body;
  if (settings.darkMode) {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}

function setWallpaper(wallpaperType) {
  settings.wallpaper = wallpaperType;
  applyWallpaper();
  saveSettings();
  
  // Update UI to show active wallpaper
  document.querySelectorAll('.wallpaper-option').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

function applyWallpaper() {
  const wallpaper = document.getElementById('wallpaper');
  const gradients = {
    'gradient-purple': 'linear-gradient(135deg, #b84cff 0%, #3b82f6 50%, #0a0f2c 100%)',
    'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #0a0f2c 100%)',
    'gradient-dark': 'linear-gradient(135deg, #0a0f2c 0%, #001a66 100%)',
    'gradient-sunset': 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
    'gradient-ocean': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    'gradient-forest': 'linear-gradient(135deg, #0f3460 0%, #16213e 100%)'
  };
  
  if (wallpaper) {
    wallpaper.style.background = gradients[settings.wallpaper] || gradients['gradient-purple'];
  }
}

function setAccentColor(color) {
  settings.accentColor = color;
  applyAccentColor();
  saveSettings();
  
  // Update UI to show active color
  document.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));
  event.currentTarget.classList.add('active');
}

function applyAccentColor() {
  const root = document.documentElement;
  root.style.setProperty('--accent-color', settings.accentColor);
  
  // Update tab styling with accent color
  const styles = document.querySelector('style') || document.createElement('style');
  if (!styles.parentNode) {
    document.head.appendChild(styles);
  }
  
  if (!document.getElementById('accent-style')) {
    const accentStyle = document.createElement('style');
    accentStyle.id = 'accent-style';
    accentStyle.textContent = `
      .tab.active {
        background: ${settings.accentColor} !important;
        border-color: ${settings.accentColor} !important;
      }
      button:hover {
        background: ${settings.accentColor} !important;
        border-color: ${settings.accentColor} !important;
      }
      .color-option.active {
        border-color: white;
      }
    `;
    document.head.appendChild(accentStyle);
  } else {
    document.getElementById('accent-style').textContent = `
      .tab.active {
        background: ${settings.accentColor} !important;
        border-color: ${settings.accentColor} !important;
      }
      button:hover {
        background: ${settings.accentColor} !important;
        border-color: ${settings.accentColor} !important;
      }
      .color-option.active {
        border-color: white;
      }
    `;
  }
}

function setTaskbarPosition(position) {
  settings.taskbarPosition = position;
  applyTaskbarPosition();
  saveSettings();
}

function applyTaskbarPosition() {
  const taskbar = document.getElementById('taskbar');
  if (!taskbar) return;
  
  // Reset styles
  taskbar.style.bottom = '';
  taskbar.style.top = '';
  taskbar.style.left = '';
  taskbar.style.right = '';
  taskbar.style.width = '';
  taskbar.style.height = '';
  taskbar.style.flexDirection = '';
  
  if (settings.taskbarPosition === 'top') {
    taskbar.style.top = '18px';
    taskbar.style.left = '50%';
    taskbar.style.transform = 'translateX(-50%)';
  } else if (settings.taskbarPosition === 'left') {
    taskbar.style.left = '18px';
    taskbar.style.top = '50%';
    taskbar.style.transform = 'translateY(-50%)';
    taskbar.style.flexDirection = 'column';
    taskbar.style.height = 'auto';
    taskbar.style.minWidth = '70px';
  } else { // bottom (default)
    taskbar.style.bottom = '18px';
    taskbar.style.left = '50%';
    taskbar.style.transform = 'translateX(-50%)';
  }
}

function resetSettings() {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    settings = {
      darkMode: false,
      wallpaper: 'gradient-purple',
      accentColor: '#b84cff',
      taskbarPosition: 'bottom'
    };
    applyAllSettings();
    saveSettings();
    alert('Settings have been reset to default.');
  }
}

function initializeSettingsUI() {
  // Update dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.checked = settings.darkMode;
  }
  
  // Update wallpaper selection
  document.querySelectorAll('.wallpaper-option').forEach(option => {
    option.classList.remove('active');
  });
  const wallpaperMap = {
    'gradient-purple': 0,
    'gradient-blue': 1,
    'gradient-dark': 2,
    'gradient-sunset': 3,
    'gradient-ocean': 4,
    'gradient-forest': 5
  };
  const activeWallpaper = document.querySelectorAll('.wallpaper-option')[wallpaperMap[settings.wallpaper]];
  if (activeWallpaper) {
    activeWallpaper.classList.add('active');
  }
  
  // Update color selection
  document.querySelectorAll('.color-option').forEach(option => {
    option.classList.remove('active');
    if (option.style.backgroundColor === settings.accentColor || 
        rgb2hex(option.style.backgroundColor) === settings.accentColor) {
      option.classList.add('active');
    }
  });
  
  // Update taskbar position
  document.querySelectorAll('input[name="taskbar"]').forEach(radio => {
    radio.checked = (radio.value === settings.taskbarPosition);
  });
}

// Helper function to convert RGB to HEX
function rgb2hex(rgb) {
  if (!rgb || rgb === '') return '';
  const result = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (!result) return rgb;
  const hex = (x) => ('0' + parseInt(x).toString(16)).slice(-2);
  return '#' + hex(result[1]) + hex(result[2]) + hex(result[3]);
}

// =========================================
// SOUND HOOKS (placeholders)
// =========================================

// These would be called when certain actions happen
function playSound(soundName) {
  // Placeholder for sound effects
  console.log(`Playing sound: ${soundName}`);
}

// Hook into various actions
const originalNext = next;
next = function() {
  playSound('click');
  originalNext();
};
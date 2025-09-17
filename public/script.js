// Handle login
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  if (!res.ok) {
    document.getElementById("error").innerText = "Invalid login";
    return;
  }

  const data = await res.json();
  localStorage.setItem("role", data.role);
  window.location.href = "dashboard.html";
}

// Handle dashboard
window.onload = function () {
  if (window.location.pathname.includes("dashboard")) {
    const role = localStorage.getItem("role");
    document.getElementById("roleTitle").innerText = "Welcome, " + role.toUpperCase();

    let menuHTML = `<button onclick="showOutbreaks()">Dashboard</button>`;
    if (role === "asha") {
      menuHTML += `<button onclick="waterInput()">Water Input</button>`;
    } else if (role === "govt") {
      menuHTML += `<button onclick="showAlerts()">Notifications</button>`;
    } else if (role === "user") {
      menuHTML += `<button onclick="checkHealth()">Check Health</button>`;
    }
    menuHTML += `<button onclick="showAwareness()">Know More</button>`;
    document.getElementById("menu").innerHTML = menuHTML;
  }
};

// Outbreaks
async function showOutbreaks() {
  const res = await fetch("/outbreaks");
  const outbreaks = await res.json();
  document.getElementById("content").innerHTML =
    "<h3>Previous Outbreaks</h3>" + outbreaks.map(o => `<p>${o.area} - ${o.status} (${o.date})</p>`).join("");
}

// Water Input (ASHA)
function waterInput() {
  document.getElementById("content").innerHTML = `
    <h3>Check Water Quality</h3>
    <input id="ph" placeholder="pH">
    <input id="hardness" placeholder="Hardness">
    <input id="solids" placeholder="Solids">
    <button onclick="predictWater()">Check</button>
    <div id="result"></div>`;
}

async function predictWater() {
  const ph = parseFloat(document.getElementById("ph").value);
  const hardness = parseFloat(document.getElementById("hardness").value);
  const solids = parseFloat(document.getElementById("solids").value);

  const res = await fetch("/water-quality", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ph, hardness, solids })
  });
  const data = await res.json();
  document.getElementById("result").innerText = "Prediction: " + data.result;
}

// Govt Notifications
async function showAlerts() {
  const res = await fetch("/alerts");
  const alerts = await res.json();
  document.getElementById("content").innerHTML =
    "<h3>Alerts</h3>" + alerts.map(a => `<p>${a.msg}</p>`).join("");
}

// User Health Check
function checkHealth() {
  document.getElementById("content").innerHTML = `
    <h3>Check Your Health</h3>
    <input id="symptoms" placeholder="Enter symptoms, e.g. fever, diarrhea">
    <button onclick="analyzeHealth()">Check</button>
    <div id="healthResult"></div>`;
}

async function analyzeHealth() {
  const symptoms = document.getElementById("symptoms").value.split(",");
  const res = await fetch("/check-health", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symptoms })
  });
  const data = await res.json();
  document.getElementById("healthResult").innerText = data.result;
}

// Awareness
function showAwareness() {
  document.getElementById("content").innerHTML = `
    <h3>Awareness</h3>
    <p>Always boil water before drinking. Wash hands frequently. Report any unusual symptoms.</p>
    <iframe width="300" height="200" src="https://www.youtube.com/embed/1bQ4w4t9VUg" allowfullscreen></iframe>`;
}

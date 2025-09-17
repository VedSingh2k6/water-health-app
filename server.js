const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const users = require("./users.json");
const dataPath = "./data.json";

function loadData() {
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// ✅ Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json({ role: user.role });
});

// ✅ Get outbreaks
app.get("/outbreaks", (req, res) => {
  const data = loadData();
  res.json(data.outbreaks);
});

// ✅ Get alerts
app.get("/alerts", (req, res) => {
  const data = loadData();
  res.json(data.alerts);
});

// ✅ Add outbreak (ASHA use case)
app.post("/add-outbreak", (req, res) => {
  const data = loadData();
  const newOutbreak = { id: Date.now(), ...req.body };
  data.outbreaks.push(newOutbreak);
  saveData(data);
  res.json({ success: true, outbreak: newOutbreak });
});

// ✅ Water Quality Prediction (via Python ML API)
app.post("/water-quality", async (req, res) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/predict_water", req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "ML API error" });
  }
});

// ✅ Health Check (user symptoms → AI model can be integrated later)
app.post("/check-health", (req, res) => {
  const { symptoms } = req.body;
  if (symptoms.includes("fever") && symptoms.includes("diarrhea")) {
    return res.json({ result: "⚠️ Possible waterborne infection. Seek medical help!" });
  }
  res.json({ result: "✅ No serious symptoms detected" });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

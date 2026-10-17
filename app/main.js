const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const path = require("path");

let mainWindow;

function startServices() {
  const base = path.resolve(__dirname, "..");

  console.log("🚀 Starting backend...");
  exec(`cd ${base} && source venv/bin/activate && uvicorn backend.api.server:app --reload`);

  console.log("🎤 Starting assistant...");
  exec(`cd ${base} && source venv/bin/activate && python -m backend.voice.listen`);

  console.log("🖥️ Starting dashboard...");
  exec(`cd ${base}/dashboard && npm start`);

  console.log("🧠 Starting ollama...");
  exec(`ollama serve`);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false
    }
  });

  // wait a bit so React starts
  setTimeout(() => {
    mainWindow.loadURL("http://localhost:3000");
  }, 5000);
}

app.whenReady().then(() => {
  startServices();
  createWindow();
});

app.on("window-all-closed", () => {
  app.quit();
});
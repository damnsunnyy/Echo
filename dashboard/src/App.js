import React, { useEffect, useState, useRef } from "react";

function App() {
  const [logs, setLogs] = useState([]);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [status, setStatus] = useState("Idle");
  const [listening, setListening] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onmessage = (e) => {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = `[${timestamp}] ${e.data}`;
      setLogs(prev => [...prev, logEntry]);
      logRef.current?.scrollIntoView({ behavior: "smooth" });

      if (e.data.includes("Listening")) {
        setStatus("🔴 Listening...");
        setListening(true);
      } else if (e.data.includes("Heard")) {
        setStatus("🧠 Processing...");
        setListening(true);
      } else {
        setStatus("⏳ Idle");
        setListening(false);
      }
    };

    const clock = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      ws.close();
      clearInterval(clock);
    };
  }, []);

  return (
    <div style={{
      background: "#000",
      color: "#00ffff",
      height: "100vh",
      fontFamily: "Orbitron",
      padding: "20px"
    }}>

      <h1 style={{ textAlign: "center" }}>⚡ YOUR AI CORE</h1>
      <h2 style={{ textAlign: "center" }}>{time}</h2>
      <h3 style={{ textAlign: "center", margin: "10px 0" }}>Status: {status}</h3>

      {/* 🔥 Animated Core */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        margin: "40px"
      }}>
        <div style={{
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          border: "3px solid cyan",
          boxShadow: listening
            ? "0 0 80px cyan"
            : "0 0 20px cyan",
          animation: listening ? "pulse 0.8s infinite" : "none"
        }} />
      </div>

      <button 
        onClick={() => setLogs([])}
        style={{
          padding: "10px 20px",
          background: "rgba(0,255,255,0.2)",
          border: "1px solid cyan",
          color: "cyan",
          cursor: "pointer",
          marginBottom: "10px"
        }}
      >
        Clear Logs
      </button>
      {/* Logs */}
      <div 
        ref={logRef}
        style={{
          height: "250px",
          overflowY: "auto",
          border: "1px solid cyan",
          padding: "10px",
          background: "rgba(0,0,0,0.3)"
        }}
      >
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: "5px", whiteSpace: "pre-wrap" }}>{log}</div>
        ))}
        <div ref={logRef} />
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default App;
import React, { useEffect, useRef, useState } from "react";

const SOCKET_URL = "ws://127.0.0.1:8000/ws";

function classifyMessage(message) {
  const value = message.toLowerCase();
  if (value.includes("error") || value.includes("failed")) return "error";
  if (value.includes("heard") || value.includes("processing")) return "thinking";
  if (value.includes("listening")) return "listening";
  return "ready";
}

function App() {
  const [events, setEvents] = useState([]);
  const [connection, setConnection] = useState("connecting");
  const [assistantState, setAssistantState] = useState("ready");
  const [clock, setClock] = useState(() => new Date());
  const logEndRef = useRef(null);

  useEffect(() => {
    let socket;
    let retryTimer;
    let retryDelay = 1000;
    let stopped = false;

    const connect = () => {
      if (stopped) return;
      setConnection("connecting");
      socket = new WebSocket(SOCKET_URL);
      socket.onopen = () => {
        retryDelay = 1000;
        setConnection("connected");
      };
      socket.onmessage = ({ data }) => {
        const message = String(data);
        const nextState = classifyMessage(message);
        setAssistantState(nextState);
        setEvents((current) => [
          ...current,
          { id: `${Date.now()}-${current.length}`, time: new Date(), message, state: nextState },
        ].slice(-100));
      };
      socket.onerror = () => socket.close();
      socket.onclose = () => {
        if (stopped) return;
        setConnection("disconnected");
        setAssistantState("ready");
        retryTimer = window.setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, 15000);
      };
    };

    connect();
    const clockTimer = window.setInterval(() => setClock(new Date()), 1000);
    return () => {
      stopped = true;
      window.clearTimeout(retryTimer);
      window.clearInterval(clockTimer);
      socket?.close();
    };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [events]);

  const stateLabel = {
    ready: "Standby",
    listening: "Listening",
    thinking: "Processing",
    error: "Needs attention",
  }[assistantState];

  return (
    <main className="console-shell">
      <header className="topbar">
        <a className="wordmark" href="#top" aria-label="Echo console home">
          <span className="wordmark-icon" aria-hidden="true">e</span>
          <span>ECHO <small>LOCAL ASSISTANT</small></span>
        </a>
        <div className="topbar-right">
          <time className="clock" dateTime={clock.toISOString()}>{clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time>
          <span className={`connection-pill ${connection}`}><i />{connection === "connected" ? "SERVICE CONNECTED" : connection === "connecting" ? "CONNECTING" : "SERVICE OFFLINE"}</span>
        </div>
      </header>

      <section className="welcome" id="top">
        <div>
          <p className="eyebrow"><span /> PRIVATE BY DESIGN · RUNNING ON YOUR DEVICE</p>
          <h1>Your voice,<br /><em>your workspace.</em></h1>
          <p className="welcome-copy">A quiet control room for local speech recognition, Ollama responses, and assistant activity.</p>
        </div>
        <span className="build-id">ECHO / CONTROL ROOM<br />BUILD 0.1 · DESKTOP</span>
      </section>

      <section className="overview-grid" aria-label="Assistant status">
        <article className={`assistant-card state-${assistantState}`}>
          <div className="card-head"><span>ASSISTANT STATUS</span><span>01 / LIVE</span></div>
          <div className="assistant-display">
            <div className="voice-orb" aria-hidden="true"><i /><i /><i /><b /></div>
            <div className="assistant-copy">
              <span className="state-kicker">{assistantState === "listening" ? "MICROPHONE ACTIVE" : assistantState === "thinking" ? "WORKING ON IT" : assistantState === "error" ? "CHECK THE EVENT LOG" : "READY WHEN YOU ARE"}</span>
              <h2>{stateLabel}</h2>
              <p>{assistantState === "listening" ? "Echo is waiting for your voice." : assistantState === "thinking" ? "Your request is being processed locally." : assistantState === "error" ? "The latest assistant event needs attention." : "Start the local listener to begin a session."}</p>
            </div>
          </div>
          <div className="card-foot"><span>WHISPER <b>TRANSCRIPTION</b></span><span>OLLAMA <b>LOCAL MODEL</b></span><span>FASTAPI <b>EVENT STREAM</b></span></div>
        </article>

        <aside className="signal-card">
          <div className="card-head"><span>SESSION SIGNAL</span><span>02 / STATUS</span></div>
          <div className="signal-row"><span>WebSocket service</span><b className={connection}>{connection === "connected" ? "Connected" : connection === "connecting" ? "Connecting" : "Offline"}</b></div>
          <div className="signal-row"><span>Assistant state</span><b>{stateLabel}</b></div>
          <div className="signal-row"><span>Events this session</span><b>{String(events.length).padStart(2, "0")}</b></div>
          <p className="privacy-note"><span>◎</span> Speech and model processing run locally. This dashboard only displays events from your Echo service.</p>
        </aside>
      </section>

      <section className="event-panel" aria-labelledby="event-title">
        <div className="event-heading">
          <div><p className="eyebrow">03 / SESSION FEED</p><h2 id="event-title">Recent activity <span>{events.length}</span></h2></div>
          <button className="clear-button" type="button" onClick={() => setEvents([])} disabled={!events.length}>Clear events <span aria-hidden="true">↗</span></button>
        </div>
        <div className="event-list" role="log" aria-live="polite" aria-relevant="additions text">
          {events.length ? events.map((event) => (
            <article className={`event-row event-${event.state}`} key={event.id}>
              <time>{event.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</time>
              <span className="event-mark" aria-hidden="true" />
              <p>{event.message}</p>
              <span className="event-tag">{event.state}</span>
            </article>
          )) : <div className="empty-events"><span className="empty-mark">⌁</span><p>No events yet</p><small>Start Echo’s listener to see session activity here.</small></div>}
          <div ref={logEndRef} />
        </div>
        <footer className="panel-foot"><span>EVENTS STORED IN THIS SESSION ONLY</span><span>LOCALHOST · 127.0.0.1:8000</span></footer>
      </section>
    </main>
  );
}

export default App;

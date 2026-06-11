"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const COMMANDS = {
  help: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">┌──────────────────────────────────────────┐</span>' },
    { type: "response", html: '<span class="text-accent">│</span>  <span class="text-green">about</span>       <span class="text-muted">│</span>  Tentang saya              <span class="text-accent">│</span>' },
    { type: "response", html: '<span class="text-accent">│</span>  <span class="text-green">skills</span>      <span class="text-muted">│</span>  Tech stack & kemahiran    <span class="text-accent">│</span>' },
    { type: "response", html: '<span class="text-accent">│</span>  <span class="text-green">repos</span>       <span class="text-muted">│</span>  Senarai projek utama      <span class="text-accent">│</span>' },
    { type: "response", html: '<span class="text-accent">│</span>  <span class="text-green">neofetch</span>    <span class="text-muted">│</span>  Sistem info & logo ASCII  <span class="text-accent">│</span>' },
    { type: "response", html: '<span class="text-accent">│</span>  <span class="text-green">contact</span>     <span class="text-muted">│</span>  Cara menghubungi saya     <span class="text-accent">│</span>' },
    { type: "response", html: '<span class="text-accent">│</span>  <span class="text-green">clear</span>       <span class="text-muted">│</span>  Bersihkan terminal        <span class="text-accent">│</span>' },
    { type: "response", html: '<span class="text-accent">└──────────────────────────────────────────┘</span>' },
    { type: "response", text: "" },
  ],
  about: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">◆</span> <span style="font-weight:600">MoonWiRaja</span> — Full-Stack Creator' },
    { type: "response", html: '  <span class="text-muted">Location:</span>  Malaysia 🇲🇾' },
    { type: "response", html: '  <span class="text-muted">Focus:</span>    Web moden, automasi pintar, reka bentuk premium' },
    { type: "response", html: '  <span class="text-muted">Passion:</span>  Pengalaman pengguna yang kemas & responsif' },
    { type: "response", text: "" },
  ],
  skills: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">◆</span> <span style="font-weight:600">Kemahiran Teknologi</span>' },
    { type: "response", text: "" },
    { type: "response", html: '  <span class="text-cyan">▸ Frontend</span>   HTML5 · CSS3 · JS · React · Next.js · Astro' },
    { type: "response", html: '  <span class="text-green">▸ Backend</span>    Node.js · Express · Python · REST APIs' },
    { type: "response", html: '  <span class="text-yellow">▸ Database</span>   PostgreSQL · SQLite · MongoDB' },
    { type: "response", html: '  <span class="text-violet">▸ DevOps</span>     Git · GitHub Actions · Docker · Linux' },
    { type: "response", html: '  <span class="text-rose">▸ Design</span>     Figma · Framer Motion · UI/UX' },
    { type: "response", text: "" },
  ],
  repos: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">◆</span> <span style="font-weight:600">Repositori Utama</span>' },
    { type: "response", text: "" },
    { type: "response", html: '  <span class="text-green">●</span> <span style="font-weight:500">MoonWiRaja</span>           Console portfolio dashboard' },
    { type: "response", html: '  <span class="text-green">●</span> <span style="font-weight:500">MemoryOfPlanet.core</span>  AI agent management core' },
    { type: "response", html: '  <span class="text-green">●</span> <span style="font-weight:500">myney.core</span>           Personal finance system' },
    { type: "response", text: "" },
  ],
  contact: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">◆</span> <span style="font-weight:600">Hubungi Saya</span>' },
    { type: "response", text: "" },
    { type: "response", html: '  <span class="text-accent">✉</span>  Email    <span class="text-secondary">hakimmikah191@gmail.com</span>' },
    { type: "response", html: '  <span class="text-accent">⟐</span>  GitHub   <span class="text-secondary">github.com/MoonWIRaja</span>' },
    { type: "response", text: "" },
  ],
  neofetch: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">   __  __  ___   ___  _  _ </span>  <span class="text-secondary" style="font-weight:600">OS:</span> MemoryOfPlanet SoloCore v1.0' },
    { type: "response", html: '<span class="text-accent">  |  \\/  |/ _ \\ / _ \\| \\| |</span>  <span class="text-secondary" style="font-weight:600">Host:</span> MoonWiRaja.dev Server' },
    { type: "response", html: '<span class="text-accent">  | |\\/| | (_) | (_) | .  |</span>  <span class="text-secondary" style="font-weight:600">Kernel:</span> Next.js 16.2.9 / React 19' },
    { type: "response", html: '<span class="text-accent">  |_|  |_|\\___/ \\___/|_|\\_|</span>  <span class="text-secondary" style="font-weight:600">Shell:</span> zsh / web-cli v3.0' },
    { type: "response", html: '<span class="text-accent">   _ _ _ _ ___   _  _  _  </span>  <span class="text-secondary" style="font-weight:600">Uptime:</span> 99.9% stable' },
    { type: "response", html: '<span class="text-accent">  | | | | | _ \\ / _ \\| | </span>  <span class="text-secondary" style="font-weight:600">Theme:</span> Cherry Dark (Burhan Accent)' },
    { type: "response", html: '<span class="text-accent">  | | | | |   /| (_) | | </span>  <span class="text-secondary" style="font-weight:600">CPU:</span> Simulated Google Brain AI v4' },
    { type: "response", html: '<span class="text-accent">   \\___/|_|_|_\\ \\___/|_| </span>  <span class="text-secondary" style="font-weight:600">Memory:</span> 4.12 GB / 8.00 GB' },
    { type: "response", text: "" },
  ]
};

export default function Console() {
  const [lines, setLines] = useState([
    { type: "welcome", html: '<span class="text-accent">◆</span> Selamat datang ke <span class="text-accent" style="font-weight:600">MoonWiRaja Console</span> <span class="text-muted">v3.0</span>' },
    { type: "hint", text: '  Taip "help" atau "neofetch" untuk melihat sistem info.' },
    { type: "response", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [utcTime, setUtcTime] = useState("00:00");

  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // UTC clock tick
  useEffect(() => {
    const tick = () => {
      const f = new Intl.DateTimeFormat("en-GB", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setUtcTime(f.format(new Date()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommandDirectly = (cmd) => {
    if (cmd === "clear") {
      setLines([]);
      return;
    }
    const handler = COMMANDS[cmd];
    if (handler) {
      setLines((prev) => [...prev, { type: "cmd", text: cmd }, ...handler()]);
    } else {
      setLines((prev) => [
        ...prev,
        { type: "cmd", text: cmd },
        {
          type: "response",
          html: `<span class="text-accent">✗</span> <span class="text-muted">Perintah "${cmd}" tidak ditemui. Taip "help" untuk bantuan.</span>`,
        },
      ]);
    }
  };

  const simulateTypingAndExecute = (cmd) => {
    if (isTyping) return;
    setIsTyping(true);
    setInput("");
    
    let currentText = "";
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < cmd.length) {
        currentText += cmd.charAt(i);
        setInput(currentText);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setInput("");
          executeCommandDirectly(cmd);
          setIsTyping(false);
        }, 150);
      }
    }, 40);
  };

  useEffect(() => {
    window.__consoleExec = simulateTypingAndExecute;
    return () => {
      delete window.__consoleExec;
    };
  }, [isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isTyping) return;
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    setInput("");
    executeCommandDirectly(cmd);
  };

  return (
    <motion.div
      className="console-card crt-effect"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Title bar */}
      <div className="console-titlebar">
        <div className="console-title-text">
          <span className="ping-dot" style={{ display: "inline-block", position: "relative" }} />
          <span>LIVE CONSOLE</span>
        </div>
        <span className="mono" style={{ fontSize: "0.6rem", color: "var(--text-light-secondary)" }}>
          UTC Time: {utcTime}
        </span>
      </div>

      {/* Console Body */}
      <div className="console-body console-scroll" onClick={() => inputRef.current?.focus()}>
        <div className="console-output" ref={outputRef}>
          {lines.map((line, i) => (
            <div key={i} className={`console-line ${line.type}`}>
              {line.type === "cmd" ? (
                <>
                  <span className="prompt-symbol">❯</span>
                  <span className="cmd-text">{line.text}</span>
                </>
              ) : line.html ? (
                <span dangerouslySetInnerHTML={{ __html: line.html }} />
              ) : (
                <span>{line.text}</span>
              )}
            </div>
          ))}
        </div>

        <form className="console-input-row" onSubmit={handleSubmit}>
          <span className="prompt-symbol">❯</span>
          <input
            ref={inputRef}
            type="text"
            className="console-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isTyping ? "" : "Type a command..."}
            disabled={isTyping}
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" disabled={isTyping} style={{ opacity: isTyping ? 0.3 : 1 }}>
            <Send size={11} className="text-green" />
          </button>
        </form>
      </div>
    </motion.div>
  );
}

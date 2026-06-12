"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { SnakeGame, RocketGame } from "./TerminalGames";

const COMMANDS = {
  help: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent" style="font-weight: 600;">⌨️ MoonWiRaja Console v3.0 - INTERACTIVE HELP MENU</span>' },
    { type: "response", html: '<span class="text-muted">============================================================</span>' },
    { type: "response", html: '<span class="text-yellow" style="font-weight: 600;">🌟 CORE COMMANDS (TUGASAN UTAMA)</span>' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'about\')">about</span>       <span class="text-muted">·</span> Get to know me & my design vision (Tentang saya)' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'skills\')">skills</span>      <span class="text-muted">·</span> Visual tech stack & core expertise (Kemahiran)' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'experience\')">experience</span>  <span class="text-muted">·</span> Professional timeline & projects (Pengalaman kerjaya)' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'repos\')">repos</span>       <span class="text-muted">·</span> Main open-source repositories from GitHub API' },
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-cyan" style="font-weight: 600;">🎮 FUN & INTERACTIVE (SIMULASI & GAME)</span>' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'status\')">status</span>      <span class="text-muted">·</span> Check live server & memory metrics (Status sistem)' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'neofetch\')">neofetch</span>    <span class="text-muted">·</span> System info & custom ASCII Art' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'matrix\')">matrix</span>      <span class="text-muted">·</span> Run digital binary rain simulation (Simulasi Matrix)' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'secret\')">secret</span>      <span class="text-muted">·</span> Decrypt classified core system message (Mesej sulit)' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'game\')">game</span>        <span class="text-muted">·</span> Launch retro terminal games (Snake & Space Shooter)' },
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-rose" style="font-weight: 600;">🛠️ UTILITIES & LINKS (PENGHUBUNG)</span>' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'contact\')">contact</span>     <span class="text-muted">·</span> Social profiles & email link (Hubungi saya)' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'clear\')">clear</span>       <span class="text-muted">·</span> Clear the terminal logs (Bersihkan skrin)' },
    { type: "response", html: '<span class="text-muted">============================================================</span>' },
    { type: "response", html: '<span class="text-muted" style="font-size:0.85rem">Tip: You can directly click any green command above to run it.</span>' },
    { type: "response", text: "" },
  ],
  game: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent" style="font-weight: 600;">🎮 RETRO GAME CENTER - PLAY IN TERMINAL</span>' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", html: '  Type or click command below to start playing (Pilih game):' },
    { type: "response", text: "" },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'game snake\')">game snake</span>   <span class="text-muted">·</span> Play Classic Snake Game 🐍 (Game Ular)' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'game rocket\')">game rocket</span>  <span class="text-muted">·</span> Play Space Shooter 🚀 (Game Roket Angkasa)' },
    { type: "response", text: "" },
    { type: "response", html: '  Control using keyboard W/A/S/D or Arrow Keys.' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", text: "" },
  ],
  about: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">◆</span> <span style="font-weight:600">MoonWiRaja</span> — Full-Stack Web Creator' },
    { type: "response", html: '  <span class="text-muted">Location:</span>   Malaysia 🇲🇾' },
    { type: "response", html: '  <span class="text-muted">Focus:</span>      Modern web tech, smart automation, & premium design' },
    { type: "response", html: '  <span class="text-muted">Vision:</span>     Build fast, reactive & aesthetically outstanding UI/UX' },
    { type: "response", text: "" },
  ],
  skills: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent" style="font-weight:600">📊 TECH STACKS & EXPERTISE</span>' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", html: '  <span class="text-cyan" style="font-weight:500">Frontend</span>  <span class="text-green">■■■■■■■■■□</span> <span class="text-secondary">90%</span>' },
    { type: "response", html: '            <span class="text-muted">HTML5 · CSS3 · React · Next.js · Astro</span>' },
    { type: "response", html: '  <span class="text-green" style="font-weight:500">Backend</span>   <span class="text-green">■■■■■■■■□□</span> <span class="text-secondary">80%</span>' },
    { type: "response", html: '            <span class="text-muted">Node.js · Express · Python · REST APIs</span>' },
    { type: "response", html: '  <span class="text-yellow" style="font-weight:500">Database</span>  <span class="text-green">■■■■■■■□□□</span> <span class="text-secondary">70%</span>' },
    { type: "response", html: '            <span class="text-muted">PostgreSQL · SQLite · MongoDB</span>' },
    { type: "response", html: '  <span class="text-violet" style="font-weight:500">DevOps</span>    <span class="text-green">■■■■■■■■□□</span> <span class="text-secondary">80%</span>' },
    { type: "response", html: '            <span class="text-muted">Git · GitHub Actions · Docker · Linux</span>' },
    { type: "response", html: '  <span class="text-rose" style="font-weight:500">Design</span>    <span class="text-green">■■■■■■■■□□</span> <span class="text-secondary">80%</span>' },
    { type: "response", html: '            <span class="text-muted">Figma · Framer Motion · UI/UX Design</span>' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", text: "" },
  ],
  experience: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent" style="font-weight:600">💼 CAREER TIMELINE (PENGALAMAN)</span>' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", html: '  <span class="text-cyan" style="font-weight:500">2024 - Present</span>  <span class="text-secondary" style="font-weight:500">Lead Web Creator @ MoonWiRaja Digital</span>' },
    { type: "response", html: '                  <span class="text-muted">Build advanced portfolio systems & smart AI integrations.</span>' },
    { type: "response", html: '  <span class="text-green" style="font-weight:500">2022 - 2024</span>     <span class="text-secondary" style="font-weight:500">Full-Stack Developer (Freelance)</span>' },
    { type: "response", html: '                  <span class="text-muted">Develop e-commerce systems, company profiles & API automation.</span>' },
    { type: "response", html: '  <span class="text-yellow" style="font-weight:500">2021 - 2022</span>     <span class="text-secondary" style="font-weight:500">Frontend UI Specialist</span>' },
    { type: "response", html: '                  <span class="text-muted">Focus on clean, responsive designs using React & Tailwind CSS.</span>' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", text: "" },
  ],
  status: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent" style="font-weight:600">🖥️ LIVE SERVER MONITOR SYSTEM</span>' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", html: '  <span class="text-secondary">CPU Load:</span>  [<span class="text-green">■■■■■□□□□□</span>] <span class="text-green">52%</span> (Google Brain Core)' },
    { type: "response", html: '  <span class="text-secondary">RAM Usage:</span> [<span class="text-green">■■■■■■■□□□</span>] <span class="text-yellow">71%</span> (5.68 GB / 8.00 GB)' },
    { type: "response", html: '  <span class="text-secondary">Disk:</span>      [<span class="text-green">■■■□□□□□□□</span>] <span class="text-green">34%</span> (124 GB / 360 GB)' },
    { type: "response", html: '  <span class="text-secondary">Database:</span>  [<span class="text-green">ONLINE</span>] 12ms latency' },
    { type: "response", html: '  <span class="text-secondary">AI Swarm:</span>  [<span class="text-accent">ACTIVE</span>] Agent swarm fully functional' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", text: "" },
  ],
  repos: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">◆</span> <span style="font-weight:600">MAIN REPOSITORIES (PROJEK UTAMA)</span>' },
    { type: "response", text: "" },
    { type: "response", html: '  <span class="text-green">●</span> <span style="font-weight:500">MoonWiRaja</span>           Console portfolio dashboard app' },
    { type: "response", html: '  <span class="text-green">●</span> <span style="font-weight:500">MemoryOfPlanet.core</span>  AI agent management core runtime' },
    { type: "response", html: '  <span class="text-green">●</span> <span style="font-weight:500">myney.core</span>           Personal finance accounting system' },
    { type: "response", text: "" },
  ],
  contact: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">◆</span> <span style="font-weight:600">CONTACT & SOCIALS (HUBUNGI SAYA)</span>' },
    { type: "response", text: "" },
    { type: "response", html: '  <span class="text-accent">✉</span>  Email    <span class="text-secondary" style="text-decoration: underline; cursor: pointer;" onclick="window.location.href=\'mailto:hakimmikah191@gmail.com\'">hakimmikah191@gmail.com</span>' },
    { type: "response", html: '  <span class="text-accent">⟐</span>  GitHub   <span class="text-secondary" style="text-decoration: underline; cursor: pointer;" onclick="window.open(\'https://github.com/MoonWIRaja\', \'_blank\')">github.com/MoonWIRaja</span>' },
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
    { type: "response", html: '                            <span class="text-accent">■</span><span class="text-green">■</span><span class="text-cyan">■</span><span class="text-yellow">■</span><span class="text-violet">■</span><span class="text-rose">■</span>' },
    { type: "response", text: "" },
  ]
};

export default function Console() {
  const [lines, setLines] = useState([
    { type: "welcome", html: '<span class="text-accent">◆</span> Welcome to <span class="text-accent" style="font-weight:600">MoonWiRaja Console</span> <span class="text-muted">v3.0</span>' },
    { type: "hint", text: '  Type "help" or "neofetch" to display system info. (Taip "help" untuk bantuan)' },
    { type: "response", text: "" },
  ]);
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeGame, setActiveGame] = useState(null);

  const outputRef = useRef(null);
  const inputRef = useRef(null);

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

    const normalizedCmd = cmd.trim().toLowerCase();
    
    if (normalizedCmd === "gama" || normalizedCmd === "games") {
      executeCommandDirectly("game");
      return;
    }
    
    if (normalizedCmd.startsWith("game ") || normalizedCmd.startsWith("gama ") || normalizedCmd.startsWith("games ")) {
      const parts = normalizedCmd.split(" ");
      const gameType = parts[1];
      
      if (gameType === "snake" || gameType === "ular") {
        setActiveGame("snake");
        setLines((prev) => [
          ...prev,
          { type: "cmd", text: cmd },
          {
            type: "response",
            component: (
              <SnakeGame
                onClose={() => {
                  setActiveGame(null);
                  setLines((l) => [
                    ...l,
                    { type: "response", html: '<span class="text-accent">Snake game exited. Returning to terminal (Game Ular ditamatkan)...</span>' }
                  ]);
                }}
              />
            )
          }
        ]);
        return;
      }
      
      if (gameType === "rocket" || gameType === "rokey" || gameType === "roket") {
        setActiveGame("rocket");
        setLines((prev) => [
          ...prev,
          { type: "cmd", text: cmd },
          {
            type: "response",
            component: (
              <RocketGame
                onClose={() => {
                  setActiveGame(null);
                  setLines((l) => [
                    ...l,
                    { type: "response", html: '<span class="text-accent">Rocket game exited. Returning to terminal (Game Roket ditamatkan)...</span>' }
                  ]);
                }}
              />
            )
          }
        ]);
        return;
      }
    }
    if (cmd === "matrix") {
      setLines((prev) => [...prev, { type: "cmd", text: cmd }, { type: "response", html: '<span class="text-green">Initializing Matrix digital rain (Simulasi Matrix)...</span>' }]);
      
      const matrixLines = [
        "01001101 01001111 01001111 01001110 01010111 01001001 01001010 01000001",
        "10110100 11010110 01101100 10101011 11001101 00011011 01010101 10101010",
        "  [DECRYPTING MEMORYOFPLANET SWARM PROTOCOLS...]",
        ">> ACCESS GRANTED: moon.core.system.active = true",
        "01010010 01000001 01001010 01000001 01000011 01001111 01010010 01000101",
        "■■■■■ MATRIX DECRYPTION COMPLETE. SYSTEM SAFE. ■■■■■"
      ];
      
      matrixLines.forEach((mLine, index) => {
        setTimeout(() => {
          setLines((prev) => [
            ...prev,
            { type: "response", html: `<span class="text-green" style="font-family: monospace; opacity: ${0.5 + (index * 0.1)}">${mLine}</span>` }
          ]);
        }, (index + 1) * 300);
      });
      return;
    }
    if (cmd === "secret") {
      setLines((prev) => [...prev, { type: "cmd", text: cmd }, { type: "response", html: '<span class="text-accent">Opening classified file (Membuka fail sulit)...</span>' }]);
      
      const secretLines = [
        "=============================================================",
        "  🔓 ACCESS GRANTED: MEMORYOFPLANET PROJECT",
        "=============================================================",
        "  Active member: moon (Verified Creator)",
        "  Core Status:   initialized = true",
        "  Swarm Mode:    solo / active-agent-running",
        "  Secret Message (Mesej Tersembunyi):",
        "  \"Berusaha Sedaya Upaya, Setiap Usaha Yang kita lAKUKAN",
        "   WALUPUN GAGAL ADALAH KUNCI MENUJU KEJAYAAN JANGAN SESEKALI",
        "   MENYERAH KERANA DUNIA TAK MENUNGGU KITA UNTUK BANGKIT\" 🌍✨",
        "=============================================================",
      ];
      
      secretLines.forEach((sLine, index) => {
        setTimeout(() => {
          setLines((prev) => [
            ...prev,
            { type: "response", html: `<span class="text-accent" style="font-family: monospace; font-weight: 500;">${sLine}</span>` }
          ]);
        }, (index + 1) * 200);
      });
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
          html: `<span class="text-accent">✗</span> <span class="text-muted">Command "${cmd}" not found. Type "help" for assistance. (Perintah tidak ditemui)</span>`,
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
    }, 50);
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
      className={`console-card crt-effect crt-screen-flicker`}
      style={isMaximized ? {
        position: "fixed",
        inset: "12px",
        zIndex: 999,
        height: "calc(100vh - 24px)",
        width: "calc(100vw - 24px)"
      } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Title bar */}
      <div className="console-titlebar">
        <div className="titlebar-dots">
          <button 
            type="button"
            className="titlebar-dot red" 
            title="Clear output"
            onClick={() => setLines([])}
            aria-label="Clear Console"
          />
          <button 
            type="button"
            className="titlebar-dot yellow" 
            title="Collapse / Minimize"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label="Minimize Console"
          />
          <button 
            type="button"
            className="titlebar-dot green" 
            title="Toggle Fullscreen"
            onClick={() => setIsMaximized(!isMaximized)}
            aria-label="Maximize Console"
          />
        </div>
        <div className="titlebar-center">
          <Terminal className="titlebar-icon" />
          <span>moon@wiraja ~ console</span>
        </div>
        <span className="titlebar-center" style={{ color: "var(--text-ghost)" }}>v3.0</span>
      </div>

      {/* Console Body */}
      <AnimatePresence initial={false}>
        {!isMinimized && (
          <motion.div 
            className="console-body console-scroll"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => inputRef.current?.focus()}
            style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
          >
            <div className="console-output" ref={outputRef}>
              {lines.map((line, i) => (
                <div key={i} className={`console-line ${line.type}`}>
                  {line.type === "cmd" ? (
                    <>
                      <span className="prompt-symbol">❯</span>
                      <span className="cmd-text">{line.text}</span>
                    </>
                  ) : line.component ? (
                    line.component
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
                placeholder={
                  activeGame
                    ? "[Game aktif - Gunakan papan kekunci / D-Pad]"
                    : isTyping
                    ? ""
                    : "taip help..."
                }
                disabled={isTyping || !!activeGame}
                autoFocus={!activeGame}
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

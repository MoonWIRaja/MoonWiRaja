"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { SnakeGame, RocketGame } from "./TerminalGames";

const COMMANDS = {
  help: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent" style="font-weight: 600;">⌨️ MoonWiRaja Console v3.0 — INTERACTIVE HELP</span>' },
    { type: "response", html: '<span class="text-muted">════════════════════════════════════════════════</span>' },
    { type: "response", html: '<span class="text-yellow" style="font-weight: 600;">🌟 CORE COMMANDS</span>' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'about\')">about</span>       <span class="text-muted">·</span> Get to know me &amp; my design vision' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'skills\')">skills</span>      <span class="text-muted">·</span> Visual tech stack &amp; core expertise' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'experience\')">experience</span>  <span class="text-muted">·</span> Professional timeline &amp; career projects' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'repos\')">repos</span>       <span class="text-muted">·</span> Open-source repositories from GitHub' },
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-cyan" style="font-weight: 600;">🎮 FUN &amp; INTERACTIVE</span>' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'status\')">status</span>      <span class="text-muted">·</span> Live server &amp; memory metrics' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'neofetch\')">neofetch</span>    <span class="text-muted">·</span> System info &amp; custom ASCII art' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'matrix\')">matrix</span>      <span class="text-muted">·</span> Run digital binary rain simulation' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'secret\')">secret</span>      <span class="text-muted">·</span> Decrypt a classified core system message' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'game\')">game</span>        <span class="text-muted">·</span> Launch retro terminal games' },
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-rose" style="font-weight: 600;">🛠️ UTILITIES &amp; LINKS</span>' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'contact\')">contact</span>     <span class="text-muted">·</span> Social profiles &amp; email' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'clear\')">clear</span>       <span class="text-muted">·</span> Clear all terminal output' },
    { type: "response", html: '<span class="text-muted">════════════════════════════════════════════════</span>' },
    { type: "response", html: '<span class="text-muted" style="font-size:0.85rem">Tip: Click any green command above to run it instantly.</span>' },
    { type: "response", text: "" },
  ],
  game: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent" style="font-weight: 600;">🎮 RETRO GAME CENTER</span>' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", html: '  Type or click a game below to start playing:' },
    { type: "response", text: "" },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'game snake\')">game snake</span>   <span class="text-muted">·</span> Classic Snake 🐍' },
    { type: "response", html: '  ▸ <span class="text-green" style="font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="window.__consoleExec(\'game rocket\')">game rocket</span>  <span class="text-muted">·</span> Space Shooter 🚀' },
    { type: "response", text: "" },
    { type: "response", html: '  Controls: W / A / S / D or Arrow Keys.' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", text: "" },
  ],
  about: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">◆</span> <span style="font-weight:600">MoonWiRaja</span> — Full-Stack Web Creator' },
    { type: "response", html: '  <span class="text-muted">Location:</span>   Malaysia 🇲🇾' },
    { type: "response", html: '  <span class="text-muted">Focus:</span>      Modern web tech, smart automation &amp; premium UI/UX' },
    { type: "response", html: '  <span class="text-muted">Vision:</span>     Build fast, reactive &amp; aesthetically outstanding interfaces' },
    { type: "response", text: "" },
  ],
  skills: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent" style="font-weight:600">📊 TECH STACKS &amp; EXPERTISE</span>' },
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
    { type: "response", html: '<span class="text-accent" style="font-weight:600">💼 CAREER TIMELINE</span>' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", html: '  <span class="text-cyan" style="font-weight:500">2024 — Present</span>  <span class="text-secondary" style="font-weight:500">Lead Web Creator @ MoonWiRaja Digital</span>' },
    { type: "response", html: '                  <span class="text-muted">Building advanced portfolio systems &amp; AI integrations.</span>' },
    { type: "response", html: '  <span class="text-green" style="font-weight:500">2022 — 2024</span>     <span class="text-secondary" style="font-weight:500">Full-Stack Developer (Freelance)</span>' },
    { type: "response", html: '                  <span class="text-muted">Developed e-commerce systems, company profiles &amp; API automation.</span>' },
    { type: "response", html: '  <span class="text-yellow" style="font-weight:500">2021 — 2022</span>     <span class="text-secondary" style="font-weight:500">Frontend UI Specialist</span>' },
    { type: "response", html: '                  <span class="text-muted">Clean, responsive designs using React &amp; Tailwind CSS.</span>' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", text: "" },
  ],
  status: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent" style="font-weight:600">🖥️ LIVE SERVER MONITOR</span>' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", html: '  <span class="text-secondary">CPU Load:</span>  [<span class="text-green">■■■■■□□□□□</span>] <span class="text-green">52%</span>  (Google Brain Core)' },
    { type: "response", html: '  <span class="text-secondary">RAM Usage:</span> [<span class="text-green">■■■■■■■□□□</span>] <span class="text-yellow">71%</span>  (5.68 GB / 8.00 GB)' },
    { type: "response", html: '  <span class="text-secondary">Disk:</span>      [<span class="text-green">■■■□□□□□□□</span>] <span class="text-green">34%</span>  (124 GB / 360 GB)' },
    { type: "response", html: '  <span class="text-secondary">Database:</span>  [<span class="text-green">ONLINE</span>] 12ms latency' },
    { type: "response", html: '  <span class="text-secondary">AI Swarm:</span>  [<span class="text-accent">ACTIVE</span>] Agent swarm fully operational' },
    { type: "response", html: '<span class="text-muted">──────────────────────────────────────────</span>' },
    { type: "response", text: "" },
  ],
  repos: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">◆</span> <span style="font-weight:600">MAIN REPOSITORIES</span>' },
    { type: "response", text: "" },
    { type: "response", html: '  <span class="text-green">●</span> <span style="font-weight:500">MoonWiRaja</span>           Console portfolio dashboard app' },
    { type: "response", html: '  <span class="text-green">●</span> <span style="font-weight:500">MemoryOfPlanet.core</span>  AI agent management core runtime' },
    { type: "response", html: '  <span class="text-green">●</span> <span style="font-weight:500">myney.core</span>           Personal finance accounting system' },
    { type: "response", text: "" },
  ],
  contact: () => [
    { type: "response", text: "" },
    { type: "response", html: '<span class="text-accent">◆</span> <span style="font-weight:600">CONTACT &amp; SOCIALS</span>' },
    { type: "response", text: "" },
    { type: "response", html: '  <span class="text-accent">✉</span>  Email   <span class="text-secondary" style="text-decoration: underline; cursor: pointer;" onclick="window.location.href=\'mailto:hakimmikah191@gmail.com\'">hakimmikah191@gmail.com</span>' },
    { type: "response", html: '  <span class="text-accent">⟐</span>  GitHub  <span class="text-secondary" style="text-decoration: underline; cursor: pointer;" onclick="window.open(\'https://github.com/MoonWIRaja\', \'_blank\')">github.com/MoonWIRaja</span>' },
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
    { type: "hint", text: '  Type "help" or "neofetch" to get started.' },
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
                    { type: "response", html: '<span class="text-accent">Snake game exited. Returning to terminal...</span>' }
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
                    { type: "response", html: '<span class="text-accent">Space Shooter exited. Returning to terminal...</span>' }
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
      setLines((prev) => [...prev, { type: "cmd", text: cmd }, { type: "response", html: '<span class="text-green">Initializing Matrix digital rain...</span>' }]);
      
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
      setLines((prev) => [...prev, { type: "cmd", text: cmd }, { type: "response", html: '<span class="text-accent">Decrypting classified file...</span>' }]);
      
      const secretLines = [
        "═══════════════════════════════════════════════════════════",
        "  🔓  ACCESS GRANTED",
        "═══════════════════════════════════════════════════════════",
        "  Member  : moon  (Verified Creator)",
        "  Status  : initialized = true  ·  Agent running",
        "───────────────────────────────────────────────────────────",
        "  📜  A MESSAGE FROM THE CREATOR",
        "───────────────────────────────────────────────────────────",
        "  Give your best in every step you take.",
        "  Do not be afraid to try, and never let failure",
        "  stop your journey.",
        "  ",
        "  Every effort, even the ones that do not succeed,",
        "  still holds value. It becomes experience, a lesson,",
        "  and the strength that builds the road toward success.",
        "  ",
        "  The world will not stop and wait for us to be ready.",
        "  That is why we must rise, keep moving, and believe",
        "  that every small step can still create change.",
        "  ",
        "  Do not give up easily. Keep moving forward,",
        "  because you are already closer to success",
        "  than you think. 🌍✨",
        "═══════════════════════════════════════════════════════════",
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
          html: `<span class="text-accent">✗</span> <span class="text-muted">Command "${cmd}" not found. Type "help" for available commands.</span>`,
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
                    ? "[Game active — use keyboard or D-Pad]"
                    : isTyping
                    ? ""
                    : "type help..."
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

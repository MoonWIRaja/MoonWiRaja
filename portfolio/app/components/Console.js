"use client";

import { useState, useRef, useEffect } from "react";

const COMMANDS = {
  help: () => [
    { type: "response", text: "╔══════════════════════════════════════╗" },
    { type: "response", text: "║  Available Commands                  ║" },
    { type: "response", text: "╠══════════════════════════════════════╣" },
    { type: "response", text: "║  about    → Tentang saya             ║" },
    { type: "response", text: "║  skills   → Kemahiran & tech stack   ║" },
    { type: "response", text: "║  repos    → Senarai projek utama     ║" },
    { type: "response", text: "║  contact  → Cara menghubungi saya    ║" },
    { type: "response", text: "║  clear    → Bersihkan terminal       ║" },
    { type: "response", text: "╚══════════════════════════════════════╝" },
  ],
  about: () => [
    { type: "response", text: "" },
    {
      type: "response",
      html: '<span class="text-accent">⟐ MoonWiRaja</span> — Full-Stack Creator dari Malaysia',
    },
    {
      type: "response",
      text: "  Saya membina aplikasi web moden, alat automasi pintar,",
    },
    {
      type: "response",
      text: "  dan reka bentuk visual premium dengan fokus kepada",
    },
    {
      type: "response",
      text: "  pengalaman pengguna yang kemas dan responsif.",
    },
    { type: "response", text: "" },
  ],
  skills: () => [
    { type: "response", text: "" },
    {
      type: "response",
      html: '<span class="text-cyan">Frontend</span>  → HTML5 · CSS3 · JavaScript · React · Next.js · Astro',
    },
    {
      type: "response",
      html: '<span class="text-green">Backend</span>   → Node.js · Express · Python · REST APIs',
    },
    {
      type: "response",
      html: '<span class="text-yellow">Database</span>  → PostgreSQL · SQLite · MongoDB',
    },
    {
      type: "response",
      html: '<span class="text-violet">DevOps</span>    → Git · GitHub Actions · Docker · Linux CLI',
    },
    { type: "response", text: "" },
  ],
  repos: () => [
    { type: "response", text: "" },
    {
      type: "response",
      html: '  <span class="text-green">●</span> MoonWiRaja          — Portfolio console dashboard',
    },
    {
      type: "response",
      html: '  <span class="text-green">●</span> MemoryOfPlanet.core — AI agent management core',
    },
    {
      type: "response",
      html: '  <span class="text-green">●</span> myney.core          — Personal finance system',
    },
    { type: "response", text: "" },
  ],
  contact: () => [
    { type: "response", text: "" },
    {
      type: "response",
      html: '  <span class="text-accent">✉</span>  Email   → hakimmikah191@gmail.com',
    },
    {
      type: "response",
      html: '  <span class="text-accent">⟐</span>  GitHub  → github.com/MoonWIRaja',
    },
    { type: "response", text: "" },
  ],
};

export default function Console() {
  const [lines, setLines] = useState([
    {
      type: "welcome",
      html: '<span class="text-accent">⟐</span> Selamat datang ke <span class="text-accent">MoonWiRaja Console</span> v2.0',
    },
    {
      type: "hint",
      text: '  Taip "help" untuk melihat senarai arahan yang disokong.',
    },
    { type: "response", text: "" },
  ]);
  const [input, setInput] = useState("");
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    setInput("");

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    const cmdLine = { type: "cmd", text: cmd };
    const handler = COMMANDS[cmd];

    if (handler) {
      setLines((prev) => [...prev, cmdLine, ...handler()]);
    } else {
      setLines((prev) => [
        ...prev,
        cmdLine,
        {
          type: "response",
          html: `<span class="text-accent">✗</span> Perintah "${cmd}" tidak ditemui. Taip "help" untuk bantuan.`,
        },
      ]);
    }
  };

  const executeCommand = (cmd) => {
    const handler = COMMANDS[cmd];
    if (handler) {
      setLines((prev) => [
        ...prev,
        { type: "cmd", text: cmd },
        ...handler(),
      ]);
    }
  };

  // Expose to global for quick command buttons
  useEffect(() => {
    window.__consoleExec = executeCommand;
    return () => { delete window.__consoleExec; };
  });

  return (
    <div className="console-card glass-card">
      <div className="console-titlebar">
        <div className="titlebar-dots">
          <span className="titlebar-dot red"></span>
          <span className="titlebar-dot yellow"></span>
          <span className="titlebar-dot green"></span>
        </div>
        <span className="titlebar-label">moon@wiraja ~ console</span>
        <span className="titlebar-label">v2.0</span>
      </div>

      <div
        className="console-body console-scroll"
        onClick={() => inputRef.current?.focus()}
      >
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
            placeholder="taip help..."
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
}

// Export for quick commands from outside
export { COMMANDS };

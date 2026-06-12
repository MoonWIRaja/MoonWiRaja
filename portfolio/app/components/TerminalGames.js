"use client";

import { useState, useEffect, useRef } from "react";

// ────────────────────────────────────────────────────────
// 1. SNAKE GAME (ULAR RETRO)
// ────────────────────────────────────────────────────────
export function SnakeGame({ onClose }) {
  const GRID_SIZE = 15;
  const INITIAL_SPEED = 150;

  const [snake, setSnake] = useState([
    { r: 7, c: 7 },
    { r: 7, c: 6 },
    { r: 7, c: 5 }
  ]);
  const [direction, setDirection] = useState({ r: 0, c: 1 }); // Moving Right
  const [food, setFood] = useState({ r: 3, c: 4 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  // Load high score from local storage
  useEffect(() => {
    const saved = localStorage.getItem("snake_high_score");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Generate random food not on snake
  const spawnFood = (currentSnake) => {
    let newFood;
    let onSnake = true;
    while (onSnake) {
      newFood = {
        r: Math.floor(Math.random() * GRID_SIZE),
        c: Math.floor(Math.random() * GRID_SIZE)
      };
      onSnake = currentSnake.some(
        (segment) => segment.r === newFood.r && segment.c === newFood.c
      );
    }
    setFood(newFood);
  };

  // Reset Game
  const resetGame = () => {
    const initialSnake = [
      { r: 7, c: 7 },
      { r: 7, c: 6 },
      { r: 7, c: 5 }
    ];
    setSnake(initialSnake);
    setDirection({ r: 0, c: 1 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    spawnFood(initialSnake);
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || isPaused) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDir.r !== 1) setDirection({ r: -1, c: 0 });
          e.preventDefault();
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDir.r !== -1) setDirection({ r: 1, c: 0 });
          e.preventDefault();
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDir.c !== 1) setDirection({ r: 0, c: -1 });
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDir.c !== -1) setDirection({ r: 0, c: 1 });
          e.preventDefault();
          break;
        case " ":
          setIsPaused((p) => !p);
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, isPaused]);

  // Main game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const currentDir = directionRef.current;
        const newHead = {
          r: head.r + currentDir.r,
          c: head.c + currentDir.c
        };

        // Wall collisions (wrap around for arcade feel, or die? Let's make it wrap around, it feels smoother!)
        if (newHead.r < 0) newHead.r = GRID_SIZE - 1;
        if (newHead.r >= GRID_SIZE) newHead.r = 0;
        if (newHead.c < 0) newHead.c = GRID_SIZE - 1;
        if (newHead.c >= GRID_SIZE) newHead.c = 0;

        // Self collision check
        const selfCollision = prevSnake.some(
          (segment) => segment.r === newHead.r && segment.c === newHead.c
        );
        if (selfCollision) {
          setGameOver(true);
          // Save high score
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem("snake_high_score", score.toString());
          }
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food eating check
        if (newHead.r === food.r && newHead.c === food.c) {
          setScore((s) => s + 10);
          spawnFood(prevSnake);
        } else {
          newSnake.pop(); // Remove tail
        }

        return newSnake;
      });
    }, INITIAL_SPEED);

    return () => clearInterval(interval);
  }, [gameOver, isPaused, food, score, highScore]);

  // Direct direction controller (D-Pad clicks)
  const handleDirClick = (r, c) => {
    if (gameOver || isPaused) return;
    const currentDir = directionRef.current;
    if (r !== 0 && currentDir.r === -r) return; // prevent reversing into self
    if (c !== 0 && currentDir.c === -c) return;
    setDirection({ r, c });
  };

  return (
    <div
      className="game-container"
      onClick={(e) => e.stopPropagation()}
      style={{
        padding: "12px",
        background: "rgba(10, 20, 15, 0.9)",
        border: "1.5px solid var(--terminal-green)",
        borderRadius: "8px",
        fontFamily: "var(--font-mono)",
        color: "var(--terminal-green)",
        marginTop: "10px",
        marginBottom: "10px",
        maxWidth: "340px",
        marginRight: "auto"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.8rem", borderBottom: "1px dashed var(--terminal-green)", paddingBottom: "4px" }}>
        <span>🐍 SNAKE GAME RETRO</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent-red)",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem"
          }}
        >
          [KELUAR X]
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.75rem" }}>
        <span>SCORE: <span style={{ color: "#fff" }}>{score}</span></span>
        <span>HIGH: <span style={{ color: "#fff" }}>{highScore}</span></span>
      </div>

      {/* The Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: "100%",
          aspectRatio: "1/1",
          background: "#080f0c",
          border: "1px solid rgba(167, 201, 87, 0.2)",
          position: "relative",
          gap: "1px"
        }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, r) =>
          Array.from({ length: GRID_SIZE }).map((_, c) => {
            const isSnake = snake.some((seg) => seg.r === r && seg.c === c);
            const isHead = snake[0].r === r && snake[0].c === c;
            const isFood = food.r === r && food.c === c;

            return (
              <div
                key={`${r}-${c}`}
                style={{
                  background: isHead
                    ? "#fff"
                    : isSnake
                    ? "var(--terminal-green)"
                    : isFood
                    ? "var(--accent-red)"
                    : "transparent",
                  borderRadius: isFood ? "50%" : "2px",
                  boxShadow: isHead
                    ? "0 0 4px #fff"
                    : isSnake
                    ? "0 0 2px var(--terminal-green)"
                    : isFood
                    ? "0 0 6px var(--accent-red)"
                    : "none"
                }}
              />
            );
          })
        )}

        {/* Overlays */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "var(--accent-red)"
            }}
          >
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "8px" }}>GAME OVER</div>
            <div style={{ fontSize: "0.8rem", color: "#fff", marginBottom: "12px" }}>Score Anda: {score}</div>
            <button
              onClick={resetGame}
              style={{
                background: "var(--terminal-green)",
                color: "#121b18",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                fontFamily: "var(--font-mono)",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Main Semula
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-amber)"
            }}
          >
            <span style={{ fontSize: "1rem", fontWeight: "bold" }}>PAUSED</span>
          </div>
        )}
      </div>

      {/* D-Pad Controls for mobile / click play */}
      <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
        <button
          onClick={() => handleDirClick(-1, 0)}
          style={{
            width: "36px",
            height: "36px",
            background: "rgba(167, 201, 87, 0.15)",
            border: "1px solid var(--terminal-green)",
            color: "var(--terminal-green)",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ▲
        </button>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={() => handleDirClick(0, -1)}
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(167, 201, 87, 0.15)",
              border: "1px solid var(--terminal-green)",
              color: "var(--terminal-green)",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ◀
          </button>
          <button
            onClick={() => setIsPaused((p) => !p)}
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(167, 201, 87, 0.1)",
              border: "1px dashed var(--terminal-green)",
              color: "var(--terminal-green)",
              fontSize: "0.6rem",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            PAUSE
          </button>
          <button
            onClick={() => handleDirClick(0, 1)}
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(167, 201, 87, 0.15)",
              border: "1px solid var(--terminal-green)",
              color: "var(--terminal-green)",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ▶
          </button>
        </div>
        <button
          onClick={() => handleDirClick(1, 0)}
          style={{
            width: "36px",
            height: "36px",
            background: "rgba(167, 201, 87, 0.15)",
            border: "1px solid var(--terminal-green)",
            color: "var(--terminal-green)",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          ▼
        </button>
      </div>

      <div style={{ textAlign: "center", fontSize: "0.6rem", color: "var(--text-ghost)", marginTop: "8px" }}>
        Gunakan W/A/S/D atau kekunci Arah pada papan kekunci anda.
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// 2. ROCKET SPACE SHOOTER (ROKET ANGKASA)
// ────────────────────────────────────────────────────────
export function RocketGame({ onClose }) {
  const GRID_SIZE = 15;
  const PLAYER_ROW = 14;

  const [playerCol, setPlayerCol] = useState(7);
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Load high score from local storage
  useEffect(() => {
    const saved = localStorage.getItem("rocket_high_score");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || isPaused) return;

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          setPlayerCol((c) => Math.max(0, c - 1));
          e.preventDefault();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          setPlayerCol((c) => Math.min(GRID_SIZE - 1, c + 1));
          e.preventDefault();
          break;
        case " ":
        case "ArrowUp":
        case "w":
        case "W":
          shoot();
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerCol, gameOver, isPaused]);

  // Actions
  const shoot = () => {
    if (gameOver || isPaused) return;
    setBullets((prev) => [...prev, { r: PLAYER_ROW - 1, c: playerCol }]);
  };

  const resetGame = () => {
    setPlayerCol(7);
    setBullets([]);
    setEnemies([]);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsPaused(false);
  };

  // Bullets loop (fast moving)
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      setBullets((prevBullets) =>
        prevBullets
          .map((b) => ({ ...b, r: b.r - 1 }))
          .filter((b) => b.r >= 0)
      );
    }, 100);

    return () => clearInterval(interval);
  }, [gameOver, isPaused]);

  // Enemies loop (slow moving + spawning)
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveInterval = setInterval(() => {
      setEnemies((prevEnemies) => {
        const moved = prevEnemies.map((e) => ({ ...e, r: e.r + 1 }));
        
        // Check if any enemy reached player or bottom
        const hitBottom = moved.some((e) => e.r >= PLAYER_ROW);
        if (hitBottom) {
          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              setGameOver(true);
              if (score > highScore) {
                setHighScore(score);
                localStorage.setItem("rocket_high_score", score.toString());
              }
            }
            return nextL;
          });
          return moved.filter((e) => e.r < PLAYER_ROW);
        }
        return moved;
      });
    }, 400);

    const spawnInterval = setInterval(() => {
      setEnemies((prev) => {
        const randomCol = Math.floor(Math.random() * GRID_SIZE);
        // Avoid duplicate spawns on same col immediately
        if (prev.some((e) => e.r === 0 && e.c === randomCol)) return prev;
        return [...prev, { r: 0, c: randomCol }];
      });
    }, 1200);

    return () => {
      clearInterval(moveInterval);
      clearInterval(spawnInterval);
    };
  }, [gameOver, isPaused, score, highScore]);

  // Collision detection
  useEffect(() => {
    if (gameOver || isPaused) return;

    setBullets((prevBullets) => {
      let bulletsToKeep = [...prevBullets];
      let enemiesToKeep = [...enemies];
      let scoreIncrement = 0;

      for (let bIdx = bulletsToKeep.length - 1; bIdx >= 0; bIdx--) {
        const bullet = bulletsToKeep[bIdx];
        const hitIdx = enemiesToKeep.findIndex(
          (e) => (e.r === bullet.r || e.r === bullet.r + 1) && e.c === bullet.c
        );

        if (hitIdx !== -1) {
          // Collision! Remove bullet & enemy
          bulletsToKeep.splice(bIdx, 1);
          enemiesToKeep.splice(hitIdx, 1);
          scoreIncrement += 10;
        }
      }

      if (scoreIncrement > 0) {
        setScore((s) => s + scoreIncrement);
        setEnemies(enemiesToKeep);
      }

      return bulletsToKeep;
    });
  }, [bullets, enemies, gameOver, isPaused]);

  return (
    <div
      className="game-container"
      onClick={(e) => e.stopPropagation()}
      style={{
        padding: "12px",
        background: "rgba(15, 10, 20, 0.9)",
        border: "1.5px solid var(--accent-cherry, var(--accent-red))",
        borderRadius: "8px",
        fontFamily: "var(--font-mono)",
        color: "var(--accent-cherry, var(--accent-red))",
        marginTop: "10px",
        marginBottom: "10px",
        maxWidth: "340px",
        marginRight: "auto"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.8rem", borderBottom: "1px dashed var(--accent-cherry, var(--accent-red))", paddingBottom: "4px" }}>
        <span>🚀 ROCKET SPACE SHOOTER</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent-red)",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.9rem"
          }}
        >
          [KELUAR X]
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.75rem" }}>
        <span>SCORE: <span style={{ color: "#fff" }}>{score}</span></span>
        <span>LIVES: <span style={{ color: "#fff" }}>{"❤️".repeat(lives)}</span></span>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: "100%",
          aspectRatio: "1/1",
          background: "#0c080f",
          border: "1px solid rgba(214, 40, 40, 0.2)",
          position: "relative",
          gap: "1px"
        }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, r) =>
          Array.from({ length: GRID_SIZE }).map((_, c) => {
            const isPlayer = r === PLAYER_ROW && c === playerCol;
            const isBullet = bullets.some((b) => b.r === r && b.c === c);
            const isEnemy = enemies.some((e) => e.r === r && e.c === c);

            return (
              <div
                key={`${r}-${c}`}
                style={{
                  background: isPlayer
                    ? "var(--terminal-green)"
                    : isBullet
                    ? "var(--accent-yellow, #ffbe0b)"
                    : isEnemy
                    ? "var(--accent-cherry, var(--accent-red))"
                    : "transparent",
                  borderRadius: isBullet ? "50%" : "2px",
                  boxShadow: isPlayer
                    ? "0 0 6px var(--terminal-green)"
                    : isBullet
                    ? "0 0 4px var(--accent-yellow, #ffbe0b)"
                    : isEnemy
                    ? "0 0 6px var(--accent-cherry, var(--accent-red))"
                    : "none"
                }}
              />
            );
          })
        )}

        {/* Overlays */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.85)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "var(--accent-cherry, var(--accent-red))"
            }}
          >
            <div style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "8px" }}>MISSION FAILED</div>
            <div style={{ fontSize: "0.8rem", color: "#fff", marginBottom: "12px" }}>Score Anda: {score}</div>
            <button
              onClick={resetGame}
              style={{
                background: "var(--accent-cherry, var(--accent-red))",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                fontFamily: "var(--font-mono)",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Main Semula
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-amber)"
            }}
          >
            <span style={{ fontSize: "1rem", fontWeight: "bold" }}>PAUSED</span>
          </div>
        )}
      </div>

      {/* On-screen controls */}
      <div style={{ marginTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => !gameOver && !isPaused && setPlayerCol((c) => Math.max(0, c - 1))}
            style={{
              width: "44px",
              height: "36px",
              background: "rgba(214, 40, 40, 0.15)",
              border: "1px solid var(--accent-cherry, var(--accent-red))",
              color: "var(--accent-cherry, var(--accent-red))",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ◀ Move
          </button>
          <button
            onClick={() => !gameOver && !isPaused && setPlayerCol((c) => Math.min(GRID_SIZE - 1, c + 1))}
            style={{
              width: "44px",
              height: "36px",
              background: "rgba(214, 40, 40, 0.15)",
              border: "1px solid var(--accent-cherry, var(--accent-red))",
              color: "var(--accent-cherry, var(--accent-red))",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Move ▶
          </button>
        </div>

        <button
          onClick={() => setIsPaused((p) => !p)}
          style={{
            width: "36px",
            height: "36px",
            background: "rgba(255,255,255,0.05)",
            border: "1px dashed rgba(255,255,255,0.2)",
            color: "#fff",
            fontSize: "0.6rem",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          PAUSE
        </button>

        <button
          onClick={shoot}
          style={{
            padding: "0 16px",
            height: "36px",
            background: "var(--accent-cherry, var(--accent-red))",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.8rem",
            boxShadow: "0 0 6px var(--accent-cherry)"
          }}
        >
          🚀 TEMBAK
        </button>
      </div>

      <div style={{ textAlign: "center", fontSize: "0.6rem", color: "var(--text-ghost)", marginTop: "8px" }}>
        Gunakan A/D (atau Kiri/Kanan) untuk bergerak, SPACEBAR (atau Atas) untuk menembak.
      </div>
    </div>
  );
}

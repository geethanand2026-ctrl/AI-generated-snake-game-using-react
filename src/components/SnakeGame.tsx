import { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving UP initially
// Make the game a bit faster for the machine feel
const GAME_SPEED = 90;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const directionRef = useRef(direction);
  const lastMoveDirectionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastMoveDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "w", "s", "a", "d"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === " " && gameOver) {
        resetGame();
        return;
      }

      if (e.key === " " && !gameOver) {
        setIsPlaying(prev => !prev);
        return;
      }

      if (!isPlaying && !gameOver && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "s", "a", "d"].includes(e.key)) {
        setIsPlaying(true);
      }

      const lastMove = lastMoveDirectionRef.current;
      const isOppositeLast = (x: number, y: number) => lastMove.x === -x && lastMove.y === -y;

      const updateDir = (x: number, y: number) => {
        if (!isOppositeLast(x, y)) {
          directionRef.current = { x, y };
          setDirection({ x, y });
        }
      };

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W': updateDir(0, -1); break;
        case 'ArrowDown':
        case 's':
        case 'S': updateDir(0, 1); break;
        case 'ArrowLeft':
        case 'a':
        case 'A': updateDir(-1, 0); break;
        case 'ArrowRight':
        case 'd':
        case 'D': updateDir(1, 0); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, generateFood]);

  const stateRef = useRef({ snake, direction, food, score, gameOver });
  useEffect(() => {
    stateRef.current = { snake, direction, food, score, gameOver };
  }, [snake, direction, food, score, gameOver]);

  useEffect(() => {
    if (!isPlaying) return;

    const intervalId = setInterval(() => {
      if (stateRef.current.gameOver) return;

      const { snake: currentSnake, food: currentFood } = stateRef.current;
      const currentDir = directionRef.current;
      const head = currentSnake[0];
      
      const newHead = {
        x: head.x + currentDir.x,
        y: head.y + currentDir.y
      };

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      const newSnake = [newHead, ...currentSnake];

      if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
      lastMoveDirectionRef.current = currentDir;
    }, GAME_SPEED);

    return () => clearInterval(intervalId);
  }, [isPlaying, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-6 glitch-border bg-[#050505] text-[#00ffff] relative">
      <div className="flex w-full justify-between items-end mb-4 border-b-2 border-[#ff00ff] pb-2 uppercase">
        <div className="text-xl md:text-2xl font-bold tracking-widest">
          MEM_ADDR: <span className="text-[#ff00ff]">0x{score.toString(16).toUpperCase().padStart(4, '0')}</span>
        </div>
        <div className={`px-2 py-1 text-sm md:text-base font-bold tracking-widest ${gameOver ? 'bg-[#ff00ff] text-black animate-pulse' : isPlaying ? 'bg-[#00ffff] text-black' : 'border-2 border-[#00ffff]'}`}>
          {gameOver ? 'ERR_SEGFAULT' : isPlaying ? 'EXEC_MODE' : 'AWAITING_INPUT'}
        </div>
      </div>

      <div
        className="grid bg-[#020202] border-4 w-[90vw] max-w-[360px] md:max-w-[440px] aspect-square relative"
        style={{
          borderColor: gameOver ? '#ff00ff' : '#00ffff',
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(seg => seg.x === x && seg.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div key={i} className="w-full h-full p-[1px]">
               {isHead ? (
                <div className="w-full h-full bg-white" />
              ) : isSnake ? (
                <div className="w-full h-full bg-[#00ffff]" />
              ) : isFood ? (
                <div className="w-full h-full bg-[#ff00ff] animate-pulse" />
              ) : null}
            </div>
          )
        })}
      </div>

      {gameOver && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/95 border-4 border-[#ff00ff] m-2">
          <div className="text-4xl md:text-6xl text-[#ff00ff] font-bold glitch-text mb-4" data-text="FATAL_ERROR">FATAL_ERROR</div>
          <div className="text-2xl text-white mb-8">DATA_RECOVERED: {score}B</div>
          <button
            onClick={resetGame}
            className="px-8 py-4 bg-[#ff00ff] text-black text-xl font-bold hover:bg-white hover:text-black transition-none uppercase tracking-widest border-2 border-dashed border-black focus:outline-none"
          >
            &gt; REBOOT_SYS
          </button>
        </div>
      )}

      {!isPlaying && !gameOver && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 p-6 text-center border-4 border-[#00ffff] m-2">
          <button
            onClick={() => setIsPlaying(true)}
            className="px-8 py-4 border-4 border-[#00ffff] bg-black hover:bg-[#00ffff] text-[#00ffff] hover:text-black font-bold text-2xl tracking-widest uppercase mb-8 transition-none focus:outline-none"
          >
            &gt; INIT_PROCESS
          </button>
          <div className="flex flex-col space-y-4 text-[#ff00ff]">
            <div>INPUT_MAP: [W,A,S,D] OR [ARROWS]</div>
            <div>SUSPEND_PROCESS: [SPACE]</div>
          </div>
        </div>
      )}
    </div>
  );
}

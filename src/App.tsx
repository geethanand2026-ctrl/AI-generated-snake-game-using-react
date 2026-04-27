import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-black text-[#00ffff] font-mono overflow-hidden relative selection:bg-[#ff00ff] selection:text-black">
      <div className="bg-noise" />
      <div className="scanlines" />

      {/* Header */}
      <header className="flex-shrink-0 p-4 border-b-4 border-[#ff00ff] border-double z-10 w-full bg-black flex justify-between items-end">
        <h1 
          className="text-4xl md:text-5xl font-mono glitch-text text-white font-bold tracking-widest" 
          data-text="SNAKE_OS.EXE"
        >
          SNAKE_OS.EXE
        </h1>
        <div className="text-right flex flex-col text-sm md:text-base text-[#ff00ff]">
          <span>VER: 0xDEADBEEF</span>
          <span className="animate-pulse">SYS_STATUS: OPTIMAL</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 relative z-10 w-full min-h-0 overflow-y-auto">
        <div className="w-full flex items-center justify-center pb-[140px] md:pb-6">
          <SnakeGame />
        </div>
      </main>

      {/* Footer / Music Player */}
      <footer className="fixed bottom-0 left-0 right-0 border-t-4 border-double border-[#00ffff] bg-black z-40">
        <MusicPlayer />
      </footer>
    </div>
  );
}

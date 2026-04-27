import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, TerminalSquare } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'BGM_VAR_01.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'BGM_VAR_02.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'BGM_VAR_03.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    }
  };

  const playNext = useCallback(() => {
    setCurrentTrackIdx((prev) => (prev + 1) % TRACKS.length);
  }, []);

  const playPrev = () => {
    setCurrentTrackIdx((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  }, [currentTrackIdx]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 p-2 md:p-4 bg-black border-2 border-dashed border-[#ff00ff] relative">
      <audio
        ref={audioRef}
        src={TRACKS[currentTrackIdx].url}
        onEnded={playNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Track Info */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-black border-2 border-[#00ffff] relative overflow-hidden">
           {isPlaying && <div className="absolute inset-0 bg-[#00ffff]/20 animate-pulse" />}
           <TerminalSquare className={`w-6 h-6 ${isPlaying ? 'text-[#ff00ff]' : 'text-[#00ffff]'}`} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col">
          <p className="text-sm font-bold text-[#ff00ff] uppercase m-0 leading-tight block">ACTIVE_AUDIO_STREAM</p>
          <div className="block text-xl md:text-2xl text-white font-bold truncate w-full tracking-widest uppercase m-0 leading-none">
            {TRACKS[currentTrackIdx].title}
          </div>
        </div>
      </div>

      {/* Main Controls - Brutalist */}
      <div className="flex items-center space-x-2">
        <button onClick={playPrev} className="p-2 border-2 border-[#00ffff] bg-black text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-none cursor-pointer focus:outline-none">
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={togglePlay}
          className="p-3 border-2 border-[#ff00ff] bg-black text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-none cursor-pointer focus:outline-none flex items-center justify-center w-14 h-14"
        >
          {isPlaying ? <Pause className="w-6 h-6" fill="currentColor" /> : <Play className="w-6 h-6 ml-1" fill="currentColor" />}
        </button>
        <button onClick={playNext} className="p-2 border-2 border-[#00ffff] bg-black text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-none cursor-pointer focus:outline-none">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      {/* Volume Control */}
      <div className="hidden md:flex flex-row items-center space-x-2 w-40 ml-4 border-2 border-gray-800 p-2 relative">
        <button onClick={() => setIsMuted(!isMuted)} className="text-[#00ffff] hover:text-white cursor-pointer focus:outline-none">
          {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        <div className="flex-1 h-4 bg-gray-900 border border-gray-700 relative overflow-hidden flex">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className="flex-1 h-full border-r-2 border-black"
              style={{ backgroundColor: (isMuted ? 0 : volume) >= (i + 1) / 10 ? (i > 7 ? '#ff00ff' : '#00ffff') : 'transparent' }}
            />
          ))}
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            setIsMuted(false);
          }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="text-xs text-white right-1 absolute -top-[14px] bg-black px-1 font-bold">VOL_LVL</div>
      </div>
    </div>
  );
}

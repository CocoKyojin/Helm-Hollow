import React, { useEffect } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Home } from 'lucide-react';
import { sound } from '../game/audio';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onReturnToTitle: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onReturnToTitle,
  isMuted,
  onToggleMute,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        onResume();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onResume]);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xs pointer-events-auto select-none">
      <div className="w-full max-w-sm bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 shadow-2xl text-center">
        <div className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold mb-2">
          Adventure Suspended
        </div>
        <h2 className="text-2xl font-display text-white mb-6 tracking-wide">
          GAME PAUSED
        </h2>

        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>RESUME PLAY</span>
          </button>

          <button
            onClick={onToggleMute}
            className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            <span>{isMuted ? 'UNMUTE SYNTH AUDIO' : 'MUTE SYNTH AUDIO'}</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-300 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>RESPAWN AT MEADOW HUB</span>
          </button>

          <button
            onClick={onReturnToTitle}
            className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>TITLE SCREEN</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 font-mono text-xs text-slate-500">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to resume
        </div>
      </div>
    </div>
  );
};

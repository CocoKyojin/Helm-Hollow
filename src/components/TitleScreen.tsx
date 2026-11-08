import React, { useEffect, useState } from 'react';
import { Play, Volume2, VolumeX, Shield, Sparkles, MapPin, Compass } from 'lucide-react';
import { sound } from '../game/audio';

interface TitleScreenProps {
  onStart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

const WEAPON_NAMES = [
  'Arming Sword', 'Dragon Claymore', 'Flintlock Blunderbuss', 'Elven Recurve Bow',
  'Executioner Greataxe', 'Crag War Hammer', 'Rogue Daggers', 'Dual Flintlocks'
];

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, isMuted, onToggleMute }) => {
  const [weaponIdx, setWeaponIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWeaponIdx(prev => (prev + 1) % WEAPON_NAMES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        sound.playLevelUp();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-between p-6 sm:p-12 pointer-events-auto select-none overflow-hidden bg-slate-950/60 backdrop-blur-xs">
      {/* Top Bar with Audio & Version */}
      <div className="w-full flex items-center justify-between max-w-5xl">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-300 font-bold">
            Continuous Free World MMO · v2.5
          </span>
        </div>

        <button
          onClick={onToggleMute}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-mono transition-colors cursor-pointer"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
          <span>{isMuted ? 'MUTED' : 'SYNTH AUDIO'}</span>
        </button>
      </div>

      {/* Hero Centerpiece & Bespoke Title Lockup */}
      <div className="flex flex-col items-center text-center max-w-3xl my-auto">
        {/* Animated Knight Helmet Centerpiece */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-2 border-amber-500/50 bg-slate-900/90 flex items-center justify-center shadow-2xl relative shadow-amber-500/10">
            <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-400 drop-shadow-lg">
              <path d="M50 15 C28 15 22 35 22 55 L22 75 L35 75 L35 85 L65 85 L65 75 L78 75 L78 55 C78 35 72 15 50 15 Z" fill="#1e293b" stroke="currentColor" strokeWidth="3" />
              <rect x="26" y="44" width="48" height="6" rx="2" fill="#0d141b" stroke="currentColor" strokeWidth="1.5" />
              <path d="M50 5 L50 25 M40 8 L50 5 L60 8" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="absolute -bottom-3 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-display text-[10px] tracking-wider shadow">
              ARMORY
            </div>
          </div>
        </div>

        {/* Bespoke SVG Title Lockup */}
        <div className="w-full max-w-xl px-2">
          <svg viewBox="0 0 600 110" className="w-full h-auto drop-shadow-xl">
            <defs>
              <linearGradient id="helmGold" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffd24a" />
                <stop offset="50%" stopColor="#f2b134" />
                <stop offset="100%" stopColor="#e4572e" />
              </linearGradient>
            </defs>

            <text
              x="300"
              y="58"
              textAnchor="middle"
              fontFamily="Bungee, Impact, sans-serif"
              fontSize="44"
              letterSpacing="4"
              fill="url(#helmGold)"
              stroke="#0d141b"
              strokeWidth="4"
            >
              HELM HOLLOW
            </text>

            <text
              x="300"
              y="92"
              textAnchor="middle"
              fontFamily="Nunito, sans-serif"
              fontWeight="900"
              fontSize="16"
              letterSpacing="6"
              fill="#eef2f6"
            >
              REALMS & ARMORY EXPANDED
            </text>
          </svg>
        </div>

        <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
          Side-scrolling RPG platformer. Chop timber trees, trade with Gimbal the merchant, journey across 5 mystical realms, and master 10 weapon styles with dual-wielding.
        </p>

        {/* Cycling Armory Preview */}
        <div className="mt-4 flex items-center gap-2 text-xs font-mono text-amber-300 bg-slate-900/80 border border-slate-800 px-3.5 py-1.5 rounded-full">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Active Armory: <b>{WEAPON_NAMES[weaponIdx]}</b></span>
        </div>

        {/* Start Button CTA */}
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <button
            onClick={() => {
              sound.playLevelUp();
              onStart();
            }}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-display text-sm tracking-wider flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/20 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>START ADVENTURE</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            Press <kbd className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-200">Space</kbd> or <kbd className="px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-200">Enter</kbd> to launch
          </span>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-3 gap-6 text-left max-w-lg w-full border-t border-slate-800/80 pt-5">
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold font-display mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>10 Weapons</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">Swords, claymores, bow, gun & dual wield</div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold font-display mb-1">
              <span className="text-sm">🪵</span>
              <span>Timber Trees</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">Fell trees for logs & trade for gold</div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-purple-400 text-xs font-bold font-display mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>5 Realms</span>
            </div>
            <div className="text-[11px] text-slate-400 leading-tight">Seamless world gates & leyline portals</div>
          </div>
        </div>
      </div>

      {/* Flat Control Hint Line */}
      <div className="w-full text-center py-2 border-t border-slate-800/80 font-mono text-xs text-slate-300">
        <span>A/D Move</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>W/Up Jump</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>Space Attack</span>
        <span className="mx-2 text-slate-600">·</span>
        <span className="text-emerald-400 font-bold">C Chop Trees 🪵</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>Shift Dash</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>B Bag</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>E Shop</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>T Travel</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>Esc Pause</span>
      </div>
    </div>
  );
};

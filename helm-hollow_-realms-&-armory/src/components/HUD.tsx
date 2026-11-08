import React from 'react';
import { PlayerState, RegionDef } from '../game/types';
import { Volume2, VolumeX, Backpack, Store, Compass, Shield, Flame, Snowflake, Zap, Sparkles } from 'lucide-react';
import { WEAPON_TYPES, SWORD_STYLES, ELEMENT_INFO } from '../game/engine';

interface HUDProps {
  player: PlayerState;
  region: RegionDef;
  isMuted: boolean;
  onToggleMute: () => void;
  toastMsg: string | null;
  onOpenBag: () => void;
  onOpenShop: () => void;
  onOpenPortal: () => void;
  onTouchAction: (action: 'l' | 'r' | 'j' | 'a' | 'd' | 'c', active: boolean) => void;
}

export const HUD: React.FC<HUDProps> = ({
  player,
  region,
  isMuted,
  onToggleMute,
  toastMsg,
  onOpenBag,
  onOpenShop,
  onOpenPortal,
  onTouchAction,
}) => {
  const hpPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
  const xpPct = Math.max(0, Math.min(100, (player.xp / player.nextXp) * 100));

  const mainWeapon = player.eq.weapon;
  const mainDef = WEAPON_TYPES[mainWeapon.type || 'sword'];
  const offWeapon = player.eq.offhand;

  const mainElem = mainWeapon.element || 'none';

  return (
    <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden">
      {/* TOP PERIMETER: STATS & PROGRESS */}
      <div className="w-full flex items-start justify-between gap-3">
        {/* Left: Level, Health & XP Bars */}
        <div className="flex flex-col gap-1.5 w-56 sm:w-68 bg-slate-900/85 border border-slate-700/80 p-3 rounded-2xl shadow-xl">
          {/* Level & HP Header */}
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-amber-400 font-display text-sm tracking-wider">
              LV {player.lvl}
            </span>
            <span className="tabular-nums text-slate-200">
              {Math.ceil(player.hp)} / {player.maxHp} HP
            </span>
          </div>

          {/* Health Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-150"
              style={{ width: `${hpPct}%` }}
            />
          </div>

          {/* XP Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-0.5">
            <span>EXP</span>
            <span className="tabular-nums">{player.xp} / {player.nextXp}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-150"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>

        {/* Center: Toast Notification Banner */}
        {toastMsg && (
          <div className="px-5 py-2 rounded-xl bg-slate-900/95 border border-amber-500/60 shadow-2xl text-amber-300 font-bold text-xs sm:text-sm tracking-wide animate-bounce">
            {toastMsg}
          </div>
        )}

        {/* Right: Realm, Currencies & Modals */}
        <div className="flex items-center gap-2.5">
          {/* Realm & Currencies Pod */}
          <div className="flex flex-col items-end gap-0.5 bg-slate-900/85 border border-slate-700/80 px-3.5 py-2 rounded-2xl shadow-xl">
            <div className="text-xs font-display text-amber-400 tracking-wider">
              {region.name}
            </div>
            <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1 text-amber-400 tabular-nums">
                🪙 {player.gold}
              </span>
              <span className="flex items-center gap-1 text-emerald-400 tabular-nums">
                🪵 {player.wood}
              </span>
            </div>
          </div>

          {/* Nav Modals Buttons */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={onOpenBag}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 transition-all cursor-pointer shadow-lg hover:border-amber-500"
              title="Open Equipment & Bag (B)"
            >
              <Backpack className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={onOpenShop}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 transition-all cursor-pointer shadow-lg hover:border-amber-500"
              title="Gimbal's Merchant Shop (E)"
            >
              <Store className="w-4 h-4 text-emerald-400" />
            </button>

            <button
              onClick={onOpenPortal}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 transition-all cursor-pointer shadow-lg hover:border-amber-500"
              title="Realm Leyline Portal (T)"
            >
              <Compass className="w-4 h-4 text-purple-400" />
            </button>

            <button
              onClick={onToggleMute}
              className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 transition-all cursor-pointer shadow-lg"
              title={isMuted ? 'Unmute Synth' : 'Mute Synth'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM PERIMETER: WEAPON LOADOUT & TOUCH CONTROLS */}
      <div className="w-full flex items-end justify-between gap-3">
        {/* Active Weapon & Set Bonus Indicator */}
        <div className="flex flex-col gap-2">
          {/* Active Set Bonus Pill if active */}
          {player.activeSetBonus && (
            <div className="bg-slate-900/90 border border-amber-500/60 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-mono font-bold text-amber-300 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{player.activeSetBonus.split(':')[0]} Active!</span>
            </div>
          )}

          {/* Active Weapon Pod */}
          <div className="bg-slate-900/85 border border-slate-700/80 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400">
              {mainElem === 'fire' ? (
                <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
              ) : mainElem === 'ice' ? (
                <Snowflake className="w-5 h-5 text-sky-400 animate-pulse" />
              ) : mainElem === 'electric' ? (
                <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
              ) : (
                <Shield className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div className="flex flex-col">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>Active Loadout</span>
                {mainElem !== 'none' && (
                  <span className="font-bold text-[10px] text-amber-400">
                    ({ELEMENT_INFO[mainElem].name} Aura)
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <span>{mainWeapon.name}</span>
                {offWeapon && (
                  <span className="text-amber-400 font-mono text-[11px]">
                    + Dual {offWeapon.name}
                  </span>
                )}
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                {mainWeapon.swordStyle ? SWORD_STYLES[mainWeapon.swordStyle]?.desc : mainDef.desc}
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP KEYBOARD CONTROLS HELPER BAR (visible on medium/large screens) */}
        <div className="hidden md:flex items-center gap-3 py-1.5 px-4 mx-auto rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-mono text-slate-300 shadow-xl pointer-events-auto">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-bold">A/D</kbd> Move
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-bold">W</kbd> Jump
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-400 font-bold">SPACE</kbd> Attack
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold">C</kbd>
            <span className="text-emerald-300 font-bold">Chop Tree 🪵</span>
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-300 font-bold">SHIFT</kbd> Dash
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-bold">B</kbd> Bag
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-bold">E</kbd> Shop
          </span>
          <span className="text-slate-600">·</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-bold">T</kbd> Travel
          </span>
        </div>

        {/* On-Screen Mobile Touch Controls (visible on touch devices) */}
        <div className="pointer-events-auto flex items-center justify-between w-full max-w-sm md:hidden ml-auto">
          {/* Movement arrows */}
          <div className="flex items-center gap-1.5">
            <button
              onPointerDown={() => onTouchAction('l', true)}
              onPointerUp={() => onTouchAction('l', false)}
              className="w-11 h-11 rounded-full border border-slate-600 bg-slate-900/80 active:bg-amber-500/40 text-slate-100 font-bold font-mono text-base flex items-center justify-center cursor-pointer select-none"
            >
              ◀
            </button>
            <button
              onPointerDown={() => onTouchAction('r', true)}
              onPointerUp={() => onTouchAction('r', false)}
              className="w-11 h-11 rounded-full border border-slate-600 bg-slate-900/80 active:bg-amber-500/40 text-slate-100 font-bold font-mono text-base flex items-center justify-center cursor-pointer select-none"
            >
              ▶
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onPointerDown={() => onTouchAction('c', true)}
              onPointerUp={() => onTouchAction('c', false)}
              className="w-11 h-11 rounded-full border border-emerald-500/70 bg-emerald-950/85 active:bg-emerald-500/50 text-emerald-300 font-bold font-mono text-[9px] flex flex-col items-center justify-center shadow-lg cursor-pointer select-none"
              title="Chop Timber Tree (C)"
            >
              <span>🪵</span>
              <span className="leading-none font-bold">CHOP</span>
            </button>
            <button
              onPointerDown={() => onTouchAction('d', true)}
              onPointerUp={() => onTouchAction('d', false)}
              className="w-10 h-10 rounded-full border border-cyan-500/50 bg-slate-900/80 active:bg-cyan-500/40 text-cyan-300 font-bold font-mono text-[10px] flex items-center justify-center cursor-pointer select-none"
            >
              ROLL
            </button>
            <button
              onPointerDown={() => onTouchAction('j', true)}
              onPointerUp={() => onTouchAction('j', false)}
              className="w-10 h-10 rounded-full border border-slate-600 bg-slate-900/80 active:bg-amber-500/40 text-slate-100 font-bold font-mono text-[10px] flex items-center justify-center cursor-pointer select-none"
            >
              JUMP
            </button>
            <button
              onPointerDown={() => onTouchAction('a', true)}
              onPointerUp={() => onTouchAction('a', false)}
              className="w-12 h-12 rounded-full border-2 border-amber-500 bg-amber-500/30 active:bg-amber-500 text-amber-200 font-display text-[11px] flex items-center justify-center shadow-lg cursor-pointer select-none"
            >
              ATK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

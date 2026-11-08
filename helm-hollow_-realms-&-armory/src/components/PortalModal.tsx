import React from 'react';
import { RegionDef } from '../game/types';
import { X, Compass, MapPin, Sparkles } from 'lucide-react';
import { REGIONS } from '../game/engine';
import { sound } from '../game/audio';

interface PortalModalProps {
  currentRegion: number;
  onClose: () => void;
  onWarp: (regionId: number) => void;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  currentRegion,
  onClose,
  onWarp,
}) => {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xs pointer-events-auto select-none">
      <div className="w-full max-w-xl bg-slate-900 border-2 border-purple-500/60 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-2xl bg-slate-950 border border-slate-800">🔮</span>
            <div>
              <h2 className="text-lg font-display text-purple-400 tracking-wider">
                Ancient Leyline Rift
              </h2>
              <p className="text-xs text-slate-400">
                Step through the portal nexus to teleport to any discovered realm.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Realms Grid */}
        <div className="overflow-y-auto pr-1 flex flex-col gap-2.5">
          {REGIONS.map((r, idx) => {
            const isCurrent = idx === currentRegion;
            return (
              <button
                key={r.id}
                onClick={() => {
                  sound.playPortalWarp();
                  onWarp(r.id);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'border-purple-500 bg-purple-950/30'
                    : 'border-slate-800 bg-slate-950/90 hover:border-purple-500/60 hover:bg-slate-900'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display text-slate-100">
                      {r.name}
                    </span>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-mono font-bold">
                        CURRENT REALM
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Enemies: {r.mobs.join(', ')}
                  </div>
                  <div className="text-[11px] text-amber-400 font-mono mt-1">
                    Champion: <b>{r.bossName}</b> · {r.rec}
                  </div>
                </div>

                <div className="px-4 py-2 rounded-xl bg-purple-500/20 group-hover:bg-purple-500 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold">
                  WARP
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">T</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to close
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display text-xs tracking-wider transition-colors cursor-pointer"
          >
            CANCEL TRAVEL
          </button>
        </div>
      </div>
    </div>
  );
};

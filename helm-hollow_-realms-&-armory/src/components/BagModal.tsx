import React from 'react';
import { PlayerState, Item, ItemSlot } from '../game/types';
import { X, Trash2, Shield, Sparkles, Flame, Snowflake, Zap, Crown } from 'lucide-react';
import { RAR_COLORS, RAR_NAMES, WEAPON_TYPES, ARMOR_SETS, SWORD_STYLES, ELEMENT_INFO, GUN_STYLES } from '../game/engine';
import { sound } from '../game/audio';

interface BagModalProps {
  player: PlayerState;
  damage: number;
  maxHp: number;
  defense: number;
  onClose: () => void;
  onEquip: (idx: number) => void;
  onUnequipOffhand: () => void;
  onUnequipSlot?: (slot: 'head' | 'body' | 'legs' | 'shoes') => void;
  onSellItem: (idx: number) => void;
  onSellJunk: () => void;
}

export const BagModal: React.FC<BagModalProps> = ({
  player,
  damage,
  maxHp,
  defense,
  onClose,
  onEquip,
  onUnequipOffhand,
  onUnequipSlot,
  onSellItem,
  onSellJunk,
}) => {
  const getItemPrice = (it: Item) => Math.round(it.val * (1 + it.rar * 0.8));

  const getItemStatDesc = (it: Item) => {
    if (it.slot === 'weapon' && it.type) {
      let desc = `+${it.val} Power`;
      if (it.gunStyle && GUN_STYLES[it.gunStyle]) {
        desc += ` · ${GUN_STYLES[it.gunStyle].name} (${it.gunStyle === 'smg' ? 'Rapid Spray' : it.gunStyle === 'sniper' ? 'Precision Heavy' : it.gunStyle === 'rifle' ? 'Carbine' : 'Sidearm'})`;
      } else if (it.swordStyle && SWORD_STYLES[it.swordStyle]) {
        desc += ` · ${SWORD_STYLES[it.swordStyle].name}`;
      }
      if (it.element && it.element !== 'none') {
        desc += ` · ${ELEMENT_INFO[it.element].name}`;
      }
      return desc;
    }
    if (it.slot === 'head') {
      return `+${it.val * 2} HP · +${Math.floor(it.val / 3)} Def`;
    }
    if (it.slot === 'body') {
      return `+${it.val * 3} HP · +${Math.floor(it.val / 2)} Def`;
    }
    if (it.slot === 'legs') {
      return `+${Math.round(it.val * 1.5)} HP · +${Math.floor(it.val / 3)} Def`;
    }
    if (it.slot === 'shoes') {
      return `+${it.val} HP · +${Math.floor(it.val / 4)} Def`;
    }
    return `+${it.val} Power`;
  };

  const getSlotIcon = (slot: ItemSlot) => {
    switch (slot) {
      case 'head': return '🪖';
      case 'body': return '🛡️';
      case 'legs': return '👖';
      case 'shoes': return '👢';
      case 'weapon': return '⚔️';
      case 'offhand': return '🗡️';
      default: return '📦';
    }
  };

  const getElementBadge = (elem?: string) => {
    if (!elem || elem === 'none') return null;
    if (elem === 'fire') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-950/80 text-orange-400 border border-orange-600/50">
          <Flame className="w-3 h-3 text-orange-400" /> Fire
        </span>
      );
    }
    if (elem === 'ice') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-950/80 text-sky-400 border border-sky-500/50">
          <Snowflake className="w-3 h-3 text-sky-400" /> Ice
        </span>
      );
    }
    if (elem === 'electric') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-yellow-950/80 text-yellow-300 border border-yellow-500/50">
          <Zap className="w-3 h-3 text-yellow-300" /> Shock
        </span>
      );
    }
    return null;
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xs pointer-events-auto select-none">
      <div className="w-full max-w-3xl bg-slate-900 border-2 border-amber-500/70 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-2xl bg-slate-950 border border-slate-800">🎒</span>
            <div>
              <h2 className="text-lg font-display text-amber-400 tracking-wider">
                Adventurer's Armory & Gear
              </h2>
              <p className="text-xs text-slate-400">
                4-piece armor sets grant powerful synergies. Elemental weapons apply burn, slow, or chain shock!
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

        {/* Currency & Quick Actions Bar */}
        <div className="flex items-center justify-between bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-2xl mb-3">
          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <span className="text-amber-400 tabular-nums">🪙 {player.gold} Gold</span>
            <span className="text-emerald-400 tabular-nums">🪵 {player.wood} Wood Logs</span>
          </div>

          <button
            onClick={() => {
              sound.playCoin();
              onSellJunk();
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Sell Weaker Junk</span>
          </button>
        </div>

        {/* ACTIVE SET BONUS BANNER */}
        {player.activeSetBonus ? (
          <div className="bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-sky-500/20 border border-amber-500/50 p-2.5 rounded-2xl mb-3 flex items-center gap-2.5 text-xs">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-amber-300 font-display">4-PIECE SET BONUS: </span>
              <span className="text-slate-100 font-mono font-bold">{player.activeSetBonus}</span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-950/60 border border-dashed border-slate-800 p-2 rounded-2xl mb-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span>🛡️</span>
            <span>Equip 4 pieces of the same set (Iron, Huntsman, Dragon, or Astral) to unlock a Set Bonus!</span>
          </div>
        )}

        {/* Scrollable Container */}
        <div className="overflow-y-auto pr-1 flex flex-col gap-4">
          {/* EQUIPPED SLOTS (4 Armor + 2 Weapon Slots) */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-2">
              Equipped Loadout (Head · Body · Legs · Shoes · Weapons)
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {/* Head Slot */}
              <div
                onClick={() => player.eq.head && onUnequipSlot && onUnequipSlot('head')}
                className={`p-2.5 rounded-2xl bg-slate-950 border flex items-center gap-2.5 min-w-0 ${player.eq.head ? 'cursor-pointer hover:bg-slate-900 transition-colors' : ''}`}
                style={{ borderColor: RAR_COLORS[player.eq.head?.rar || 0] }}
                title={player.eq.head ? 'Click to unequip to base character head' : undefined}
              >
                <div className="text-xl">🪖</div>
                <div className="flex flex-col min-w-0">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold flex items-center justify-between">
                    <span>Head</span>
                    {player.eq.head && <span className="text-[9px] text-amber-400">Unequip</span>}
                  </div>
                  <div className="text-xs font-bold truncate" style={{ color: RAR_COLORS[player.eq.head?.rar || 0] }}>
                    {player.eq.head?.name || 'Base Head'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {player.eq.head ? getItemStatDesc(player.eq.head) : 'Bare skin head'}
                  </div>
                </div>
              </div>

              {/* Body Slot */}
              <div
                onClick={() => player.eq.body && onUnequipSlot && onUnequipSlot('body')}
                className={`p-2.5 rounded-2xl bg-slate-950 border flex items-center gap-2.5 min-w-0 ${player.eq.body ? 'cursor-pointer hover:bg-slate-900 transition-colors' : ''}`}
                style={{ borderColor: RAR_COLORS[player.eq.body?.rar || 0] }}
                title={player.eq.body ? 'Click to unequip to base character shirt' : undefined}
              >
                <div className="text-xl">🛡️</div>
                <div className="flex flex-col min-w-0">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold flex items-center justify-between">
                    <span>Body</span>
                    {player.eq.body && <span className="text-[9px] text-amber-400">Unequip</span>}
                  </div>
                  <div className="text-xs font-bold truncate" style={{ color: RAR_COLORS[player.eq.body?.rar || 0] }}>
                    {player.eq.body?.name || 'Tattered Shirt'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {player.eq.body ? getItemStatDesc(player.eq.body) : 'White torn sleeveless'}
                  </div>
                </div>
              </div>

              {/* Legs Slot */}
              <div
                onClick={() => player.eq.legs && onUnequipSlot && onUnequipSlot('legs')}
                className={`p-2.5 rounded-2xl bg-slate-950 border flex items-center gap-2.5 min-w-0 ${player.eq.legs ? 'cursor-pointer hover:bg-slate-900 transition-colors' : ''}`}
                style={{ borderColor: RAR_COLORS[player.eq.legs?.rar || 0] }}
                title={player.eq.legs ? 'Click to unequip to base character shorts' : undefined}
              >
                <div className="text-xl">👖</div>
                <div className="flex flex-col min-w-0">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold flex items-center justify-between">
                    <span>Legs</span>
                    {player.eq.legs && <span className="text-[9px] text-amber-400">Unequip</span>}
                  </div>
                  <div className="text-xs font-bold truncate" style={{ color: RAR_COLORS[player.eq.legs?.rar || 0] }}>
                    {player.eq.legs?.name || 'Tattered Shorts'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {player.eq.legs ? getItemStatDesc(player.eq.legs) : 'Denim blue shorts'}
                  </div>
                </div>
              </div>

              {/* Shoes Slot */}
              <div
                onClick={() => player.eq.shoes && onUnequipSlot && onUnequipSlot('shoes')}
                className={`p-2.5 rounded-2xl bg-slate-950 border flex items-center gap-2.5 min-w-0 ${player.eq.shoes ? 'cursor-pointer hover:bg-slate-900 transition-colors' : ''}`}
                style={{ borderColor: RAR_COLORS[player.eq.shoes?.rar || 0] }}
                title={player.eq.shoes ? 'Click to unequip to bare feet' : undefined}
              >
                <div className="text-xl">👢</div>
                <div className="flex flex-col min-w-0">
                  <div className="text-[10px] font-mono uppercase text-slate-500 font-bold flex items-center justify-between">
                    <span>Shoes</span>
                    {player.eq.shoes && <span className="text-[9px] text-amber-400">Unequip</span>}
                  </div>
                  <div className="text-xs font-bold truncate" style={{ color: RAR_COLORS[player.eq.shoes?.rar || 0] }}>
                    {player.eq.shoes?.name || 'Bare Feet'}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {player.eq.shoes ? getItemStatDesc(player.eq.shoes) : 'Unshod agile feet'}
                  </div>
                </div>
              </div>

              {/* Main Weapon */}
              <div
                className="p-2.5 rounded-2xl bg-slate-950 border flex items-center gap-2.5 min-w-0"
                style={{ borderColor: RAR_COLORS[player.eq.weapon.rar] }}
              >
                <div className="text-xl">⚔️</div>
                <div className="flex flex-col min-w-0">
                  <div className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                    <span>Main Hand</span>
                    {getElementBadge(player.eq.weapon.element)}
                  </div>
                  <div className="text-xs font-bold truncate" style={{ color: RAR_COLORS[player.eq.weapon.rar] }}>
                    {player.eq.weapon.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">
                    {getItemStatDesc(player.eq.weapon)}
                  </div>
                </div>
              </div>

              {/* Off-Hand Slot */}
              {player.eq.offhand ? (
                <button
                  onClick={onUnequipOffhand}
                  className="p-2.5 rounded-2xl bg-slate-950 border flex items-center gap-2.5 text-left cursor-pointer hover:bg-slate-900 transition-colors min-w-0"
                  style={{ borderColor: RAR_COLORS[player.eq.offhand.rar] }}
                  title="Click to unequip offhand"
                >
                  <div className="text-xl">🗡️</div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                      <span>Off-Hand</span>
                      {getElementBadge(player.eq.offhand.element)}
                    </div>
                    <div className="text-xs font-bold truncate" style={{ color: RAR_COLORS[player.eq.offhand.rar] }}>
                      {player.eq.offhand.name}
                    </div>
                    <div className="text-[10px] text-amber-400 font-mono font-bold">
                      ✦ Click to Unequip
                    </div>
                  </div>
                </button>
              ) : (
                <div className="p-2.5 rounded-2xl bg-slate-950/40 border border-dashed border-slate-700 flex items-center gap-2.5 opacity-70 min-w-0">
                  <div className="text-xl">🗡️</div>
                  <div className="flex flex-col min-w-0">
                    <div className="text-[10px] font-mono uppercase text-slate-500 font-bold">Off-Hand</div>
                    <div className="text-xs font-bold text-slate-400">Empty</div>
                    <div className="text-[10px] text-slate-500 font-mono">1-Hand dual-wield</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* COMBAT STATS STRIP */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-4 gap-2 text-center text-xs font-mono">
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Damage</div>
              <div className="text-amber-400 font-bold tabular-nums text-sm">{damage}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Max HP</div>
              <div className="text-emerald-400 font-bold tabular-nums text-sm">{maxHp}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Defense</div>
              <div className="text-sky-400 font-bold tabular-nums text-sm">{defense}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase">Kills</div>
              <div className="text-purple-400 font-bold tabular-nums text-sm">{player.kills}</div>
            </div>
          </div>

          {/* INVENTORY ITEMS */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-2">
              Backpack Inventory ({player.inv.length}/24)
            </div>

            {player.inv.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-2xl">
                Your backpack is empty. Defeat monsters and fell trees to collect weapons and armor!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {player.inv.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950 border flex items-center justify-between gap-2.5 group hover:border-slate-600 transition-colors"
                    style={{ borderColor: RAR_COLORS[it.rar] }}
                  >
                    <button
                      onClick={() => onEquip(idx)}
                      className="flex items-center gap-2.5 text-left min-w-0 flex-1 cursor-pointer"
                    >
                      <div className="text-lg shrink-0">
                        {getSlotIcon(it.slot)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <div className="text-xs font-bold truncate group-hover:underline flex items-center gap-1.5" style={{ color: RAR_COLORS[it.rar] }}>
                          <span className="truncate">{it.name}</span>
                          {getElementBadge(it.element)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono truncate">
                          {RAR_NAMES[it.rar]} · {getItemStatDesc(it)}
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => onSellItem(idx)}
                      className="px-2 py-1 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-amber-300 transition-colors shrink-0 cursor-pointer"
                    >
                      +{getItemPrice(it)}g
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">B</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to return
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display text-xs tracking-wider transition-colors cursor-pointer shadow-md"
          >
            CLOSE BAG
          </button>
        </div>
      </div>
    </div>
  );
};

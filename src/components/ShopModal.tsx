import React, { useState } from 'react';
import { PlayerState, WeaponType, WeaponElement, ItemSlot, ArmorSet, GunStyle } from '../game/types';
import { X, Store, Coins, Flame, Snowflake, Zap, Shield } from 'lucide-react';
import { RAR_COLORS, RAR_NAMES, WEAPON_TYPES, ARMOR_SETS, SWORD_STYLES, ELEMENT_INFO, GUN_STYLES } from '../game/engine';
import { sound } from '../game/audio';

interface ShopModalProps {
  player: PlayerState;
  onClose: () => void;
  onSellWood: (qty: number) => void;
  onBuyItem: (
    slot: ItemSlot,
    type?: WeaponType,
    elem?: WeaponElement,
    armorSet?: ArmorSet,
    swordStyle?: any,
    price?: number,
    gunStyle?: GunStyle
  ) => void;
}

interface ShopItemEntry {
  slot: ItemSlot;
  name: string;
  desc: string;
  basePrice: number;
  type?: WeaponType;
  element?: WeaponElement;
  armorSet?: ArmorSet;
  swordStyle?: 'arming' | 'broadsword' | 'scimitar' | 'katana' | 'claymore' | 'rapier';
  gunStyle?: GunStyle;
  rar: 1 | 2 | 3;
}

const SHOP_CATALOG: ShopItemEntry[] = [
  // Guns (Pistol, SMG, Rifle, Sniper)
  { slot: 'weapon', type: 'gun', gunStyle: 'pistol', element: 'none', rar: 1, name: 'Flintlock Pistol', desc: 'Compact quick-draw pistol · High agility & brisk fire rate', basePrice: 85 },
  { slot: 'weapon', type: 'gun', gunStyle: 'smg', element: 'electric', rar: 2, name: 'Repeater SMG', desc: 'Rapid cycling repeater spray with chain shock discharge', basePrice: 175 },
  { slot: 'weapon', type: 'gun', gunStyle: 'rifle', element: 'fire', rar: 2, name: 'Lever Carbine Rifle', desc: 'Walnut stock carbine · Steady medium fire rate & fire burns', basePrice: 190 },
  { slot: 'weapon', type: 'gun', gunStyle: 'sniper', element: 'ice', rar: 3, name: 'Sharpshooter Sniper', desc: 'Heavy fluted sniper rifle · Long range precision & frost freeze', basePrice: 260 },

  // Swords & Elemental Blades
  { slot: 'weapon', type: 'sword', swordStyle: 'katana', element: 'electric', rar: 2, name: 'Voltaic Katana', desc: 'Folded razor edge with chain lightning discharge', basePrice: 160 },
  { slot: 'weapon', type: 'sword', swordStyle: 'scimitar', element: 'fire', rar: 2, name: 'Flaming Crescent Scimitar', desc: 'Curved desert blade that burns enemies over time', basePrice: 150 },
  { slot: 'weapon', type: 'sword', swordStyle: 'broadsword', element: 'ice', rar: 2, name: 'Glacial Highland Broadsword', desc: 'Heavy basket-hilted blade with freezing frost slow', basePrice: 150 },
  { slot: 'weapon', type: 'greatsword', swordStyle: 'claymore', element: 'fire', rar: 3, name: 'Inferno Great Claymore', desc: '2-handed colossal Scottish cleave with fire explosions', basePrice: 240 },
  { slot: 'weapon', type: 'sword', swordStyle: 'rapier', element: 'none', rar: 1, name: 'Fine Fencing Rapier', desc: 'Needle-point dueling rapier with high critical precision', basePrice: 95 },
  { slot: 'weapon', type: 'sword', swordStyle: 'arming', element: 'none', rar: 1, name: 'Sturdy Arming Sword', desc: 'Classic balanced knightly cruciform sword', basePrice: 70 },
  // Other Weapons
  { slot: 'weapon', type: 'handaxe', element: 'none', rar: 1, name: 'Huntsman Hatchet', desc: '1-handed fast downward chop (3x wood damage)', basePrice: 85 },
  { slot: 'weapon', type: 'bow', element: 'ice', rar: 2, name: 'Frostwind Recurve Bow', desc: 'Ranged ballistic freezing arrows', basePrice: 160 },

  // 4 Armor Sets (Iron, Huntsman, Dragon, Astral)
  { slot: 'head', armorSet: 'iron', rar: 1, name: 'Iron Greathelm', desc: 'Iron Knight (Head) · Bucket helm with red plume', basePrice: 80 },
  { slot: 'body', armorSet: 'iron', rar: 1, name: 'Iron Plate Cuirass', desc: 'Iron Knight (Body) · Deflecting center ridge plate', basePrice: 100 },
  { slot: 'legs', armorSet: 'iron', rar: 1, name: 'Iron Greaves', desc: 'Iron Knight (Legs) · Steel roundel knee-cops', basePrice: 75 },
  { slot: 'shoes', armorSet: 'iron', rar: 1, name: 'Iron Sabatons', desc: 'Iron Knight (Shoes) · Articulated metal sabatons', basePrice: 70 },

  { slot: 'head', armorSet: 'huntsman', rar: 1, name: 'Ranger Cowl', desc: 'Huntsman (Head) · Green cowl hood with feather', basePrice: 90 },
  { slot: 'body', armorSet: 'huntsman', rar: 1, name: 'Huntsman Leather Tunic', desc: 'Huntsman (Body) · Quiver straps & brass ring', basePrice: 110 },
  { slot: 'legs', armorSet: 'huntsman', rar: 1, name: 'Hunter Chaps', desc: 'Huntsman (Legs) · Leather studded knee chaps', basePrice: 85 },
  { slot: 'shoes', armorSet: 'huntsman', rar: 1, name: 'Stalker Prowler Boots', desc: 'Huntsman (Shoes) · Laced prowler boots with cuffs', basePrice: 80 },

  { slot: 'head', armorSet: 'dragon', rar: 2, name: 'Dragon Horned Helm', desc: 'Dragon Slayer (Head) · Swept bone horns & molten slit', basePrice: 170 },
  { slot: 'body', armorSet: 'dragon', rar: 2, name: 'Dragonscale Cuirass', desc: 'Dragon Slayer (Body) · Wyrmscale plate & glowing rune', basePrice: 210 },
  { slot: 'legs', armorSet: 'dragon', rar: 2, name: 'Dragonplate Greaves', desc: 'Dragon Slayer (Legs) · Spiked knee-cops & scale plates', basePrice: 160 },
  { slot: 'shoes', armorSet: 'dragon', rar: 2, name: 'Wyrmscale Sabatons', desc: 'Dragon Slayer (Shoes) · Dragon claw sabatons', basePrice: 150 },

  { slot: 'head', armorSet: 'astral', rar: 3, name: 'Astral Diadem', desc: 'Astral Paladin (Head) · Third-eye sapphire & floating halo', basePrice: 220 },
  { slot: 'body', armorSet: 'astral', rar: 3, name: 'Astral Hauberk', desc: 'Astral Paladin (Body) · Cosmic void-weave & stars', basePrice: 260 },
  { slot: 'legs', armorSet: 'astral', rar: 3, name: 'Starforged Greaves', desc: 'Astral Paladin (Legs) · Glowing diamond poleyns', basePrice: 200 },
  { slot: 'shoes', armorSet: 'astral', rar: 3, name: 'Voidstride Boots', desc: 'Astral Paladin (Shoes) · Celestial hover wing boots', basePrice: 190 },
];

export const ShopModal: React.FC<ShopModalProps> = ({
  player,
  onClose,
  onSellWood,
  onBuyItem,
}) => {
  const [tab, setTab] = useState<'weapons' | 'armor'>('weapons');

  const filteredCatalog = SHOP_CATALOG.filter(it => tab === 'weapons' ? it.slot === 'weapon' : it.slot !== 'weapon');

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-xs pointer-events-auto select-none">
      <div className="w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/70 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-2xl bg-slate-950 border border-slate-800">🧔</span>
            <div>
              <h2 className="text-lg font-display text-emerald-400 tracking-wider">
                Gimbal's Merchant Outpost
              </h2>
              <p className="text-xs text-slate-400 italic">
                "Welcome traveler! Browse my forged swords, elemental blades, and 4-piece armor sets!"
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

        {/* Currency & Timber Trade Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2.5 rounded-2xl mb-3">
          <div className="flex items-center gap-4 text-xs font-mono font-bold">
            <span className="text-amber-400 tabular-nums">🪙 {player.gold} Gold</span>
            <span className="text-emerald-400 tabular-nums">🪵 {player.wood} Wood Logs</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSellWood(1)}
              disabled={player.wood <= 0}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                player.wood > 0
                  ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              Sell 1 Log (+15g)
            </button>

            <button
              onClick={() => onSellWood(player.wood)}
              disabled={player.wood <= 0}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer ${
                player.wood > 0
                  ? 'border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50'
                  : 'border-slate-800 bg-slate-900/40 text-slate-600 cursor-not-allowed opacity-50'
              }`}
            >
              Sell All (+{player.wood * 15}g)
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setTab('weapons')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              tab === 'weapons'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚔️ Weapons & Elemental Blades
          </button>
          <button
            onClick={() => setTab('armor')}
            className={`px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              tab === 'armor'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            🛡️ 4-Piece Armor Sets
          </button>
        </div>

        {/* Armory Shop Inventory */}
        <div className="overflow-y-auto pr-1 flex flex-col gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredCatalog.map((item, idx) => {
              const price = Math.round(item.basePrice * (1 + player.lvl * 0.05));
              const canAfford = player.gold >= price && player.inv.length < 24;

              return (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 group hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5 truncate">
                      <span className="truncate">{item.name}</span>
                      {item.element === 'fire' && <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />}
                      {item.element === 'ice' && <Snowflake className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                      {item.element === 'electric' && <Zap className="w-3.5 h-3.5 text-yellow-300 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5 truncate">
                      {item.desc}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono mt-1">
                      {RAR_NAMES[item.rar]} · {item.slot.toUpperCase()}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (canAfford) {
                        sound.playCoin();
                        onBuyItem(item.slot, item.type, item.element, item.armorSet, item.swordStyle, price, item.gunStyle);
                      }
                    }}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      canAfford
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    Buy {price}g
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">E</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Esc</kbd> to leave
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display text-xs tracking-wider transition-colors cursor-pointer"
          >
            EXIT OUTPOST
          </button>
        </div>
      </div>
    </div>
  );
};

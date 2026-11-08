import { useState, useRef, useCallback, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { TitleScreen } from './components/TitleScreen';
import { HUD } from './components/HUD';
import { BagModal } from './components/BagModal';
import { ShopModal } from './components/ShopModal';
import { PortalModal } from './components/PortalModal';
import { PauseModal } from './components/PauseModal';
import { HelmEngine, REGIONS, WEAPON_TYPES, ARMOR_SETS } from './game/engine';
import { GameState, PlayerState, WeaponType, WeaponElement, ItemSlot, ArmorSet, Item } from './game/types';
import { sound } from './game/audio';

export default function App() {
  const engineRef = useRef<HelmEngine | null>(null);

  // High-level state
  const [gameState, setGameState] = useState<GameState>('TITLE');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  // Player state synced with React UI
  const [playerData, setPlayerData] = useState<PlayerState>({
    x: 80,
    y: 350,
    w: 22,
    h: 36,
    vx: 0,
    vy: 0,
    ground: false,
    face: 1,
    hp: 75,
    maxHp: 75,
    lvl: 1,
    xp: 0,
    nextXp: 40,
    gold: 120,
    wood: 0,
    ore: 0,
    kills: 0,
    dashCooldown: 0,
    invulnerableTimer: 0,
    combo: 0,
    comboTimer: 0,
    eq: {
      head: { id: '1', slot: 'head', rar: 0, val: 5, name: 'Iron Greathelm', armorSet: 'iron' },
      body: { id: '2', slot: 'body', rar: 0, val: 5, name: 'Iron Plate Cuirass', armorSet: 'iron' },
      legs: { id: '3', slot: 'legs', rar: 0, val: 5, name: 'Iron Greaves', armorSet: 'iron' },
      shoes: { id: '4', slot: 'shoes', rar: 0, val: 5, name: 'Iron Sabatons', armorSet: 'iron' },
      weapon: { id: '5', slot: 'weapon', rar: 1, val: 8, name: 'Flaming Arming Sword', type: 'sword', element: 'fire', swordStyle: 'arming' },
      offhand: null,
    },
    inv: [],
    isAttacking: false,
    attackDuration: 0.32,
    attackTimer: 0,
    weaponType: 'sword',
    offhandType: null,
    activeSetBonus: 'Iron Bastion: +25% Defense & Heavy Fortitude',
  });

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMsg(null);
    }, 2400);
  }, []);

  const handleEngineReady = useCallback((engine: HelmEngine) => {
    engineRef.current = engine;
  }, []);

  const handleStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
  }, []);

  const handlePlayerUpdate = useCallback((p: PlayerState) => {
    setPlayerData({
      ...p,
      eq: { ...p.eq },
      inv: [...p.inv],
    });
  }, []);

  const handleStartGame = () => {
    if (engineRef.current) {
      engineRef.current.state = 'PLAYING';
      setGameState('PLAYING');
      showToast('Welcome to Helm Hollow! Press B for Bag, E for Shop.');
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  // Touch control relay
  const handleTouchAction = (action: 'l' | 'r' | 'j' | 'a' | 'd' | 'c', active: boolean) => {
    if (!engineRef.current) return;
    engineRef.current.touch[action] = active ? 1 : 0;
    if (active) {
      if (action === 'j' && engineRef.current.player.ground) {
        engineRef.current.player.vy = -560;
        engineRef.current.player.ground = false;
        sound.playJump();
      }
      if (action === 'a') {
        engineRef.current.triggerAttack();
      }
      if (action === 'c') {
        engineRef.current.triggerTreeChop();
      }
      if (action === 'd') {
        engineRef.current.triggerDash();
      }
    }
  };

  // Bag handlers
  const handleEquipItem = (idx: number) => {
    if (!engineRef.current) return;
    const it = engineRef.current.player.inv[idx];
    if (!it) return;

    if (it.slot === 'weapon') {
      const wDef = WEAPON_TYPES[it.type || 'sword'];
      if (wDef.hand === 'two') {
        // Unequip offhand if 2-handed weapon equipped
        if (engineRef.current.player.eq.offhand) {
          engineRef.current.player.inv.push(engineRef.current.player.eq.offhand);
          engineRef.current.player.eq.offhand = null;
          showToast('Off-hand unequipped for 2-handed grip.');
        }
        const oldW = engineRef.current.player.eq.weapon;
        engineRef.current.player.eq.weapon = it;
        engineRef.current.player.inv.splice(idx, 1);
        if (oldW) engineRef.current.player.inv.push(oldW);
        showToast(`Equipped 2-Handed ${it.name}!`);
      } else {
        // 1-Handed weapon: equip in off-hand if main is 1-handed and offhand is empty!
        const mainW = engineRef.current.player.eq.weapon;
        const mainDef = WEAPON_TYPES[mainW.type || 'sword'];
        if (mainDef.hand === 'one' && !engineRef.current.player.eq.offhand) {
          engineRef.current.player.eq.offhand = it;
          engineRef.current.player.inv.splice(idx, 1);
          showToast(`Dual-Wielding! Equipped ${it.name} in Off-Hand!`);
        } else {
          const oldW = engineRef.current.player.eq.weapon;
          engineRef.current.player.eq.weapon = it;
          engineRef.current.player.inv.splice(idx, 1);
          if (oldW) engineRef.current.player.inv.push(oldW);
          showToast(`Equipped ${it.name} in Main Hand!`);
        }
      }
    } else {
      // 4 Armor slots: head, body, legs, shoes
      const slot = it.slot as 'head' | 'body' | 'legs' | 'shoes';
      const old = engineRef.current.player.eq[slot];
      engineRef.current.player.eq[slot] = it;
      engineRef.current.player.inv.splice(idx, 1);
      if (old) engineRef.current.player.inv.push(old);
      sound.playEquipArmor();
      showToast(`Equipped ${it.name}!`);
    }

    // Recheck Set Bonus
    const bonus = engineRef.current.checkSetBonus();
    if (bonus) {
      showToast(`✨ SET BONUS ACTIVATED: ${bonus}`);
    }

    // Recalculate Max HP & stats
    engineRef.current.player.maxHp = engineRef.current.calculateMaxHp();
    engineRef.current.player.hp = Math.min(engineRef.current.player.hp, engineRef.current.player.maxHp);

    setPlayerData({
      ...engineRef.current.player,
      eq: { ...engineRef.current.player.eq },
      inv: [...engineRef.current.player.inv],
    });
  };

  const handleUnequipOffhand = () => {
    if (!engineRef.current || !engineRef.current.player.eq.offhand) return;
    if (engineRef.current.player.inv.length >= 24) {
      showToast('Backpack is full!');
      return;
    }
    const off = engineRef.current.player.eq.offhand;
    engineRef.current.player.eq.offhand = null;
    engineRef.current.player.inv.push(off);
    sound.playCoin();
    showToast(`Unequipped ${off.name} to backpack.`);
    setPlayerData({
      ...engineRef.current.player,
      eq: { ...engineRef.current.player.eq },
      inv: [...engineRef.current.player.inv],
    });
  };

  const handleUnequipSlot = (slot: 'head' | 'body' | 'legs' | 'shoes') => {
    if (!engineRef.current || !engineRef.current.player.eq[slot]) return;
    if (engineRef.current.player.inv.length >= 24) {
      showToast('Backpack is full!');
      return;
    }
    const item = engineRef.current.player.eq[slot]!;
    engineRef.current.player.eq[slot] = null;
    engineRef.current.player.inv.push(item);
    sound.playEquipArmor();
    showToast(`Unequipped ${item.name} (revealing base character ${slot === 'head' ? 'head' : slot === 'body' ? 'shirt' : slot === 'legs' ? 'shorts' : 'feet'})`);

    // Recheck Set Bonus & update stats
    engineRef.current.checkSetBonus();
    engineRef.current.player.maxHp = engineRef.current.calculateMaxHp();
    engineRef.current.player.hp = Math.min(engineRef.current.player.hp, engineRef.current.player.maxHp);

    setPlayerData({
      ...engineRef.current.player,
      eq: { ...engineRef.current.player.eq },
      inv: [...engineRef.current.player.inv],
    });
  };

  const handleSellItem = (idx: number) => {
    if (!engineRef.current) return;
    const it = engineRef.current.player.inv[idx];
    if (!it) return;
    const price = Math.round(it.val * (1 + it.rar * 0.8));
    engineRef.current.player.gold += price;
    engineRef.current.player.inv.splice(idx, 1);
    sound.playCoin();
    showToast(`Sold ${it.name} for +${price} gold!`);
    setPlayerData({
      ...engineRef.current.player,
      inv: [...engineRef.current.player.inv],
    });
  };

  const handleSellJunk = () => {
    if (!engineRef.current) return;
    let earned = 0;
    const keep: Item[] = [];
    engineRef.current.player.inv.forEach(it => {
      const equippedVal = it.slot === 'weapon'
        ? engineRef.current!.player.eq.weapon.val
        : (engineRef.current!.player.eq[it.slot]?.val || 0);

      if (it.val <= equippedVal && it.rar <= 1) {
        earned += Math.round(it.val * (1 + it.rar * 0.8));
      } else {
        keep.push(it);
      }
    });

    engineRef.current.player.inv = keep;
    engineRef.current.player.gold += earned;
    sound.playCoin();
    showToast(`Sold weaker gear for +${earned} gold!`);
    setPlayerData({
      ...engineRef.current.player,
      inv: [...keep],
    });
  };

  // Shop handlers
  const handleSellWood = (qty: number) => {
    if (!engineRef.current || engineRef.current.player.wood <= 0) return;
    const actualQty = Math.min(engineRef.current.player.wood, qty);
    const earnings = actualQty * 15;
    engineRef.current.player.wood -= actualQty;
    engineRef.current.player.gold += earnings;
    sound.playCoin();
    showToast(`Sold ${actualQty} timber log${actualQty > 1 ? 's' : ''} to Gimbal for +${earnings} gold!`);
    setPlayerData({
      ...engineRef.current.player,
    });
  };

  const handleBuyShopItem = (
    slot: ItemSlot,
    type?: WeaponType,
    elem?: WeaponElement,
    armorSet?: ArmorSet,
    swordStyle?: any,
    price?: number,
    gunStyle?: any
  ) => {
    if (!engineRef.current) return;
    const itemPrice = price || 100;
    if (engineRef.current.player.gold < itemPrice) {
      showToast('Not enough gold!');
      return;
    }
    if (engineRef.current.player.inv.length >= 24) {
      showToast('Backpack is full!');
      return;
    }

    engineRef.current.player.gold -= itemPrice;
    const it = engineRef.current.createItem(slot, 2, type, elem, armorSet, swordStyle, gunStyle);
    engineRef.current.player.inv.push(it);
    sound.playLevelUp();
    showToast(`Purchased ${it.name}! Check backpack to equip.`);
    setPlayerData({
      ...engineRef.current.player,
      inv: [...engineRef.current.player.inv],
    });
  };

  // Portal handler
  const handleWarp = (regionId: number) => {
    if (!engineRef.current) return;
    engineRef.current.enterRegion(regionId);
    engineRef.current.state = 'PLAYING';
    setGameState('PLAYING');
    sound.playPortalWarp();
    showToast(`Teleported to ${REGIONS[regionId].name}`);
  };

  const currentRegionDef = REGIONS[engineRef.current?.currentRegion || 0] || REGIONS[0];
  const dmg = engineRef.current ? engineRef.current.calculateDamage() : 30;
  const maxHp = engineRef.current ? engineRef.current.calculateMaxHp() : 75;
  const def = engineRef.current ? engineRef.current.calculateDefense() : 8;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0d141b] font-sans">
      {/* 60FPS ISOLATED SIMULATION CANVAS */}
      <GameCanvas
        onEngineReady={handleEngineReady}
        onStateChange={handleStateChange}
        onPlayerUpdate={handlePlayerUpdate}
        onToast={showToast}
      />

      {/* GAME SHELL STATES */}
      {gameState === 'TITLE' && (
        <TitleScreen
          onStart={handleStartGame}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {gameState !== 'TITLE' && (
        <HUD
          player={playerData}
          region={currentRegionDef}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          toastMsg={toastMsg}
          onOpenBag={() => {
            sound.playShopBell();
            setGameState('BAG');
          }}
          onOpenShop={() => {
            sound.playShopBell();
            setGameState('SHOP');
          }}
          onOpenPortal={() => {
            sound.playPortalWarp();
            setGameState('PORTAL');
          }}
          onTouchAction={handleTouchAction}
        />
      )}

      {/* IN-GAME EQUIPMENT & BAG MODAL */}
      {gameState === 'BAG' && (
        <BagModal
          player={playerData}
          damage={dmg}
          maxHp={maxHp}
          defense={def}
          onClose={() => {
            setGameState('PLAYING');
            if (engineRef.current) engineRef.current.state = 'PLAYING';
          }}
          onEquip={handleEquipItem}
          onUnequipOffhand={handleUnequipOffhand}
          onUnequipSlot={handleUnequipSlot}
          onSellItem={handleSellItem}
          onSellJunk={handleSellJunk}
        />
      )}

      {/* IN-GAME MERCHANT SHOP MODAL */}
      {gameState === 'SHOP' && (
        <ShopModal
          player={playerData}
          onClose={() => {
            setGameState('PLAYING');
            if (engineRef.current) engineRef.current.state = 'PLAYING';
          }}
          onSellWood={handleSellWood}
          onBuyItem={handleBuyShopItem}
        />
      )}

      {/* IN-GAME REALM PORTAL MODAL */}
      {gameState === 'PORTAL' && (
        <PortalModal
          currentRegion={engineRef.current?.currentRegion || 0}
          onClose={() => {
            setGameState('PLAYING');
            if (engineRef.current) engineRef.current.state = 'PLAYING';
          }}
          onWarp={handleWarp}
        />
      )}

      {/* PAUSE MODAL */}
      {gameState === 'PAUSED' && (
        <PauseModal
          onResume={() => {
            setGameState('PLAYING');
            if (engineRef.current) engineRef.current.state = 'PLAYING';
          }}
          onRestart={() => {
            if (engineRef.current) {
              engineRef.current.enterRegion(0);
              engineRef.current.state = 'PLAYING';
              setGameState('PLAYING');
            }
          }}
          onReturnToTitle={() => {
            if (engineRef.current) {
              engineRef.current.state = 'TITLE';
              setGameState('TITLE');
            }
          }}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}
    </div>
  );
}

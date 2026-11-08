import {
  GameState, WeaponType, WeaponElement, ItemSlot, ArmorSet, Rarity, WeaponDef, Item,
  PlayerState, RegionDef, MobDef, EnemyEntity, TreeEntity,
  ProjectileEntity, PickupEntity, ParticleEntity, FloatingTextEntity,
  SolidPlatform, OneWayPlatform, GunStyle, Ramp
} from './types';
import { sound } from './audio';

const TAU = Math.PI * 2;
export const RAR_NAMES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
export const RAR_COLORS = ['#b8b2a6', '#6fbf73', '#5aa0e6', '#b46be0', '#f0b030', '#ff4757'];

export interface ArmorSetDef {
  id: ArmorSet;
  name: string;
  bonusName: string;
  bonusDesc: string;
  color: string;
  trimColor: string;
  pieces: {
    head: string;
    body: string;
    legs: string;
    shoes: string;
  };
}

export const ARMOR_SETS: { [key in ArmorSet]: ArmorSetDef } = {
  iron: {
    id: 'iron',
    name: 'Iron Knight',
    bonusName: 'Iron Bastion',
    bonusDesc: '+25% Defense & Heavy Fortitude',
    color: '#94a3b8',
    trimColor: '#e2e8f0',
    pieces: {
      head: 'Iron Greathelm',
      body: 'Iron Plate Cuirass',
      legs: 'Iron Greaves',
      shoes: 'Iron Sabatons',
    },
  },
  huntsman: {
    id: 'huntsman',
    name: 'Huntsman Ranger',
    bonusName: 'Windrunner',
    bonusDesc: '+22% Move Speed & +12% Crit Rate',
    color: '#226538',
    trimColor: '#d97706',
    pieces: {
      head: 'Ranger Cowl',
      body: 'Huntsman Leather Tunic',
      legs: 'Hunter Chaps',
      shoes: 'Stalker Prowler Boots',
    },
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon Slayer',
    bonusName: 'Dragon Fury',
    bonusDesc: '+30% Attack Power & Fiery Thorns',
    color: '#b91c1c',
    trimColor: '#fbbf24',
    pieces: {
      head: 'Dragon Horned Helm',
      body: 'Dragonscale Cuirass',
      legs: 'Dragonplate Greaves',
      shoes: 'Wyrmscale Sabatons',
    },
  },
  astral: {
    id: 'astral',
    name: 'Astral Paladin',
    bonusName: 'Starlight Grace',
    bonusDesc: '+50 Max HP & Passive HP Regen',
    color: '#38bdf8',
    trimColor: '#c084fc',
    pieces: {
      head: 'Astral Diadem',
      body: 'Astral Hauberk',
      legs: 'Starforged Greaves',
      shoes: 'Voidstride Boots',
    },
  },
};

export interface SwordStyleDef {
  id: 'arming' | 'broadsword' | 'scimitar' | 'katana' | 'claymore' | 'rapier';
  name: string;
  desc: string;
  reachBonus: number;
  critBonus: number;
}

export const SWORD_STYLES: { [key: string]: SwordStyleDef } = {
  arming: { id: 'arming', name: 'Arming Sword', desc: 'Cruciform blade with balanced reach and guard', reachBonus: 0, critBonus: 0 },
  broadsword: { id: 'broadsword', name: 'Highland Broadsword', desc: 'Heavy basket-hilted wide cutting blade', reachBonus: 6, critBonus: 0.05 },
  scimitar: { id: 'scimitar', name: 'Crescent Scimitar', desc: 'Curved slashing blade with swift follow-through', reachBonus: 2, critBonus: 0.08 },
  katana: { id: 'katana', name: 'Folded Steel Katana', desc: 'Razor single-edged blade with high critical precision', reachBonus: 8, critBonus: 0.14 },
  claymore: { id: 'claymore', name: 'Great Claymore', desc: 'Colossal two-handed Scottish blade with crushing momentum', reachBonus: 24, critBonus: 0.06 },
  rapier: { id: 'rapier', name: 'Fencing Rapier', desc: 'Needle-point dueling sword with swept wire hilt', reachBonus: 12, critBonus: 0.12 },
};

export interface GunStyleDef {
  id: GunStyle;
  name: string;
  desc: string;
  dmgMult: number;     // guns slightly less damage than other weapons
  durMult: number;     // attack duration
  cdMult: number;      // rate of fire
  reach: number;
  speed: number;       // bullet speed
  recoil: number;
  hand: 'one' | 'two';
}

export const GUN_STYLES: { [key in GunStyle]: GunStyleDef } = {
  pistol: {
    id: 'pistol',
    name: 'Flintlock Pistol',
    desc: 'Compact quick-draw pistol with swift trigger and balanced fire rate',
    dmgMult: 0.70,     // slightly less than sword (1.0)
    durMult: 0.65,     // 0.21s fast trigger
    cdMult: 0.60,
    reach: 380,
    speed: 950,
    recoil: 35,
    hand: 'one',
  },
  smg: {
    id: 'smg',
    name: 'Repeater SMG',
    desc: 'Rapid-cycling repeater spray with high fire rate and light bullet impact',
    dmgMult: 0.42,     // rapid light spray
    durMult: 0.38,     // 0.12s ultra-rapid fire
    cdMult: 0.35,
    reach: 330,
    speed: 1080,
    recoil: 20,
    hand: 'one',
  },
  rifle: {
    id: 'rifle',
    name: 'Lever Carbine Rifle',
    desc: 'Long rifled barrel carbine with steady medium fire rate and range',
    dmgMult: 0.90,     // medium rifle power (still less than heavy melee)
    durMult: 0.92,     // 0.30s medium fire rate
    cdMult: 0.85,
    reach: 490,
    speed: 1200,
    recoil: 60,
    hand: 'two',
  },
  sniper: {
    id: 'sniper',
    name: 'Sharpshooter Sniper',
    desc: 'Heavy long-range precision rifle with high single-shot impact and slow fire rate',
    dmgMult: 1.38,     // hard hitting for a gun, but less than colossal greatswords/hammers (1.85 - 2.3)
    durMult: 1.55,     // 0.50s slow fire rate
    cdMult: 1.50,
    reach: 650,
    speed: 1550,
    recoil: 110,
    hand: 'two',
  },
};

export const ELEMENT_INFO: { [key in WeaponElement]: { color: string; trail: string; hit: string; name: string; icon: string; desc: string } } = {
  none: { color: 'rgba(255,255,255,0)', trail: 'rgba(255,255,255,0.7)', hit: '#fff', name: 'Physical', icon: '⚔️', desc: 'Standard kinetic impact' },
  fire: { color: '#ff5722', trail: 'rgba(255, 87, 34, 0.9)', hit: '#ff5722', name: 'Fire', icon: '🔥', desc: 'Burns targets with burning DoT ticks' },
  ice: { color: '#38bdf8', trail: 'rgba(56, 189, 248, 0.9)', hit: '#38bdf8', name: 'Ice', icon: '❄️', desc: 'Slows enemy movement by 65%' },
  electric: { color: '#facc15', trail: 'rgba(250, 204, 21, 0.95)', hit: '#facc15', name: 'Electric', icon: '⚡', desc: 'Discharges chain lightning to nearby targets' },
};

export const WEAPON_TYPES: { [key in WeaponType]: WeaponDef } = {
  dagger: { name: 'Rogue Knife', dmg: 0.65, reach: 42, dur: 0.20, cd: 0.22, crit: 0.30, desc: 'Rapid twin jabs', base: 35, srar: 1, w1: 0.1, hitK: 0.3, anim: 'dagger', hand: 'one' },
  sword: { name: 'Arming Sword', dmg: 1.0, reach: 62, dur: 0.32, cd: 0.36, crit: 0.14, desc: 'Balanced horizontal slash', base: 55, srar: 1, w1: 0.25, hitK: 0.4, anim: 'sword', hand: 'one', swordStyle: 'arming' },
  greatsword: { name: 'Dragon Claymore', dmg: 1.85, reach: 92, dur: 0.55, cd: 0.72, crit: 0.20, desc: '2-handed massive overhead cleave', base: 170, srar: 2, w1: 0.42, hitK: 0.6, anim: 'greatsword', hand: 'two', swordStyle: 'claymore' },
  handaxe: { name: 'Huntsman Hatchet', dmg: 1.25, reach: 54, dur: 0.34, cd: 0.42, crit: 0.22, desc: '1-handed fast downward chop', base: 95, srar: 1, w1: 0.28, hitK: 0.48, anim: 'handaxe', hand: 'one' },
  battleaxe: { name: 'Executioner Greataxe', dmg: 2.1, reach: 78, dur: 0.58, cd: 0.80, crit: 0.32, desc: '2-handed giant double-blade spin', base: 210, srar: 2, w1: 0.44, hitK: 0.65, anim: 'battleaxe', hand: 'two' },
  spear: { name: 'Knight Longspear', dmg: 1.15, reach: 105, dur: 0.32, cd: 0.44, crit: 0.15, desc: 'Long piercing thrust lunge', base: 110, srar: 2, w1: 0.15, hitK: 0.35, anim: 'spear', hand: 'two', thrust: true },
  hammer: { name: 'Crag War Hammer', dmg: 2.3, reach: 62, dur: 0.62, cd: 0.88, crit: 0.12, desc: '2-handed heavy slam with shockwave', base: 250, srar: 3, w1: 0.5, hitK: 0.7, anim: 'hammer', hand: 'two' },
  scythe: { name: 'Reaper Scythe', dmg: 1.35, reach: 88, dur: 0.42, cd: 0.52, crit: 0.18, desc: 'Wide sweeping harvest arc', base: 240, srar: 3, w1: 0.35, hitK: 0.5, anim: 'scythe', hand: 'two' },
  bow: { name: 'Elven Recurve Bow', dmg: 1.2, reach: 320, dur: 0.45, cd: 0.48, crit: 0.25, desc: 'Ranged ballistic arrow projectile', base: 140, srar: 2, w1: 0.3, hitK: 0.35, anim: 'bow', hand: 'two', ranged: 'arrow' },
  gun: { name: 'Flintlock Pistol', dmg: 0.85, reach: 400, dur: 0.32, cd: 0.45, crit: 0.25, desc: 'Ranged powder shot with firearm styles', base: 180, srar: 2, w1: 0.22, hitK: 0.25, anim: 'gun', hand: 'one', ranged: 'bullet', gunStyle: 'pistol' },
};

export const REGIONS: RegionDef[] = [
  {
    id: 0,
    name: 'Sunny Meadow',
    sky: ['#79c4ee', '#dff3ff'],
    far: '#8cc58a',
    mid: '#3f8a4c',
    ground: '#6b4a33',
    top: '#5fae4f',
    plat: '#8a6a45',
    mobs: ['slime', 'goblin', 'bat'],
    boss: 'slime',
    bossName: 'King Slime',
    amb: 'leaf',
    rec: 'Lv 1-3',
    treeKind: 'oak',
    leafCol: '#5fae4f',
    oreCol: '#ffd24a',
  },
  {
    id: 1,
    name: 'Bone Caves',
    sky: ['#1d1830', '#3b2f50'],
    far: '#2c2440',
    mid: '#4a3d63',
    ground: '#3a3346',
    top: '#6a5d80',
    plat: '#5a4f70',
    mobs: ['skeleton', 'bat', 'goblin'],
    boss: 'skeleton',
    bossName: 'Bone Warden',
    amb: 'dust',
    rec: 'Lv 4-7',
    treeKind: 'chasm',
    leafCol: '#a87ffb',
    oreCol: '#b46be0',
  },
  {
    id: 2,
    name: 'Frostlands',
    sky: ['#a9cfe6', '#eef8ff'],
    far: '#c3dcec',
    mid: '#4f8a86',
    ground: '#7d97ad',
    top: '#f2f8fc',
    plat: '#9fb9cc',
    mobs: ['yeti', 'wisp', 'skeleton'],
    boss: 'yeti',
    bossName: 'Frost Titan',
    amb: 'snow',
    rec: 'Lv 8-11',
    treeKind: 'pine',
    leafCol: '#e2f1f8',
    oreCol: '#73d7ff',
  },
  {
    id: 3,
    name: 'Volcanic Chasm',
    sky: ['#2b0d0d', '#571d1d'],
    far: '#421212',
    mid: '#752319',
    ground: '#261614',
    top: '#e65c00',
    plat: '#592823',
    mobs: ['goblin', 'skeleton', 'wisp'],
    boss: 'yeti',
    bossName: 'Magma Wyrm',
    amb: 'ember',
    rec: 'Lv 12-15',
    treeKind: 'magma',
    leafCol: '#ff5722',
    oreCol: '#ff7b25',
  },
  {
    id: 4,
    name: 'Celestial Peak',
    sky: ['#0f172a', '#312e81'],
    far: '#1e1b4b',
    mid: '#3730a3',
    ground: '#1e293b',
    top: '#38bdf8',
    plat: '#475569',
    mobs: ['wisp', 'skeleton', 'yeti'],
    boss: 'yeti',
    bossName: 'Solar Archon',
    amb: 'stars',
    rec: 'Lv 16+',
    treeKind: 'celestial',
    leafCol: '#38bdf8',
    oreCol: '#38bdf8',
  },
];

export const MOBS: { [key: string]: MobDef } = {
  slime: { w: 28, h: 22, hp: 22, dmg: 6, spd: 70, xp: 6, gold: 2, kind: 'hop', col: '#59c46a' },
  goblin: { w: 22, h: 30, hp: 30, dmg: 8, spd: 90, xp: 9, gold: 3, kind: 'walk', col: '#8aa63a' },
  skeleton: { w: 22, h: 38, hp: 38, dmg: 10, spd: 75, xp: 12, gold: 4, kind: 'walk', col: '#e8e3d3' },
  yeti: { w: 36, h: 44, hp: 58, dmg: 13, spd: 70, xp: 18, gold: 6, kind: 'walk', col: '#e3edf5' },
  bat: { w: 26, h: 18, hp: 20, dmg: 7, spd: 110, xp: 10, gold: 3, kind: 'fly', col: '#6a4a8c' },
  wisp: { w: 20, h: 20, hp: 28, dmg: 10, spd: 95, xp: 15, gold: 5, kind: 'fly', col: '#73d7ff' },
};

const PREFIXES = ['Rusty', 'Sturdy', 'Fine', 'Runed', 'Mythic', 'Godforged'];

function approach(v: number, t: number, d: number): number {
  return v < t ? Math.min(t, v + d) : Math.max(t, v - d);
}

function hs(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export class HelmEngine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  private animFrameId: number = 0;
  private lastTime: number = 0;
  public isRunning: boolean = false;

  // Viewport
  public width: number = 800;
  public height: number = 500;
  public camX: number = 0;
  public levelW: number = 3200;

  // State
  public state: GameState = 'TITLE';
  public currentRegion: number = 0;
  public onStateChange?: (s: GameState) => void;
  public onPlayerUpdate?: (p: PlayerState) => void;
  public onToast?: (msg: string) => void;

  // Entities
  public player: PlayerState;
  public enemies: EnemyEntity[] = [];
  public trees: TreeEntity[] = [];
  public solids: SolidPlatform[] = [];
  public ones: OneWayPlatform[] = [];
  public ramps: Ramp[] = [];
  public projectiles: ProjectileEntity[] = [];
  public pickups: PickupEntity[] = [];
  public particles: ParticleEntity[] = [];
  public floatingTexts: FloatingTextEntity[] = [];
  public ambientParticles: { x: number; y: number; s: number; ph: number }[] = [];

  // NPC & Portals
  public npc = { x: 190, y: 340, w: 36, h: 46, near: false, name: 'Gimbal the Merchant' };
  public hubPortal = { x: 340, y: 326, w: 44, h: 64, near: false };

  // Tree harvesting state
  public nearTree: TreeEntity | null = null;

  // Controls & Physics
  public keys: { [key: string]: boolean } = {};
  public justPressed: { [key: string]: boolean } = {};
  public touch = { l: 0, r: 0, j: 0, a: 0, d: 0, c: 0 };
  
  // Real visceral Screen Shake
  public shakeAmount: number = 0;
  public hitstopTimer: number = 0;
  public timeSec: number = 0;
  private astralRegenTimer: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const c = canvas.getContext('2d', { alpha: false });
    if (!c) throw new Error('Cannot get 2d context');
    this.ctx = c;

    this.player = this.createInitialPlayer();
    this.checkSetBonus();
    this.setupListeners();
    this.handleResize();
    this.enterRegion(0);
  }

  public shake(v: number) {
    this.shakeAmount = Math.max(this.shakeAmount, v);
  }

  private createInitialPlayer(): PlayerState {
    const starterSword = this.createItem('weapon', 1, 'sword', 'fire', undefined, 'arming');
    return {
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
        head: null,
        body: null,
        legs: null,
        shoes: null,
        weapon: starterSword,
        offhand: null,
      },
      inv: [
        this.createItem('weapon', 1, 'gun', 'none', undefined, undefined, 'pistol'),
        this.createItem('weapon', 2, 'gun', 'electric', undefined, undefined, 'smg'),
        this.createItem('weapon', 2, 'gun', 'fire', undefined, undefined, 'rifle'),
        this.createItem('weapon', 3, 'gun', 'ice', undefined, undefined, 'sniper'),
        this.createItem('weapon', 2, 'sword', 'electric', undefined, 'katana'),
        this.createItem('weapon', 2, 'sword', 'ice', undefined, 'scimitar'),
        this.createItem('weapon', 2, 'greatsword', 'fire', undefined, 'claymore'),
        this.createItem('weapon', 1, 'sword', 'none', undefined, 'rapier'),
        this.createItem('head', 1, undefined, undefined, 'huntsman'),
        this.createItem('body', 1, undefined, undefined, 'huntsman'),
        this.createItem('legs', 1, undefined, undefined, 'huntsman'),
        this.createItem('shoes', 1, undefined, undefined, 'huntsman'),
        this.createItem('head', 2, undefined, undefined, 'dragon'),
        this.createItem('body', 2, undefined, undefined, 'dragon'),
        this.createItem('legs', 2, undefined, undefined, 'dragon'),
        this.createItem('shoes', 2, undefined, undefined, 'dragon'),
        this.createItem('head', 2, undefined, undefined, 'astral'),
        this.createItem('body', 2, undefined, undefined, 'astral'),
        this.createItem('weapon', 1, 'handaxe', 'none'),
      ],
      isAttacking: false,
      attackDuration: 0.32,
      attackTimer: 0,
      weaponType: 'sword',
      offhandType: null,
      activeSetBonus: null,
      run: 0,
      plume: 0,
      sx: 1,
      sy: 1,
    };
  }

  public createItem(
    slot: ItemSlot,
    rar: Rarity,
    type?: WeaponType,
    element?: WeaponElement,
    armorSet?: ArmorSet,
    swordStyle?: 'arming' | 'broadsword' | 'scimitar' | 'katana' | 'claymore' | 'rapier',
    gunStyle?: GunStyle
  ): Item {
    const base = 4 + this.currentRegion * 3 + Math.floor(this.player?.lvl || 1);
    const val = Math.max(1, Math.round(base * (1 + rar * 0.75)));
    const id = Math.random().toString();

    if (slot === 'weapon') {
      const wType = type || (['sword', 'greatsword', 'dagger', 'handaxe', 'spear', 'bow', 'gun'] as WeaponType[])[Math.floor(Math.random() * 7)];
      let sStyle = swordStyle;
      if (!sStyle && (wType === 'sword' || wType === 'greatsword')) {
        const styles: ('arming' | 'broadsword' | 'scimitar' | 'katana' | 'claymore' | 'rapier')[] = 
          wType === 'greatsword' ? ['claymore', 'broadsword'] : ['arming', 'broadsword', 'scimitar', 'katana', 'rapier'];
        sStyle = styles[Math.floor(Math.random() * styles.length)];
      }

      let gStyle = gunStyle;
      if (!gStyle && wType === 'gun') {
        const gunStyles: GunStyle[] = ['pistol', 'smg', 'rifle', 'sniper'];
        gStyle = gunStyles[Math.floor(Math.random() * gunStyles.length)];
      }

      let elem = element;
      if (!elem) {
        if (Math.random() < 0.35) {
          const roll = Math.random();
          elem = roll < 0.34 ? 'fire' : roll < 0.67 ? 'ice' : 'electric';
        } else {
          elem = 'none';
        }
      }

      const baseName = sStyle ? SWORD_STYLES[sStyle].name : (gStyle ? GUN_STYLES[gStyle].name : WEAPON_TYPES[wType].name);
      let elemName = '';
      if (elem === 'fire') elemName = 'Flaming ';
      else if (elem === 'ice') elemName = 'Glacial ';
      else if (elem === 'electric') elemName = 'Voltaic ';

      const name = `${elemName}${PREFIXES[rar]} ${baseName}`;
      return { id, slot, rar, val, name, type: wType, element: elem, swordStyle: sStyle, gunStyle: gStyle };
    } else {
      const setKey: ArmorSet = armorSet || (['iron', 'huntsman', 'dragon', 'astral'] as ArmorSet[])[Math.floor(Math.random() * 4)];
      const setDef = ARMOR_SETS[setKey];
      const slotKey = slot as 'head' | 'body' | 'legs' | 'shoes';
      const pieceName = setDef.pieces[slotKey];
      const name = `${PREFIXES[rar]} ${pieceName}`;
      return { id, slot, rar, val, name, armorSet: setKey };
    }
  }

  public checkSetBonus(): string | null {
    const eq = this.player.eq;
    if (!eq.head?.armorSet || !eq.body?.armorSet || !eq.legs?.armorSet || !eq.shoes?.armorSet) {
      this.player.activeSetBonus = null;
      return null;
    }
    const set = eq.head.armorSet;
    if (eq.body.armorSet === set && eq.legs.armorSet === set && eq.shoes.armorSet === set) {
      const bonus = ARMOR_SETS[set].bonusName;
      this.player.activeSetBonus = `${bonus}: ${ARMOR_SETS[set].bonusDesc}`;
      return this.player.activeSetBonus;
    }
    this.player.activeSetBonus = null;
    return null;
  }

  public isSetBonusActive(setName: ArmorSet): boolean {
    const eq = this.player.eq;
    return (
      eq.head?.armorSet === setName &&
      eq.body?.armorSet === setName &&
      eq.legs?.armorSet === setName &&
      eq.shoes?.armorSet === setName
    );
  }

  public enterRegion(regionIdx: number, fromSide: 'left' | 'right' = 'left') {
    this.currentRegion = (regionIdx + REGIONS.length) % REGIONS.length;
    this.enemies = [];
    this.trees = [];
    this.solids = [];
    this.ones = [];
    this.ramps = [];
    this.projectiles = [];
    this.pickups = [];
    this.particles = [];
    this.floatingTexts = [];
    this.nearTree = null;
    this.generateLevel();

    const spawnX = fromSide === 'right' ? Math.max(90, this.levelW - 140) : 80;
    const startY = this.getGroundY(spawnX);
    this.player.x = spawnX;
    this.player.y = startY - this.player.h;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.invulnerableTimer = 1.2;
    this.camX = fromSide === 'right' ? Math.max(0, this.levelW - this.width) : 0;

    // Ambient weather particles
    this.ambientParticles = [];
    for (let i = 0; i < 45; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        s: Math.random() * 2.5 + 1,
        ph: Math.random() * TAU,
      });
    }

    if (this.onToast) {
      this.onToast(`Entered ${REGIONS[this.currentRegion].name}`);
    }
  }

  // --- LEVEL GENERATION (Upper Sky Plateau + No Boss in Area 1) ---
  private generateLevel() {
    const R = REGIONS[this.currentRegion];
    let curX = 0;
    const hubW = 500;
    const hubY = 390;

    // Peaceful starting hub with Gimbal & Leyline Portal
    this.solids.push({ x: 0, y: hubY, w: hubW, h: this.height - hubY, kind: 'hub' });
    this.npc.x = 190;
    this.npc.y = hubY - this.npc.h;
    this.hubPortal.x = 340;
    this.hubPortal.y = hubY - this.hubPortal.h;

    this.trees.push(this.createTree(95, hubY, 110));
    this.trees.push(this.createTree(440, hubY, 105));
    curX = hubW;

    // --- UPPER LOCATION: Sky Terrace / High Canopy Ascent ---
    // High elevation plateau (upperY = 135) with a diagonal ramp to walk diagonally upward,
    // plus a few stepping platforms whose extensions stop flush at the ground surface!
    const upperY = 135;
    const upperW = 540;
    const upperX = 1120;

    // 1. Diagonal ramp allowing player to walk diagonally upward from hub ground (y: 390) to y: 210
    this.ramps.push({
      x0: 550,
      y0: hubY,
      x1: 910,
      y1: 210,
      name: 'Western Canopy Ramp',
    });

    // 2. Only a few stepping platforms (2 platforms) bridging the gap to the terrace!
    // Their extensions stop flush at the ground (groundY: hubY) so they are never visible below ground!
    this.ones.push({ x: 935, y: 180, w: 75, h: 12, groundY: hubY });
    this.ones.push({ x: 1030, y: 152, w: 70, h: 12, groundY: hubY });

    // 3. High elevation plateau solid structure
    this.solids.push({ x: upperX, y: upperY, w: upperW, h: 28, kind: 'plateau' });

    // On the Upper Location: Two majestic Ancient Golden Timber Trees + Shrine
    this.trees.push(this.createTree(upperX + 110, upperY, 125));
    this.trees.push(this.createTree(upperX + 430, upperY, 120));

    // 4. Eastern descent: 1 stepping platform + descending diagonal ramp
    this.ones.push({ x: 1680, y: 165, w: 75, h: 12, groundY: hubY });
    this.ramps.push({
      x0: 1775,
      y0: 195,
      x1: 2050,
      y1: 370,
      name: 'Eastern Canopy Ramp',
    });
    curX = 2050;

    // Midground terraced sections
    const elevations = [340, 290, 360, 310, 260, 375, 305, 250, 355];
    for (let i = 0; i < elevations.length; i++) {
      const secW = 360 + Math.floor(Math.random() * 120);
      const secY = elevations[i];
      const prevSol = this.solids[this.solids.length - 1];
      const dy = secY - prevSol.y;

      if (Math.abs(dy) > 40) {
        const stepW = 40;
        const stepY = Math.round(prevSol.y + dy * 0.5);
        this.solids.push({ x: curX, y: stepY, w: stepW, h: this.height - stepY, kind: 'step' });
        curX += stepW;
      }

      this.solids.push({ x: curX, y: secY, w: secW, h: this.height - secY, kind: 'plateau' });
      this.trees.push(this.createTree(curX + 60, secY, 90 + Math.floor(Math.random() * 30)));
      this.trees.push(this.createTree(curX + secW - 60, secY, 90 + Math.floor(Math.random() * 30)));

      const pw = 120 + Math.floor(Math.random() * 60);
      const px = curX + 30;
      const py = secY - 75;
      this.ones.push({ x: px, y: py, w: pw, h: 12, groundY: secY });

      // Spawn patrolling monsters
      const mobType = R.mobs[Math.floor(Math.random() * R.mobs.length)];
      const mDef = MOBS[mobType];
      this.enemies.push(this.createEnemy(mobType, curX + 120, secY - mDef.h, curX + 10, curX + secW - 10, false));
      this.enemies.push(this.createEnemy(mobType, curX + secW - 100, secY - mDef.h, curX + 10, curX + secW - 10, false));

      // BOSS REMOVAL: Only spawn boss if NOT the first area (Sunny Meadow, region 0)
      if (i === 4 && this.currentRegion !== 0) {
        const bossDef = MOBS[R.boss];
        this.enemies.push(this.createEnemy(R.boss, curX + secW * 0.5, secY - bossDef.h * 2.2, curX + 20, curX + secW - 20, true));
      }

      curX += secW;
    }

    const eastY = 380;
    const eastW = 460;
    this.solids.push({ x: curX, y: eastY, w: eastW, h: this.height - eastY, kind: 'outpost' });
    this.trees.push(this.createTree(curX + 80, eastY, 110));
    this.trees.push(this.createTree(curX + 260, eastY, 120));
    curX += eastW;
    this.levelW = curX;
  }

  private createTree(x: number, y: number, h: number): TreeEntity {
    const maxHp = 40 + this.currentRegion * 15;
    return {
      id: Math.random().toString(),
      x, y, w: 22, h,
      hp: maxHp, maxHp,
      shake: 0,
      fell: false,
      fallAngle: 0,
      fallDir: 1,
      logsDropped: false,
    };
  }

  private createEnemy(type: string, x: number, y: number, minX: number, maxX: number, boss: boolean): EnemyEntity {
    const m = MOBS[type] || MOBS.slime;
    const sc = 1 + this.currentRegion * 0.4;
    const s = boss ? 2.4 : 1;
    const hp = Math.round(m.hp * sc * (boss ? 8.5 : 1));
    return {
      id: Math.random().toString(),
      type, x, y,
      w: m.w * s,
      h: m.h * s,
      s,
      vx: 0, vy: 0,
      ground: false,
      dir: Math.random() < 0.5 ? -1 : 1,
      hp, max: hp,
      dmg: Math.round(m.dmg * sc * (boss ? 1.5 : 1)),
      minX, maxX,
      flash: 0, ph: Math.random() * TAU,
      t: 0, boss, baseY: y,
      jt: 1.5, kind: boss ? 'walk' : m.kind,
      stun: 0, sq: 0, pvy: 0, slam: false, hurtCd: 0,
      status: null,
    };
  }

  public getGroundY(x: number): number {
    let topY = this.height;
    for (const r of this.ramps) {
      const minX = Math.min(r.x0, r.x1);
      const maxX = Math.max(r.x0, r.x1);
      if (x >= minX && x <= maxX) {
        const t = (x - r.x0) / (r.x1 - r.x0);
        const ry = r.y0 + (r.y1 - r.y0) * t;
        if (ry < topY) topY = ry;
      }
    }
    for (const s of this.solids) {
      if (x >= s.x && x <= s.x + s.w && s.y < topY) {
        topY = s.y;
      }
    }
    return topY < this.height ? topY : 400;
  }

  public handleResize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.ctx.scale(dpr, dpr);
  }

  private setupListeners() {
    window.addEventListener('resize', () => this.handleResize());

    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (key === 'escape') {
        if (this.state === 'PLAYING') {
          this.state = 'PAUSED';
          if (this.onStateChange) this.onStateChange('PAUSED');
        } else if (this.state === 'PAUSED' || this.state === 'BAG' || this.state === 'SHOP' || this.state === 'PORTAL') {
          this.state = 'PLAYING';
          this.lastTime = performance.now();
          if (this.onStateChange) this.onStateChange('PLAYING');
        }
        return;
      }

      if (this.state !== 'PLAYING') return;

      if (key === 'b') {
        this.state = 'BAG';
        sound.playShopBell();
        if (this.onStateChange) this.onStateChange('BAG');
        return;
      }
      if (key === 'e') {
        this.state = 'SHOP';
        sound.playShopBell();
        if (this.onStateChange) this.onStateChange('SHOP');
        return;
      }
      if (key === 't') {
        this.state = 'PORTAL';
        sound.playPortalWarp();
        if (this.onStateChange) this.onStateChange('PORTAL');
        return;
      }

      if (!this.keys[key]) {
        this.justPressed[key] = true;
      }
      this.keys[key] = true;

      if (e.code === 'Space' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    window.addEventListener('blur', () => {
      this.keys = {};
      this.justPressed = {};
      this.touch = { l: 0, r: 0, j: 0, a: 0, d: 0, c: 0 };
    });
  }

  public startLoop() {
    this.isRunning = true;
    this.lastTime = performance.now();
    const frame = (time: number) => {
      if (!this.isRunning) return;
      const rawDt = (time - this.lastTime) / 1000;
      this.lastTime = time;
      const dt = Math.min(rawDt, 0.05);

      this.update(dt);
      this.render();

      this.justPressed = {};
      this.animFrameId = requestAnimationFrame(frame);
    };
    this.animFrameId = requestAnimationFrame(frame);
  }

  public stopLoop() {
    this.isRunning = false;
    cancelAnimationFrame(this.animFrameId);
  }

  // --- COMBAT (ATTACKS ENEMIES ONLY) ---
  public triggerAttack() {
    if (this.player.isAttacking) return;
    const mainItem = this.player.eq.weapon;
    const wDef = WEAPON_TYPES[mainItem.type || 'sword'];
    const gunDef = (mainItem.type === 'gun' && mainItem.gunStyle) ? GUN_STYLES[mainItem.gunStyle] : null;

    this.player.isAttacking = true;
    const dur = gunDef ? wDef.dur * gunDef.durMult : wDef.dur;
    this.player.attackDuration = dur;
    this.player.attackTimer = dur;

    sound.playWeaponSwing(mainItem.type || 'sword');

    if (wDef.ranged) {
      this.spawnPlayerProjectile(mainItem, 0);
    }

    if (this.player.eq.offhand) {
      const offItem = this.player.eq.offhand;
      const offDef = WEAPON_TYPES[offItem.type || 'dagger'];
      if (offDef.ranged) {
        const offDelay = gunDef ? Math.max(50, Math.round(dur * 350)) : 80;
        setTimeout(() => {
          if (this.player.eq.offhand) {
            this.spawnPlayerProjectile(this.player.eq.offhand, 1);
          }
        }, offDelay);
      }
    }

    this.player.vx += this.player.face * (wDef.thrust ? 140 : 60);
    this.executeMeleeSwing(wDef);
  }

  // --- TREE CHOPPING (STRICTLY ON "C" BUTTON ONLY!) ---
  public triggerTreeChop() {
    if (this.player.isAttacking) return;
    this.player.isAttacking = true;
    this.player.attackDuration = 0.30;
    this.player.attackTimer = 0.30;

    this.player.vx += this.player.face * 55;

    const reach = 60;
    const hb = {
      x: this.player.face > 0 ? this.player.x : this.player.x - reach,
      y: this.player.y - 10,
      w: reach + this.player.w,
      h: this.player.h + 20,
    };

    const isAxe = this.player.eq.weapon.type === 'handaxe' || this.player.eq.weapon.type === 'battleaxe' ||
      (this.player.eq.offhand?.type === 'handaxe' || this.player.eq.offhand?.type === 'battleaxe');
    const elem = this.player.eq.weapon.element || 'none';

    let hitTree = false;

    this.trees.forEach(t => {
      if (!t.fell) {
        const thb = { x: t.x - 18, y: t.y - t.h, w: 36, h: t.h };
        if (this.overlap(hb, thb)) {
          hitTree = true;
          const isCrit = Math.random() < 0.25;
          let mult = isAxe ? 3.2 : 1.0;
          if (elem === 'fire') mult += 0.8;

          const dmg = Math.round(this.calculateDamage() * mult * (isCrit ? 1.8 : 1.0));
          t.hp -= dmg;
          t.shake = 0.35;
          t.fallDir = this.player.face;

          this.shake(isAxe ? 5 : 3);

          if (elem === 'fire') {
            sound.playFireIgnite();
            this.createBurst(t.x, t.y - t.h * 0.5, '#ff5722', 14);
            this.addFloatingText(t.x, t.y - t.h * 0.5 - 12, `BURN! ${dmg}`, '#ff5722', true);
          } else {
            sound.playTreeChop(false);
            this.createBurst(t.x, t.y - t.h * 0.5, '#a36e3b', isAxe ? 14 : 7);
            this.addFloatingText(t.x, t.y - t.h * 0.5 - 10, `${isAxe ? 'AXE CHOP! ' : 'CHOP! '}${dmg}`, isAxe ? '#ffd24a' : '#eef2f6', isCrit);
          }

          if (t.hp <= 0) {
            t.fell = true;
            sound.playTreeChop(true);
            this.shake(7);
            this.addFloatingText(t.x, t.y - t.h - 16, 'TIMBER! 🪵', '#f2b134', true);
            if (this.onToast) this.onToast('Tree felled! Dropped timber logs.');
          }
        }
      }
    });

    if (!hitTree) {
      sound.playWeaponSwing('handaxe');
      this.addFloatingText(this.player.x + 11, this.player.y - 12, 'Get closer to tree to chop [C]', '#9fb0c1');
    }
  }

  private spawnPlayerProjectile(item: Item, handIdx: number) {
    const face = this.player.face;
    const sx = this.player.x + this.player.w / 2 + face * 18;
    const sy = this.player.y + this.player.h / 2 - 4;
    const type = item.type || 'bow';
    const wDef = WEAPON_TYPES[type];
    const isCrit = Math.random() < (wDef.crit + (this.isSetBonusActive('huntsman') ? 0.12 : 0));
    const dmg = Math.round(this.calculateDamage(item) * (handIdx === 1 ? 0.75 : 1.0) * (isCrit ? 2 : 1));
    const elem = item.element || 'none';

    this.shake(handIdx === 1 ? 2 : 4);

    if (type === 'bow') {
      this.projectiles.push({
        id: Math.random().toString(),
        type: 'arrow',
        x: sx,
        y: sy,
        vx: face * 600,
        vy: -70,
        g: 220,
        dmg,
        crit: isCrit,
        face,
        l: 1.6,
        w: 24,
        h: 6,
        element: elem,
      });
      this.createBurst(sx, sy, elem !== 'none' ? ELEMENT_INFO[elem].color : '#e5d5b5', 6);
    } else if (type === 'gun') {
      const gDef = item.gunStyle ? GUN_STYLES[item.gunStyle] : GUN_STYLES.pistol;
      const bulletSpeed = gDef.speed;
      const bulletLen = gDef.id === 'sniper' ? 22 : gDef.id === 'smg' ? 10 : 14;
      const bulletH = gDef.id === 'sniper' ? 4 : gDef.id === 'smg' ? 3.5 : 5;

      this.projectiles.push({
        id: Math.random().toString(),
        type: 'bullet',
        x: sx + face * 8,
        y: sy,
        vx: face * bulletSpeed,
        vy: (Math.random() - 0.5) * (gDef.id === 'smg' ? 35 : 12),
        g: 0,
        dmg,
        crit: isCrit,
        face,
        l: 1.0,
        w: bulletLen,
        h: bulletH,
        element: elem,
      });
      this.shake(gDef.id === 'sniper' ? 8 : gDef.id === 'smg' ? 2 : 5);
      this.createBurst(sx + face * 12, sy, elem !== 'none' ? ELEMENT_INFO[elem].color : '#ffd24a', gDef.id === 'sniper' ? 20 : gDef.id === 'smg' ? 8 : 14);
      this.createRing(sx + face * 12, sy, '#fff', gDef.id === 'sniper' ? 26 : 16);
      this.player.vx -= face * gDef.recoil;
    }
  }

  private executeMeleeSwing(wDef: WeaponDef) {
    const mainItem = this.player.eq.weapon;
    const reachBonus = mainItem.swordStyle ? SWORD_STYLES[mainItem.swordStyle]?.reachBonus || 0 : 0;
    const reach = wDef.reach + reachBonus + (this.player.eq.offhand ? 14 : 0);
    const hb = {
      x: this.player.face > 0 ? this.player.x : this.player.x - reach,
      y: this.player.y - 12,
      w: reach + this.player.w,
      h: this.player.h + 24,
    };

    const elem = mainItem.element || 'none';
    const critBonus = (mainItem.swordStyle ? SWORD_STYLES[mainItem.swordStyle]?.critBonus || 0 : 0) +
      (this.isSetBonusActive('huntsman') ? 0.12 : 0);

    let hitAny = false;

    // Hit Enemies ONLY (trees are reserved for C key)
    this.enemies.forEach(e => {
      if (this.overlap(hb, e)) {
        hitAny = true;
        const isCrit = Math.random() < (wDef.crit + critBonus);
        const dmg = Math.round(this.calculateDamage() * (isCrit ? 2 : 1) * (0.9 + Math.random() * 0.2));
        e.hp -= dmg;
        e.flash = 0.12;
        e.stun = e.boss ? 0.08 : 0.35;
        e.vx = this.player.face * (e.boss ? 90 : 260);

        sound.playHit(isCrit);

        this.shake(isCrit ? 6 : 3);
        this.hitstopTimer = isCrit ? 0.09 : 0.05;

        this.applyElementalHit(e, elem, dmg);

        const burstCol = elem !== 'none' ? ELEMENT_INFO[elem].color : isCrit ? '#ffd24a' : '#fff';
        this.createBurst(e.x + e.w / 2, e.y + e.h / 2, burstCol, isCrit ? 16 : 8);
        this.addFloatingText(e.x + e.w / 2, e.y - 10, `${dmg}${isCrit ? '!' : ''}`, isCrit ? '#ffd24a' : '#ffffff', isCrit);
      }
    });

    if (mainItem.type === 'hammer') {
      const tipx = this.player.x + (this.player.face > 0 ? reach + 10 : -reach);
      this.createRing(tipx, this.player.y + this.player.h, 'rgba(255,255,255,.8)', 75);
      this.createDust(tipx, this.player.y + this.player.h, 9);
      this.shake(hitAny ? 9 : 5);
    } else if (mainItem.type === 'battleaxe') {
      const tipx = this.player.x + (this.player.face > 0 ? reach : -reach);
      this.shake(hitAny ? 7 : 4);
      this.createBurst(tipx, this.player.y + 16, '#e08b34', 8, 200);
    }
  }

  private applyElementalHit(target: EnemyEntity, element: WeaponElement, baseDmg: number) {
    if (element === 'fire') {
      target.status = {
        type: 'burn',
        duration: 3.0,
        tickTimer: 0.5,
        damagePerTick: Math.max(3, Math.round(baseDmg * 0.2)),
      };
      sound.playFireIgnite();
      this.createBurst(target.x + target.w / 2, target.y + target.h / 2, '#ff5722', 12);
      this.addFloatingText(target.x + target.w / 2, target.y - 20, 'BURN 🔥', '#ff5722');
    } else if (element === 'ice') {
      target.status = {
        type: 'freeze',
        duration: 3.2,
      };
      sound.playIceFreeze();
      this.createBurst(target.x + target.w / 2, target.y + target.h / 2, '#38bdf8', 12);
      this.addFloatingText(target.x + target.w / 2, target.y - 20, 'FROST ❄️', '#38bdf8');
    } else if (element === 'electric') {
      sound.playElectricShock();
      this.shake(5);
      this.createBurst(target.x + target.w / 2, target.y + target.h / 2, '#facc15', 12);
      this.addFloatingText(target.x + target.w / 2, target.y - 20, 'SHOCK ⚡', '#facc15');

      let chained = 0;
      for (const other of this.enemies) {
        if (other !== target && other.hp > 0 && chained < 2) {
          const d = Math.hypot(other.x - target.x, other.y - target.y);
          if (d < 180) {
            chained++;
            const chainDmg = Math.max(2, Math.round(baseDmg * 0.7));
            other.hp -= chainDmg;
            other.flash = 0.14;
            this.createBurst(other.x + other.w / 2, other.y + other.h / 2, '#facc15', 8);
            this.addFloatingText(other.x + other.w / 2, other.y - 12, `CHAIN ⚡ ${chainDmg}`, '#facc15');
          }
        }
      }
    }
  }

  public triggerDash() {
    if (this.player.dashCooldown > 0) return;
    this.player.dashCooldown = 1.1;
    this.player.invulnerableTimer = 0.35;
    this.player.vx = this.player.face * 580;
    this.shake(3);
    sound.playDash();

    this.createDust(this.player.x + 11, this.player.y + this.player.h, 12, -this.player.face);
  }

  public calculateDamage(item?: Item): number {
    const main = item || this.player.eq.weapon;
    const wDef = WEAPON_TYPES[main.type || 'sword'];
    let d = (5 + this.player.lvl * 2 + main.val) * wDef.dmg;

    if (main.swordStyle && SWORD_STYLES[main.swordStyle]) {
      d += SWORD_STYLES[main.swordStyle].reachBonus * 0.15;
    }
    if (main.gunStyle && GUN_STYLES[main.gunStyle]) {
      d *= GUN_STYLES[main.gunStyle].dmgMult;
    }

    if (this.player.eq.offhand && !item) {
      const off = this.player.eq.offhand;
      const offDef = WEAPON_TYPES[off.type || 'sword'];
      let offD = (3 + this.player.lvl + off.val) * offDef.dmg * 0.75;
      if (off.gunStyle && GUN_STYLES[off.gunStyle]) {
        offD *= GUN_STYLES[off.gunStyle].dmgMult;
      }
      d += offD;
    }

    if (this.isSetBonusActive('dragon')) {
      d *= 1.30;
    }

    return Math.max(1, Math.round(d));
  }

  public calculateMaxHp(): number {
    let hp = 50 + this.player.lvl * 10;
    if (this.player.eq.head) hp += this.player.eq.head.val * 2;
    if (this.player.eq.body) hp += this.player.eq.body.val * 3;
    if (this.player.eq.legs) hp += this.player.eq.legs.val * 1.5;
    if (this.player.eq.shoes) hp += this.player.eq.shoes.val * 1;

    if (this.isSetBonusActive('astral')) {
      hp += 50;
    }
    return Math.round(hp);
  }

  public calculateDefense(): number {
    let def = 0;
    if (this.player.eq.head) def += Math.floor(this.player.eq.head.val / 3);
    if (this.player.eq.body) def += Math.floor(this.player.eq.body.val / 2);
    if (this.player.eq.legs) def += Math.floor(this.player.eq.legs.val / 3);
    if (this.player.eq.shoes) def += Math.floor(this.player.eq.shoes.val / 4);

    if (this.isSetBonusActive('iron')) {
      def = Math.round(def * 1.25) + 3;
    }
    return Math.max(1, def);
  }

  private overlap(a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }): boolean {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  // --- SIMULATION UPDATE ---
  private update(dt: number) {
    if (this.state === 'TITLE') {
      this.camX = (this.camX + dt * 45) % (this.levelW - this.width);
      this.updateParticles(dt);
      return;
    }

    if (this.state !== 'PLAYING') return;

    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      return;
    }

    // Screen Shake Decay
    this.shakeAmount = Math.max(0, this.shakeAmount - dt * 30);
    this.timeSec += dt;

    const p = this.player;

    // Check tree proximity for [C] prompt
    this.nearTree = null;
    for (const t of this.trees) {
      if (!t.fell) {
        const dist = Math.hypot(p.x + p.w / 2 - t.x, p.y + p.h / 2 - (t.y - t.h * 0.4));
        if (dist < 65) {
          this.nearTree = t;
          break;
        }
      }
    }

    // Astral HP Regen
    if (this.isSetBonusActive('astral')) {
      this.astralRegenTimer += dt;
      if (this.astralRegenTimer >= 1.2) {
        this.astralRegenTimer = 0;
        if (p.hp < p.maxHp) {
          p.hp = Math.min(p.maxHp, p.hp + 2);
          this.addFloatingText(p.x + 11, p.y - 12, '+2 HP', '#38bdf8');
        }
      }
    }

    // Controls: [C] strictly cuts trees! [Space] attacks enemies!
    const moveLeft = this.keys['a'] || this.keys['arrowleft'] || this.touch.l;
    const moveRight = this.keys['d'] || this.keys['arrowright'] || this.touch.r;
    const jump = this.justPressed['w'] || this.justPressed['arrowup'] || this.justPressed['k'] || this.touch.j;
    const attack = this.justPressed[' '] || this.justPressed['j'] || this.justPressed['x'] || this.touch.a;
    const chop = this.justPressed['c'] || this.touch.c;
    const dash = this.justPressed['shift'] || this.touch.d;

    if (dash) this.triggerDash();
    if (attack) this.triggerAttack();
    if (chop) this.triggerTreeChop();

    const inx = (moveLeft ? -1 : 0) + (moveRight ? 1 : 0);
    if (inx !== 0 && !p.isAttacking) {
      p.face = inx as 1 | -1;
    }

    let moveSpd = 230;
    if (this.isSetBonusActive('huntsman')) {
      moveSpd *= 1.22;
    }

    const targetVx = inx * moveSpd * (p.isAttacking ? 0.6 : 1);
    p.vx += (targetVx - p.vx) * Math.min(1, dt * 14);

    // Natural running cycle calculation
    const moving = p.ground && Math.abs(p.vx) > 30;
    if (moving) {
      p.run = (p.run || 0) + dt * 12;
      if (Math.random() < 0.2) {
        this.createDust(p.x + 11, p.y + p.h, 2, -p.face);
      }
    } else {
      p.run = 0;
    }
    p.plume = approach(p.plume || 0, (p.vx > 20 ? -12 : p.vx < -20 ? 12 : 0), dt * 60);

    // Jump
    const wasG = p.ground;
    if (jump && p.ground) {
      p.vy = -560;
      p.ground = false;
      p.sx = 0.8;
      p.sy = 1.25;
      sound.playJump();
    }

    // Gravity
    p.vy = Math.min(p.vy + 1700 * dt, 850);

    // Physics
    const prevVy = p.vy;
    this.moveBody(p, dt);

    // Landing Impact Squash & Shake
    if (!wasG && p.ground && prevVy > 240) {
      const k = Math.min(1, prevVy / 800);
      p.sx = 1 + 0.35 * k;
      p.sy = 1 - 0.35 * k;
      this.createDust(p.x + 11, p.y + p.h, Math.round(4 + k * 8));
      if (prevVy > 600) this.shake(3);
    }
    p.sx = approach(p.sx || 1, 1, dt * 6);
    p.sy = approach(p.sy || 1, 1, dt * 6);

    // Attack timer
    if (p.isAttacking) {
      p.attackTimer -= dt;
      if (p.attackTimer <= 0) {
        p.isAttacking = false;
      }
    }

    if (p.dashCooldown > 0) p.dashCooldown -= dt;
    if (p.invulnerableTimer > 0) p.invulnerableTimer -= dt;

    // Boundaries
    if (p.x < 15) {
      const prev = (this.currentRegion - 1 + REGIONS.length) % REGIONS.length;
      this.enterRegion(prev, 'right');
      return;
    }
    if (p.x + p.w > this.levelW - 15) {
      const next = (this.currentRegion + 1) % REGIONS.length;
      this.enterRegion(next, 'left');
      return;
    }

    if (p.y > this.height + 60) {
      p.hp = Math.max(1, p.hp - 15);
      p.x = 80;
      p.y = this.getGroundY(80) - p.h;
      p.vx = 0;
      p.vy = 0;
      this.shake(7);
      sound.playHit(true);
    }

    const dNpc = Math.hypot(p.x - this.npc.x, p.y - this.npc.y);
    this.npc.near = dNpc < 70;
    const dPortal = Math.hypot(p.x - this.hubPortal.x, p.y - this.hubPortal.y);
    this.hubPortal.near = dPortal < 70;

    this.updateTrees(dt);
    this.updateProjectiles(dt);
    this.updateEnemies(dt);
    this.updatePickups(dt);
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);

    const targetCamX = p.x + p.w / 2 + p.face * 60 - this.width / 2;
    this.camX += (targetCamX - this.camX) * Math.min(1, dt * 6);
    this.camX = Math.max(0, Math.min(this.levelW - this.width, this.camX));

    if (this.onPlayerUpdate && Math.random() < 0.25) {
      this.onPlayerUpdate({ ...p });
    }
  }

  private moveBody(o: { x: number; y: number; w: number; h: number; vx: number; vy: number; ground?: boolean }, dt: number) {
    o.x += o.vx * dt;
    for (const s of this.solids) {
      if (this.overlap(o, s)) {
        if (o.vx > 0) o.x = s.x - o.w;
        else if (o.vx < 0) o.x = s.x + s.w;
        o.vx = 0;
      }
    }

    const prevBottom = o.y + o.h;
    o.y += o.vy * dt;
    if (o.ground !== undefined) o.ground = false;

    // 1. Solid rectangular platforms
    for (const s of this.solids) {
      if (this.overlap(o, s)) {
        if (o.vy >= 0) {
          o.y = s.y - o.h;
          if (o.ground !== undefined) o.ground = true;
        } else {
          o.y = s.y + s.h;
        }
        o.vy = 0;
      }
    }

    // 2. Diagonal Ramps (walking diagonally upward and downward smoothly)
    for (const r of this.ramps) {
      const minX = Math.min(r.x0, r.x1);
      const maxX = Math.max(r.x0, r.x1);
      const footX = o.x + o.w * 0.5;

      if (footX >= minX && footX <= maxX) {
        const t = (footX - r.x0) / (r.x1 - r.x0);
        const rampY = r.y0 + (r.y1 - r.y0) * t;

        // When walking or falling onto the diagonal ramp
        const snap = (o.ground && o.vy >= 0) ? 16 : 8;
        if (o.vy >= -50 && prevBottom <= rampY + snap && o.y + o.h >= rampY - 12) {
          o.y = rampY - o.h;
          o.vy = 0;
          if (o.ground !== undefined) o.ground = true;
        }
      }
    }

    // 3. One-way platforms
    if (o.vy >= 0) {
      for (const on of this.ones) {
        if (o.x < on.x + on.w && o.x + o.w > on.x && prevBottom <= on.y + 4 && o.y + o.h >= on.y) {
          o.y = on.y - o.h;
          o.vy = 0;
          if (o.ground !== undefined) o.ground = true;
        }
      }
    }
  }

  private updateTrees(dt: number) {
    this.trees.forEach(t => {
      if (t.shake > 0) t.shake -= dt;
      if (t.fell && t.fallAngle < Math.PI / 2) {
        t.fallAngle = Math.min(Math.PI / 2, t.fallAngle + dt * 4.0);
        if (t.fallAngle >= Math.PI / 2 && !t.logsDropped) {
          t.logsDropped = true;
          this.shake(7);

          const logCount = 2 + Math.floor(Math.random() * 3);
          for (let i = 0; i < logCount; i++) {
            this.pickups.push({
              id: Math.random().toString(),
              kind: 'log',
              x: t.x + t.fallDir * (20 + Math.random() * (t.h * 0.6)),
              y: t.y - 12,
              w: 18,
              h: 12,
              vx: t.fallDir * (60 + Math.random() * 120),
              vy: -260 - Math.random() * 140,
              phys: true,
              age: 0,
              ph: Math.random() * TAU,
            });
          }
        }
      }

      if (t.fell) {
        t.regrowTimer = (t.regrowTimer || 25) - dt;
        if (t.regrowTimer <= 0) {
          t.fell = false;
          t.fallAngle = 0;
          t.hp = t.maxHp;
          t.logsDropped = false;
          t.regrowTimer = undefined;
          this.createBurst(t.x, t.y - 20, '#6fbf73', 14);
          this.addFloatingText(t.x, t.y - 30, 'Tree Regrown 🌱', '#6fbf73');
        }
      }
    });
  }

  private updateProjectiles(dt: number) {
    this.projectiles = this.projectiles.filter(p => {
      p.l -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.g * dt;

      const elem = p.element || 'none';

      for (const e of this.enemies) {
        if (p.x > e.x && p.x < e.x + e.w && p.y > e.y && p.y < e.y + e.h) {
          e.hp -= p.dmg;
          e.flash = 0.12;
          e.vx = p.face * 180;
          sound.playHit(p.crit);
          this.shake(p.crit ? 5 : 3);

          this.applyElementalHit(e, elem, p.dmg);

          const bCol = elem !== 'none' ? ELEMENT_INFO[elem].color : p.crit ? '#ffd24a' : '#fff';
          this.createBurst(p.x, p.y, bCol, 8);
          this.addFloatingText(e.x + e.w / 2, e.y - 10, `${p.dmg}${p.crit ? '!' : ''}`, p.crit ? '#ffd24a' : '#fff', p.crit);
          return false;
        }
      }

      const gy = this.getGroundY(p.x);
      if (p.y >= gy) return false;
      return p.l > 0;
    });
  }

  private updateEnemies(dt: number) {
    this.enemies.forEach(e => {
      e.t += dt;
      if (e.flash > 0) e.flash -= dt;
      if (e.stun > 0) e.stun -= dt;
      if (e.hurtCd > 0) e.hurtCd -= dt;

      let speedMult = 1.0;
      if (e.status) {
        e.status.duration -= dt;
        if (e.status.type === 'burn') {
          e.status.tickTimer = (e.status.tickTimer || 0.5) - dt;
          if (e.status.tickTimer <= 0) {
            e.status.tickTimer = 0.5;
            const tickDmg = e.status.damagePerTick || 4;
            e.hp -= tickDmg;
            e.flash = 0.08;
            sound.playFireIgnite();
            this.createBurst(e.x + e.w / 2, e.y + e.h / 2, '#ff5722', 4);
            this.addFloatingText(e.x + e.w / 2, e.y - 12, `${tickDmg} 🔥`, '#ff5722');
          }
        } else if (e.status.type === 'freeze') {
          speedMult = 0.35;
        }

        if (e.status.duration <= 0) {
          e.status = null;
        }
      }

      const dx = (this.player.x + this.player.w / 2) - (e.x + e.w / 2);
      const dy = (this.player.y + this.player.h / 2) - (e.y + e.h / 2);
      const dist = Math.hypot(dx, dy);

      if (e.kind === 'fly') {
        const chase = dist < 260;
        const targetX = chase ? this.player.x : (e.minX + e.maxX) / 2 + Math.sin(e.t) * 80;
        const targetY = chase ? this.player.y - 20 : e.baseY + Math.sin(e.t * 2) * 15;
        e.vx += (targetX - e.x) * dt * 2.5 * speedMult;
        e.vy += (targetY - e.y) * dt * 2.5 * speedMult;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        if (Math.abs(e.vx) > 5) e.dir = e.vx > 0 ? 1 : -1;
      } else {
        if (e.stun <= 0) {
          const chase = dist < 220 || e.boss;
          if (chase) e.dir = dx > 0 ? 1 : -1;
          else if (e.x <= e.minX) e.dir = 1;
          else if (e.x + e.w >= e.maxX) e.dir = -1;

          const spd = (MOBS[e.type]?.spd || 70) * (chase ? 1.2 : 0.6) * (e.boss ? 0.9 : 1) * speedMult;
          e.vx += (e.dir * spd - e.vx) * Math.min(1, dt * 8);

          if (e.boss && e.ground) {
            e.jt -= dt;
            if (e.jt <= 0) {
              e.vy = -580;
              e.vx = e.dir * 220 * speedMult;
              e.jt = 2.5 + Math.random();
              e.slam = true;
            }
          }
        }

        const wasEG = e.ground;
        e.vy = Math.min(e.vy + 1700 * dt, 850);
        this.moveBody(e, dt);

        if (!wasEG && e.ground && e.slam) {
          e.slam = false;
          this.shake(11);
          this.createRing(e.x + e.w / 2, e.y + e.h, 'rgba(255,255,255,.8)', 150);
          this.createBurst(e.x + e.w / 2, e.y + e.h, '#ddd', 18);
        }

        if (e.x < e.minX) { e.x = e.minX; e.vx = 0; }
        if (e.x + e.w > e.maxX) { e.x = e.maxX - e.w; e.vx = 0; }
      }

      if (e.hurtCd <= 0 && this.overlap(this.player, e)) {
        if (this.player.vy > 120 && this.player.y + this.player.h - e.y < e.h * 0.6) {
          e.hp -= Math.round(this.calculateDamage() * 0.8);
          this.player.vy = -450;
          this.shake(4);
          sound.playHit(false);
        } else if (this.player.invulnerableTimer <= 0) {
          const dmg = Math.max(1, e.dmg - this.calculateDefense());
          this.player.hp = Math.max(0, this.player.hp - dmg);
          this.player.invulnerableTimer = 1.0;
          
          if (!this.isSetBonusActive('iron')) {
            this.player.vx = (this.player.x < e.x ? -1 : 1) * 220;
            this.player.vy = -280;
          }

          if (this.isSetBonusActive('dragon')) {
            const thornDmg = Math.round(this.calculateDamage() * 0.4);
            e.hp -= thornDmg;
            e.flash = 0.12;
            sound.playFireIgnite();
            this.createBurst(e.x + e.w / 2, e.y + e.h / 2, '#ff5722', 8);
            this.addFloatingText(e.x + e.w / 2, e.y - 15, `THORNS ${thornDmg}! 🔥`, '#ff5722');
          }

          e.hurtCd = 0.5;
          this.shake(7);
          sound.playHit(true);
          this.createBurst(this.player.x + 11, this.player.y + 14, '#e4572e', 12);
          this.addFloatingText(this.player.x + 11, this.player.y - 10, `-${dmg}`, '#ff7b5c', true);
        }
      }
    });

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.hp <= 0) {
        this.killEnemy(e);
        this.enemies.splice(i, 1);
      }
    }
  }

  private killEnemy(e: EnemyEntity) {
    this.player.kills++;
    this.player.xp += (e.boss ? 80 : 12);
    this.shake(e.boss ? 12 : 5);

    while (this.player.xp >= this.player.nextXp) {
      this.player.xp -= this.player.nextXp;
      this.player.lvl++;
      this.player.nextXp = Math.round(this.player.nextXp * 1.5);
      this.player.maxHp = this.calculateMaxHp();
      this.player.hp = this.player.maxHp;
      this.shake(6);
      sound.playLevelUp();
      this.addFloatingText(this.player.x + 11, this.player.y - 30, 'LEVEL UP!', '#f2b134', true);
    }

    sound.playCoin();
    this.createBurst(e.x + e.w / 2, e.y + e.h / 2, MOBS[e.type]?.col || '#fff', e.boss ? 30 : 12);

    const coins = e.boss ? 8 : 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < coins; i++) {
      this.pickups.push({
        id: Math.random().toString(),
        kind: 'coin',
        x: e.x + e.w / 2,
        y: e.y + e.h / 2,
        w: 14,
        h: 14,
        vx: (Math.random() - 0.5) * 180,
        vy: -260 - Math.random() * 160,
        phys: true,
        age: 0,
        ph: Math.random() * TAU,
        val: e.boss ? 15 : 4,
      });
    }

    if (e.boss || Math.random() < 0.40) {
      const rarRoll: Rarity = e.boss ? (Math.random() < 0.6 ? 3 : 4) : (Math.random() < 0.7 ? 1 : 2);
      const slotRoll = Math.random();
      let slot: ItemSlot;
      if (slotRoll < 0.45) slot = 'weapon';
      else if (slotRoll < 0.60) slot = 'head';
      else if (slotRoll < 0.75) slot = 'body';
      else if (slotRoll < 0.88) slot = 'legs';
      else slot = 'shoes';

      const it = this.createItem(slot, rarRoll);
      this.pickups.push({
        id: Math.random().toString(),
        kind: 'item',
        it,
        x: e.x + e.w / 2,
        y: e.y + e.h / 2,
        w: 16,
        h: 16,
        vx: (Math.random() - 0.5) * 120,
        vy: -320,
        phys: true,
        age: 0,
        ph: Math.random() * TAU,
      });
    }
  }

  private updatePickups(dt: number) {
    this.pickups = this.pickups.filter(o => {
      o.age += dt;
      const dx = (this.player.x + this.player.w / 2) - (o.x + o.w / 2);
      const dy = (this.player.y + this.player.h / 2) - (o.y + o.h / 2);
      const dist = Math.hypot(dx, dy);

      if (dist < 80 && o.age > 0.4) {
        o.phys = false;
        o.x += (dx / dist) * 450 * dt;
        o.y += (dy / dist) * 450 * dt;
      } else if (o.phys) {
        o.vy = Math.min(o.vy + 1700 * dt, 850);
        this.moveBody(o, dt);
        if (o.ground) o.vx *= 0.85;
      }

      if (dist < 26 && o.age > 0.25) {
        if (o.kind === 'coin') {
          const v = o.val || 5;
          this.player.gold += v;
          sound.playCoin();
          this.addFloatingText(o.x, o.y - 10, `+${v}g`, '#ffd24a');
          return false;
        } else if (o.kind === 'log') {
          this.player.wood++;
          sound.playWoodPickup();
          this.addFloatingText(o.x, o.y - 10, '+1 Log 🪵', '#6fbf73');
          return false;
        } else if (o.kind === 'item' && o.it) {
          if (this.player.inv.length < 24) {
            this.player.inv.push(o.it);
            sound.playLevelUp();
            this.addFloatingText(o.x, o.y - 12, `Found ${o.it.name}!`, RAR_COLORS[o.it.rar], true);
            if (this.onToast) this.onToast(`Acquired ${o.it.name}`);
            return false;
          }
        }
      }

      return o.age < 30;
    });
  }

  private updateParticles(dt: number) {
    this.particles = this.particles.filter(p => {
      p.l -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.g * dt;
      return p.l > 0;
    });

    this.ambientParticles.forEach(a => {
      a.ph += dt;
      a.y += Math.sin(a.ph) * 15 * dt + 15 * dt;
      a.x += Math.cos(a.ph) * 10 * dt;
      if (a.y > this.height) a.y = -5;
      if (a.x > this.width) a.x = 0;
    });
  }

  private updateFloatingTexts(dt: number) {
    this.floatingTexts = this.floatingTexts.filter(ft => {
      ft.l -= dt;
      ft.y -= 35 * dt;
      return ft.l > 0;
    });
  }

  public createBurst(x: number, y: number, color: string, count: number, spd: number = 180) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * TAU;
      const s = spd * 0.3 + Math.random() * spd * 0.7;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - spd * 0.3,
        l: 0.3 + Math.random() * 0.4,
        max: 0.7,
        c: color,
        sz: 2 + Math.random() * 3,
        type: 'dot',
        g: 500,
      });
    }
  }

  public createDust(x: number, y: number, count: number, dir?: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 12,
        y: y - 2,
        vx: (dir || (Math.random() - 0.5) * 2) * (20 + Math.random() * 50) + (Math.random() - 0.5) * 40,
        vy: -10 - Math.random() * 50,
        l: 0.25 + Math.random() * 0.25,
        max: 0.5,
        c: 'rgba(230, 230, 230, 0.7)',
        sz: 3 + Math.random() * 3,
        type: 'dot',
        g: -40,
      });
    }
  }

  public createRing(x: number, y: number, color: string, radius: number) {
    this.particles.push({
      x, y,
      vx: 0, vy: 0,
      l: 0.35, max: 0.35,
      c: color,
      sz: radius,
      type: 'ring',
      g: 0,
    });
  }

  public addFloatingText(x: number, y: number, text: string, color: string, crit: boolean = false) {
    this.floatingTexts.push({
      x, y, t: text, c: color, l: 1.0, crit
    });
  }

  // --- RENDERING ---
  public render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Authentic Screen Shake: Visceral randomized translation offset
    const sh = this.shakeAmount;
    const ox = sh > 0 ? (Math.random() - 0.5) * sh : 0;
    const oy = sh > 0 ? (Math.random() - 0.5) * sh : 0;

    ctx.save();
    ctx.translate(ox, oy);

    this.renderBackground(ctx, w, h);

    ctx.save();
    ctx.translate(-Math.round(this.camX), 0);

    this.renderLevel(ctx);
    this.renderTrees(ctx);
    this.renderNpcAndPortals(ctx);
    this.renderPickups(ctx);
    this.renderProjectiles(ctx);
    this.enemies.forEach(e => this.renderEnemy(ctx, e));

    if (this.state !== 'TITLE') {
      this.renderPlayer(ctx);
    }

    this.renderParticles(ctx);

    this.floatingTexts.forEach(ft => {
      ctx.save();
      const alpha = Math.max(0, Math.min(1, ft.l * 1.5));
      ctx.globalAlpha = alpha;
      ctx.font = `${ft.crit ? '900 16px' : '800 14px'} Nunito, sans-serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000';
      ctx.strokeText(ft.t, ft.x, ft.y);
      ctx.fillStyle = ft.c;
      ctx.fillText(ft.t, ft.x, ft.y);
      ctx.restore();
    });

    ctx.restore();

    this.renderForegroundWeather(ctx);

    const boss = this.enemies.find(e => e.boss);
    if (boss) {
      const bw = 320;
      const bx = (w - bw) / 2;
      ctx.fillStyle = 'rgba(0,0,0,.65)';
      ctx.fillRect(bx - 4, h - 36, bw + 8, 22);
      ctx.fillStyle = '#e4572e';
      ctx.fillRect(bx, h - 33, bw * Math.max(0, boss.hp / boss.max), 16);
      ctx.fillStyle = '#fff';
      ctx.font = '800 11px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`✦ Roaming Champion: ${REGIONS[this.currentRegion].bossName}`, w / 2, h - 21);
    }

    ctx.restore();
  }

  private renderBackground(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const R = REGIONS[this.currentRegion];
    const cx = this.camX;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, R.sky[0]);
    g.addColorStop(1, R.sky[1]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    if (this.currentRegion === 0) {
      const sg = ctx.createRadialGradient(650, 90, 10, 650, 90, 120);
      sg.addColorStop(0, 'rgba(255,246,194,.9)');
      sg.addColorStop(1, 'rgba(255,246,194,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(500, 0, 300, 240);
      ctx.fillStyle = '#fff6c2';
      ctx.beginPath(); ctx.arc(650, 90, 32, 0, TAU); ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,.8)';
      for (let i = 0; i < 4; i++) {
        const cxp = ((i * 260 - cx * 0.08 + this.timeSec * 6) % 1100 + 1100) % 1100 - 150;
        const cyp = 60 + i * 30;
        ctx.beginPath();
        ctx.arc(cxp, cyp, 22, 0, TAU);
        ctx.arc(cxp + 26, cyp + 4, 28, 0, TAU);
        ctx.arc(cxp + 54, cyp, 20, 0, TAU);
        ctx.fill();
      }
    } else if (this.currentRegion === 3) {
      const vg = ctx.createLinearGradient(0, 280, 0, 400);
      vg.addColorStop(0, 'rgba(255,90,0,0)');
      vg.addColorStop(1, 'rgba(255,60,0,.35)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 280, w, 120);
    }

    ctx.fillStyle = R.far;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w + 20; x += 20) {
      const wx = x + cx * 0.2;
      const y = this.currentRegion === 2
        ? 300 - Math.abs(Math.sin(wx * 0.004)) * 120 - Math.sin(wx * 0.013) * 18
        : 300 + Math.sin(wx * 0.006) * 40 + Math.sin(wx * 0.017) * 16;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w + 20, h);
    ctx.fill();

    const sp = 110;
    const off = cx * 0.5;
    const i0 = Math.floor(off / sp) - 1;
    for (let i = i0; i < i0 + Math.ceil(w / sp) + 3; i++) {
      const hn = hs(i + this.currentRegion * 50);
      const bx = i * sp - off + hn * 40;
      const sway = Math.sin(this.timeSec * 1.2 + i) * 1.5;
      ctx.fillStyle = R.mid;
      if (this.currentRegion === 0) {
        ctx.fillRect(bx - 4, 360 - hn * 30, 8, 50 + hn * 30);
        ctx.beginPath();
        ctx.arc(bx + sway, 350 - hn * 30, 24 + hn * 10, 0, TAU);
        ctx.arc(bx - 16 + sway, 364 - hn * 30, 16, 0, TAU);
        ctx.arc(bx + 16 + sway, 364 - hn * 30, 16, 0, TAU);
        ctx.fill();
      } else if (this.currentRegion === 1) {
        const len = 40 + hn * 120;
        ctx.beginPath(); ctx.moveTo(bx - 16, 0); ctx.lineTo(bx + 16, 0); ctx.lineTo(bx, len); ctx.fill();
      } else if (this.currentRegion === 3) {
        ctx.fillStyle = '#451814';
        ctx.beginPath(); ctx.moveTo(bx - 20, 400); ctx.lineTo(bx, 350 - hn * 40); ctx.lineTo(bx + 20, 400); ctx.fill();
      } else {
        const ph = 60 + hn * 50;
        for (let k = 0; k < 3; k++) {
          const yy = 406 - ph * 0.3 * k;
          const ww = 34 - k * 8;
          ctx.beginPath();
          ctx.moveTo(bx - ww + sway * 0.3, yy);
          ctx.lineTo(bx + sway * (k * 0.3), yy - ph * 0.5);
          ctx.lineTo(bx + ww + sway * 0.3, yy);
          ctx.fill();
        }
      }
    }
  }

  private renderLevel(ctx: CanvasRenderingContext2D) {
    const R = REGIONS[this.currentRegion];
    const cx = this.camX;

    this.solids.forEach(s => {
      if (s.y < 0 || s.x + s.w < cx - 40 || s.x > cx + this.width + 40) return;
      const x0 = Math.max(s.x, cx - 20);
      const x1 = Math.min(s.x + s.w, cx + this.width + 20);
      const sw = x1 - x0;
      if (sw <= 0) return;

      ctx.fillStyle = R.ground;
      ctx.fillRect(x0, s.y, sw, this.height - s.y);

      // Subsoil masonry
      for (let sy = s.y + 22; sy < this.height; sy += 28) {
        ctx.fillStyle = 'rgba(0,0,0,.16)';
        ctx.fillRect(x0, sy, sw, 3);
        const off = ((sy / 28) % 2) * 24;
        for (let bx = x0 + off; bx < x1; bx += 48) {
          ctx.fillStyle = 'rgba(0,0,0,.12)';
          ctx.fillRect(bx, sy, 2.5, 28);
        }
      }

      // Glowing ore flecks
      for (let cy = s.y + 34; cy < this.height - 10; cy += 36) {
        const oreX = s.x + 24 + ((s.x * 5 + cy * 11) % Math.max(20, s.w - 48));
        if (oreX >= x0 && oreX <= x1) {
          ctx.fillStyle = R.oreCol || '#ffd24a';
          ctx.beginPath(); ctx.arc(oreX, cy, 3.5, 0, TAU); ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(oreX - 1, cy - 1, 1.5, 0, TAU); ctx.fill();
        }
      }

      // Hanging roots
      ctx.strokeStyle = 'rgba(35,22,14,.55)';
      ctx.lineWidth = 2;
      for (let rx = s.x + 18; rx < s.x + s.w - 18; rx += 32) {
        if (rx >= x0 && rx <= x1) {
          const rlen = 10 + (rx % 15);
          ctx.beginPath();
          ctx.moveTo(rx, s.y + 11);
          ctx.quadraticCurveTo(rx + (rx % 5 - 2), s.y + 11 + rlen * 0.5, rx + (rx % 7 - 3), s.y + 11 + rlen);
          ctx.stroke();
        }
      }

      ctx.fillStyle = R.top;
      ctx.fillRect(x0, s.y, sw, 12);

      for (let fx = x0; fx < x1 - 4; fx += 7) {
        const hf = 3 + (fx % 5);
        ctx.fillRect(fx, s.y + 11, 3.5, hf);
      }

      // Sign at the foot of Upper Sky Terrace ascent
      if (s.y === 135) {
        ctx.fillStyle = 'rgba(15,23,42,0.85)';
        ctx.beginPath(); ctx.roundRect(s.x + 20, s.y - 28, 160, 20, 5); ctx.fill();
        ctx.strokeStyle = '#ffd24a'; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = '#ffd24a'; ctx.font = '800 10px Nunito, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('✦ HIGH CANOPY SHRINE ✦', s.x + 100, s.y - 14);
      }
    });

    // Diagonal Terrace Ramps (sloping diagonally upward and downward)
    this.ramps.forEach(r => {
      const minX = Math.min(r.x0, r.x1);
      const maxX = Math.max(r.x0, r.x1);
      if (maxX < cx - 40 || minX > cx + this.width + 40) return;

      const baseGroundY = Math.max(r.y0, r.y1);

      // 1. Earthen diagonal slope body
      ctx.fillStyle = R.ground;
      ctx.beginPath();
      ctx.moveTo(r.x0, r.y0);
      ctx.lineTo(r.x1, r.y1);
      ctx.lineTo(r.x1, baseGroundY + 140);
      ctx.lineTo(r.x0, baseGroundY + 140);
      ctx.closePath();
      ctx.fill();

      // 2. Thick diagonal top turf / stone crust
      ctx.save();
      ctx.strokeStyle = R.top;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(r.x0, r.y0 + 5);
      ctx.lineTo(r.x1, r.y1 + 5);
      ctx.stroke();

      // 3. Cobblestone stepped treads along the diagonal ramp
      const steps = 14;
      ctx.strokeStyle = 'rgba(0,0,0,0.22)';
      ctx.lineWidth = 2.5;
      for (let i = 1; i < steps; i++) {
        const st = i / steps;
        const sx = r.x0 + (r.x1 - r.x0) * st;
        const sy = r.y0 + (r.y1 - r.y0) * st;
        ctx.beginPath();
        ctx.moveTo(sx - 10, sy + 3);
        ctx.lineTo(sx + 10, sy + 3);
        ctx.stroke();
      }

      // 4. Wooden trail guide lanterns at ramp foot and head
      [ { x: r.x0 + (r.x1 > r.x0 ? 25 : -25), y: r.y0 }, { x: r.x1 - (r.x1 > r.x0 ? 25 : -25), y: r.y1 } ].forEach(pt => {
        ctx.fillStyle = '#452a18';
        ctx.fillRect(pt.x - 2, pt.y - 20, 4, 20);
        ctx.fillStyle = '#ffd24a';
        ctx.beginPath(); ctx.arc(pt.x, pt.y - 22, 3.5, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgba(255, 210, 74, 0.25)';
        ctx.beginPath(); ctx.arc(pt.x, pt.y - 22, 10, 0, TAU); ctx.fill();
      });
      ctx.restore();
    });

    // Elevated platforms with support stilts (STOPPING FLUSH AT THE GROUND)
    this.ones.forEach(s => {
      if (s.x + s.w < cx - 40 || s.x > cx + this.width + 40) return;
      const gyLeft = this.getGroundY(s.x + 10);
      const gyRight = this.getGroundY(s.x + s.w - 15);
      const lenLeft = Math.max(0, gyLeft - (s.y + 10));
      const lenRight = Math.max(0, gyRight - (s.y + 10));

      // Support stilts stop exactly at the ground surface so they are never visible below ground!
      ctx.fillStyle = '#3a2717';
      ctx.fillRect(s.x + 10, s.y + 10, 5, lenLeft);
      ctx.fillRect(s.x + s.w - 15, s.y + 10, 5, lenRight);

      // Stone foundation footers right at the ground boundary
      ctx.fillStyle = '#475569';
      ctx.fillRect(s.x + 8, gyLeft - 3, 9, 3);
      ctx.fillRect(s.x + s.w - 17, gyRight - 3, 9, 3);

      ctx.fillStyle = '#222';
      ctx.fillRect(s.x + 8, s.y + 10, 9, 4);
      ctx.fillRect(s.x + s.w - 17, s.y + 10, 9, 4);

      ctx.fillStyle = R.plat; ctx.fillRect(s.x, s.y, s.w, 12);
      ctx.fillStyle = R.top; ctx.fillRect(s.x, s.y, s.w, 4);
      ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(s.x, s.y + 10, s.w, 2);
    });

    const prevName = REGIONS[(this.currentRegion - 1 + REGIONS.length) % REGIONS.length].name;
    const nextName = REGIONS[(this.currentRegion + 1) % REGIONS.length].name;
    this.drawZoneGate(ctx, 48, this.getGroundY(48), `◄ ${prevName}`);
    this.drawZoneGate(ctx, this.levelW - 65, this.getGroundY(this.levelW - 65), `${nextName} ►`);
  }

  private drawZoneGate(ctx: CanvasRenderingContext2D, gx: number, gy: number, label: string) {
    ctx.save();
    ctx.translate(gx, gy);

    ctx.fillStyle = '#334155';
    ctx.fillRect(-22, -72, 8, 72);
    ctx.fillRect(14, -72, 8, 72);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-26, -80, 52, 10);
    ctx.fillStyle = '#475569';
    ctx.fillRect(-24, -78, 48, 6);

    const gl = ctx.createRadialGradient(0, -38, 2, 0, -38, 26);
    gl.addColorStop(0, 'rgba(168,127,251,.95)');
    gl.addColorStop(0.65, 'rgba(115,215,255,.45)');
    gl.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gl;
    ctx.beginPath(); ctx.ellipse(0, -38, 16, 32, 0, 0, TAU); ctx.fill();

    ctx.fillStyle = 'rgba(15,23,42,0.92)';
    ctx.beginPath(); ctx.roundRect(-65, -100, 130, 20, 5); ctx.fill();
    ctx.strokeStyle = '#a87ffb'; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.fillStyle = '#ffd24a';
    ctx.font = '800 11px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, 0, -86);
    ctx.restore();
  }

  private renderTrees(ctx: CanvasRenderingContext2D) {
    const reg = this.currentRegion;
    const cx = this.camX;
    this.trees.forEach(t => {
      if (t.x < cx - 100 || t.x > cx + this.width + 100) return;
      ctx.save();
      ctx.translate(t.x, t.y);

      ctx.fillStyle = '#54371d'; ctx.fillRect(-9, -12, 18, 12);
      ctx.fillStyle = '#916537'; ctx.beginPath(); ctx.ellipse(0, -12, 9, 3.5, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#422912'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, -12, 5, 2, 0, 0, TAU); ctx.stroke();

      if (t.fell && t.fallAngle >= Math.PI / 2) {
        ctx.restore();
        return;
      }

      const wob = t.shake > 0 ? Math.sin(this.timeSec * 35) * t.shake * 0.18 : 0;
      ctx.rotate(t.fallAngle * t.fallDir + wob);

      const trunkCol = reg === 1 ? '#3d314a' : reg === 2 ? '#3a2c22' : reg === 3 ? '#261917' : '#5c3a1e';
      ctx.fillStyle = trunkCol;
      ctx.beginPath();
      ctx.moveTo(-8, 0); ctx.lineTo(-6, -t.h * 0.6); ctx.lineTo(-4, -t.h);
      ctx.lineTo(4, -t.h); ctx.lineTo(6, -t.h * 0.6); ctx.lineTo(8, 0);
      ctx.closePath(); ctx.fill();

      ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-2, -8); ctx.lineTo(-2, -t.h * 0.7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(2, -14); ctx.lineTo(2, -t.h * 0.5); ctx.stroke();

      ctx.lineWidth = 3.5; ctx.strokeStyle = trunkCol;
      ctx.beginPath(); ctx.moveTo(-4, -t.h * 0.55); ctx.quadraticCurveTo(-14, -t.h * 0.62, -18, -t.h * 0.72); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(4, -t.h * 0.45); ctx.quadraticCurveTo(14, -t.h * 0.52, 18, -t.h * 0.62); ctx.stroke();

      const sway = Math.sin(this.timeSec * 1.6 + t.x * 0.04) * 2.5;
      if (reg === 0) {
        ctx.fillStyle = '#469b3d'; ctx.beginPath(); ctx.arc(sway, -t.h + 10, 32, 0, TAU); ctx.fill();
        ctx.fillStyle = '#5fba52';
        ctx.beginPath(); ctx.arc(-20 + sway, -t.h + 18, 24, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(20 + sway, -t.h + 18, 24, 0, TAU); ctx.fill();
        ctx.fillStyle = '#7dd96f';
        ctx.beginPath(); ctx.arc(-6 + sway, -t.h - 2, 20, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(10 + sway, -t.h + 6, 18, 0, TAU); ctx.fill();
      } else if (reg === 1) {
        ctx.fillStyle = '#5e3e82'; ctx.beginPath(); ctx.ellipse(sway, -t.h + 14, 28, 20, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#8c58bd';
        ctx.beginPath(); ctx.arc(-16 + sway, -t.h + 18, 16, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(16 + sway, -t.h + 18, 16, 0, TAU); ctx.fill();
        ctx.fillStyle = '#c49bfb';
        ctx.beginPath(); ctx.arc(-6 + sway, -t.h + 4, 5, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(12 + sway, -t.h + 12, 4, 0, TAU); ctx.fill();
      } else if (reg === 2) {
        const darkPine = '#2d5952';
        const snow = '#edf7fc';
        ctx.fillStyle = darkPine;
        ctx.beginPath(); ctx.moveTo(-34 + sway * 0.3, -t.h * 0.45); ctx.lineTo(0, -t.h * 0.75); ctx.lineTo(34 + sway * 0.3, -t.h * 0.45); ctx.closePath(); ctx.fill();
        ctx.fillStyle = snow; ctx.fillRect(-28 + sway * 0.3, -t.h * 0.48, 56, 4);

        ctx.fillStyle = darkPine;
        ctx.beginPath(); ctx.moveTo(-28 + sway * 0.6, -t.h * 0.65); ctx.lineTo(0, -t.h * 0.95); ctx.lineTo(28 + sway * 0.6, -t.h * 0.65); ctx.closePath(); ctx.fill();
        ctx.fillStyle = snow; ctx.fillRect(-22 + sway * 0.6, -t.h * 0.68, 44, 4);

        ctx.fillStyle = darkPine;
        ctx.beginPath(); ctx.moveTo(-20 + sway, -t.h * 0.85); ctx.lineTo(0, -t.h - 14); ctx.lineTo(20 + sway, -t.h * 0.85); ctx.closePath(); ctx.fill();
        ctx.fillStyle = snow;
        ctx.beginPath(); ctx.moveTo(-16 + sway, -t.h * 0.88); ctx.lineTo(0, -t.h - 16); ctx.lineTo(16 + sway, -t.h * 0.88); ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = '#521f19'; ctx.beginPath(); ctx.ellipse(sway, -t.h + 12, 26, 18, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#8c2e22';
        ctx.beginPath(); ctx.arc(-14 + sway, -t.h + 16, 15, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.arc(14 + sway, -t.h + 16, 15, 0, TAU); ctx.fill();
        ctx.fillStyle = '#ff6f24';
        ctx.beginPath(); ctx.arc(sway, -t.h + 6, 5, 0, TAU); ctx.fill();
      }

      // Prompt to press "C" to chop when near this tree!
      if (this.nearTree === t && !t.fell) {
        const bounce = Math.sin(this.timeSec * 8) * 3;
        ctx.fillStyle = 'rgba(15,23,42,0.92)';
        ctx.beginPath(); ctx.roundRect(-42, -t.h - 40 + bounce, 84, 20, 6); ctx.fill();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#fde047'; ctx.font = '800 10.5px Bungee, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('[C] CHOP', 0, -t.h - 26 + bounce);
      }

      if (t.hp < t.maxHp && !t.fell) {
        ctx.fillStyle = 'rgba(0,0,0,.65)'; ctx.fillRect(-20, -t.h - 22, 40, 6);
        ctx.fillStyle = '#6fbf73'; ctx.fillRect(-20, -t.h - 22, 40 * Math.max(0, t.hp / t.maxHp), 6);
        ctx.fillStyle = '#fff'; ctx.font = '800 8.5px Nunito, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('🪵 TIMBER', 0, -t.h - 26);
      }
      ctx.restore();
    });
  }

  private renderNpcAndPortals(ctx: CanvasRenderingContext2D) {
    const n = this.npc;
    ctx.save();
    ctx.translate(n.x + n.w / 2, n.y + n.h);

    ctx.fillStyle = '#452f1e'; ctx.fillRect(-28, -50, 6, 50); ctx.fillRect(22, -50, 6, 50);
    ctx.fillStyle = '#a33626';
    ctx.beginPath(); ctx.moveTo(-36, -50); ctx.lineTo(36, -50); ctx.lineTo(28, -64); ctx.lineTo(-28, -64); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5e412a'; ctx.fillRect(-26, -22, 52, 22);

    ctx.fillStyle = '#334d5c'; ctx.fillRect(-8, -34, 16, 14);
    ctx.fillStyle = '#d4a373'; ctx.beginPath(); ctx.arc(0, -38, 7, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(-2, -35, 8, 4);

    if (n.near) {
      ctx.fillStyle = 'rgba(242,177,52,0.95)';
      ctx.beginPath(); ctx.roundRect(-50, -82, 100, 22, 6); ctx.fill();
      ctx.fillStyle = '#141b24';
      ctx.font = '800 11px Bungee, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[E] TALK / SHOP', 0, -67);
    }
    ctx.restore();

    const p = this.hubPortal;
    ctx.save();
    ctx.translate(p.x + p.w / 2, p.y + p.h);

    ctx.fillStyle = '#2b3b4d';
    ctx.beginPath(); ctx.arc(0, -34, 26, Math.PI, 0); ctx.lineTo(26, 0); ctx.lineTo(-26, 0); ctx.closePath(); ctx.fill();

    const gl = ctx.createRadialGradient(0, -34, 2, 0, -34, 24);
    gl.addColorStop(0, 'rgba(200,160,255,0.9)');
    gl.addColorStop(1, 'rgba(38,18,74,0)');
    ctx.fillStyle = gl;
    ctx.beginPath(); ctx.arc(0, -34, 20, 0, TAU); ctx.fill();

    if (p.near) {
      ctx.fillStyle = 'rgba(168,127,251,0.95)';
      ctx.beginPath(); ctx.roundRect(-48, -84, 96, 20, 6); ctx.fill();
      ctx.fillStyle = '#141b24';
      ctx.font = '800 11px Bungee, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('[T] REALM MAP', 0, -70);
    }
    ctx.restore();
  }

  private renderPickups(ctx: CanvasRenderingContext2D) {
    this.pickups.forEach(o => {
      ctx.save();
      ctx.translate(o.x + o.w / 2, o.y + o.h / 2);
      if (o.kind === 'coin') {
        const w = Math.abs(Math.cos(this.timeSec * 4 + o.ph)) * 6 + 1;
        ctx.fillStyle = '#c9901c'; ctx.beginPath(); ctx.ellipse(0, 0, w + 1, 8, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#ffd24a'; ctx.beginPath(); ctx.ellipse(0, 0, w, 6.5, 0, 0, TAU); ctx.fill();
      } else if (o.kind === 'log') {
        const bob = Math.sin(this.timeSec * 4 + o.ph) * 2.5;
        ctx.translate(0, bob);
        ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, 9, 9, 3, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#704422'; ctx.beginPath(); ctx.roundRect(-9, -6, 18, 12, 3); ctx.fill();
        ctx.fillStyle = '#8c582d'; ctx.fillRect(-7, -6, 14, 3);
        ctx.fillStyle = '#dfb382'; ctx.beginPath(); ctx.ellipse(8, 0, 3, 5.5, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#5c381c'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(8, 0, 1.5, 3, 0, 0, TAU); ctx.stroke();
        ctx.fillStyle = '#6fbf73'; ctx.beginPath(); ctx.ellipse(-3, -8, 4, 2, -0.4, 0, TAU); ctx.fill();
      } else if (o.kind === 'item' && o.it) {
        const bob = Math.sin(this.timeSec * 4 + o.ph) * 3;
        const c = RAR_COLORS[o.it.rar];
        if (o.it.rar >= 2) {
          const bg = ctx.createLinearGradient(0, -60, 0, 8);
          bg.addColorStop(0, 'rgba(255,255,255,0)');
          bg.addColorStop(1, c);
          ctx.globalAlpha = 0.45 + 0.2 * Math.sin(this.timeSec * 5);
          ctx.fillStyle = bg;
          ctx.fillRect(-8, -60, 16, 70);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(0, 9, 8, 3, 0, 0, TAU); ctx.fill();
        ctx.globalAlpha = 0.3; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, bob, 15, 0, TAU); ctx.fill(); ctx.globalAlpha = 1;

        ctx.fillStyle = c;
        ctx.beginPath(); ctx.roundRect(-10, -10 + bob, 20, 20, 4); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Nunito, sans-serif';
        ctx.textAlign = 'center';
        const sym = o.it.slot === 'weapon' ? '⚔' : o.it.slot === 'head' ? '🪖' : o.it.slot === 'body' ? '🛡' : o.it.slot === 'legs' ? '👖' : '👢';
        ctx.fillText(sym, 0, 4 + bob);
      }
      ctx.restore();
    });
  }

  private renderProjectiles(ctx: CanvasRenderingContext2D) {
    this.projectiles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      const elem = p.element || 'none';
      const elemCol = elem !== 'none' ? ELEMENT_INFO[elem].color : '#ffd24a';

      if (p.type === 'arrow') {
        ctx.rotate(Math.atan2(p.vy, p.vx));
        ctx.fillStyle = '#8c6239'; ctx.fillRect(-12, -1.5, 24, 3);
        ctx.fillStyle = elem !== 'none' ? elemCol : '#e2e8f0';
        ctx.beginPath(); ctx.moveTo(12, -3.5); ctx.lineTo(17, 0); ctx.lineTo(12, 3.5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#e4572e';
        ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-16, -3); ctx.lineTo(-14, 0); ctx.lineTo(-16, 3); ctx.closePath(); ctx.fill();
      } else if (p.type === 'bullet') {
        ctx.fillStyle = elemCol;
        ctx.beginPath(); ctx.ellipse(0, 0, 6, 2.5, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.ellipse(2, 0, 3, 1.5, 0, 0, TAU); ctx.fill();
      }
      ctx.restore();
    });
  }

  private renderEnemy(ctx: CanvasRenderingContext2D, e: EnemyEntity) {
    const m = MOBS[e.type] || MOBS.slime;
    const F = e.flash > 0;
    const cx = e.x + e.w / 2;
    const t = e.t * 1 + e.ph;
    const fly = e.kind === 'fly';
    const oy = fly ? e.y + e.h / 2 : e.y + e.h;
    const sc = e.s;

    function c(x: string) { return F ? '#fff' : x; }
    function limb(ctx: CanvasRenderingContext2D, x: number, y: number, a: number, l: number, w: number, col: string) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      ctx.fillStyle = col;
      ctx.fillRect(-w / 2, 0, w, l);
      ctx.restore();
    }

    if (!fly && e.ground) {
      ctx.fillStyle = 'rgba(0,0,0,.28)';
      ctx.beginPath(); ctx.ellipse(cx, e.y + e.h, e.w * 0.55, 4 * sc, 0, 0, TAU); ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, oy);

    let sx = 1 + 0.22 * e.sq;
    let sy = 1 - 0.22 * e.sq;
    if (!e.ground && !fly) {
      sy = 1 + Math.min(0.3, Math.abs(e.vy) / 900);
      sx = 1 / sy;
    }
    ctx.scale(e.dir * sc * sx, sc * sy);

    const col = m.col;
    const sw = Math.sin(t * (Math.abs(e.vx) > 20 ? 10 : 2));

    if (e.type === 'slime') {
      const br = Math.sin(t * 4) * 0.05;
      ctx.scale(1 + br, 1 - br);
      ctx.fillStyle = c(col);
      ctx.beginPath();
      ctx.moveTo(-14, 0); ctx.quadraticCurveTo(-15, -30, 0, -30); ctx.quadraticCurveTo(15, -30, 14, 0);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = F ? '#fff' : 'rgba(255,255,255,.35)';
      ctx.beginPath(); ctx.ellipse(-6, -20, 4, 2.5, -0.5, 0, TAU); ctx.fill();
      ctx.fillStyle = '#111';
      ctx.fillRect(2, -17, 3, 5); ctx.fillRect(8, -17, 3, 5);
    } else if (e.type === 'goblin') {
      const wob = Math.abs(sw) * -1.5;
      limb(ctx, -4, -9, sw * 0.8, 9, 5, c('#6c8a2a'));
      limb(ctx, 4, -9, -sw * 0.8, 9, 5, c('#6c8a2a'));
      ctx.fillStyle = c(col);
      ctx.fillRect(-7, -21 + wob, 14, 13);
      ctx.beginPath(); ctx.arc(1, -25 + wob, 7, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-5, -26 + wob); ctx.lineTo(-13, -30 + wob); ctx.lineTo(-4, -22 + wob); ctx.fill();
      ctx.beginPath(); ctx.moveTo(6, -27 + wob); ctx.lineTo(13, -33 + wob); ctx.lineTo(8, -22 + wob); ctx.fill();
      ctx.fillStyle = '#111'; ctx.fillRect(3, -27 + wob, 2.5, 3);
      ctx.save();
      ctx.translate(7, -16 + wob); ctx.rotate(-0.8 + sw * 0.4);
      ctx.fillStyle = c('#6b4a2b'); ctx.fillRect(-1.5, 0, 3, 13); ctx.fillRect(-3, 10, 6, 6);
      ctx.restore();
    } else if (e.type === 'skeleton') {
      const wb = Math.abs(sw) * -1;
      limb(ctx, -3, -14, sw * 0.7, 14, 3, c(col));
      limb(ctx, 3, -14, -sw * 0.7, 14, 3, c(col));
      ctx.fillStyle = c(col);
      ctx.fillRect(-6, -27 + wb, 12, 3); ctx.fillRect(-6, -22 + wb, 12, 3); ctx.fillRect(-6, -17 + wb, 12, 3); ctx.fillRect(-1, -28 + wb, 2, 14);
      ctx.beginPath(); ctx.arc(0, -33 + wb, 7, 0, TAU); ctx.fill(); ctx.fillRect(-4, -30 + wb, 8, 6);
      ctx.fillStyle = '#222'; ctx.fillRect(0, -35 + wb, 3, 3.5); ctx.fillRect(-5, -35 + wb, 3, 3.5);
      ctx.save();
      ctx.translate(6, -24 + wb); ctx.rotate(-0.6 + sw * 0.35);
      ctx.fillStyle = c('#c0c6cc'); ctx.fillRect(-1.5, 0, 3, 18); ctx.fillStyle = c('#5b3d22'); ctx.fillRect(-4, 0, 8, 3);
      ctx.restore();
    } else if (e.type === 'yeti') {
      const wy = Math.abs(sw) * -1.5;
      limb(ctx, -8, -16, sw * 0.6, 16, 10, c('#cfdce8'));
      limb(ctx, 8, -16, -sw * 0.6, 16, 10, c('#cfdce8'));
      ctx.fillStyle = c(col);
      ctx.beginPath(); ctx.ellipse(0, -28 + wy, 17, 17, 0, 0, TAU); ctx.fill();
      limb(ctx, -15, -34 + wy, 0.3 - sw * 0.5, 22, 9, c('#cfdce8'));
      limb(ctx, 15, -34 + wy, -0.3 + sw * 0.5, 22, 9, c('#cfdce8'));
      ctx.fillStyle = c('#9fc1da'); ctx.beginPath(); ctx.ellipse(3, -36 + wy, 9, 8, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#111'; ctx.fillRect(3, -39 + wy, 3, 4); ctx.fillRect(8, -39 + wy, 3, 4); ctx.fillRect(4, -32 + wy, 7, 2);
    } else if (e.type === 'bat') {
      const fl = Math.sin(t * 20);
      ctx.fillStyle = c('#4d3569');
      ctx.beginPath();
      ctx.moveTo(-3, 0); ctx.lineTo(-20, -8 * fl - 6); ctx.lineTo(-14, 4); ctx.lineTo(-9, -1); ctx.lineTo(-3, 6); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(3, 0); ctx.lineTo(20, -8 * fl - 6); ctx.lineTo(14, 4); ctx.lineTo(9, -1); ctx.lineTo(3, 6); ctx.fill();
      ctx.fillStyle = c(col); ctx.beginPath(); ctx.ellipse(0, 0, 7, 8, 0, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-6, -5); ctx.lineTo(-5, -12); ctx.lineTo(-1, -6); ctx.fill();
      ctx.beginPath(); ctx.moveTo(6, -5); ctx.lineTo(5, -12); ctx.lineTo(1, -6); ctx.fill();
      ctx.fillStyle = '#ff5a5a'; ctx.fillRect(1, -3, 2.5, 2.5); ctx.fillRect(-3, -3, 2.5, 2.5);
    } else {
      const pu = 1 + Math.sin(t * 5) * 0.12;
      const gl = ctx.createRadialGradient(0, 0, 2, 0, 0, 24 * pu);
      gl.addColorStop(0, F ? '#fff' : 'rgba(160,235,255,.9)');
      gl.addColorStop(1, 'rgba(115,215,255,0)');
      ctx.fillStyle = gl; ctx.fillRect(-26, -26, 52, 52);
      ctx.fillStyle = c('#d8f6ff');
      ctx.beginPath(); ctx.moveTo(0, -11 * pu); ctx.quadraticCurveTo(9, -2, 0, 10); ctx.quadraticCurveTo(-9, -2, 0, -11 * pu); ctx.fill();
      ctx.fillStyle = '#1a5a78'; ctx.fillRect(-1, -3, 2, 3); ctx.fillRect(3, -3, 2, 3);
    }

    if (e.boss) {
      ctx.fillStyle = c('#f2b134');
      const cy = e.type === 'slime' ? -32 : e.type === 'skeleton' ? -42 : -47;
      ctx.beginPath();
      ctx.moveTo(-8, cy); ctx.lineTo(-9, cy - 9); ctx.lineTo(-4, cy - 4); ctx.lineTo(0, cy - 11); ctx.lineTo(4, cy - 4); ctx.lineTo(9, cy - 9); ctx.lineTo(8, cy);
      ctx.fill();
    }
    ctx.restore();

    if (e.hp < e.max && !e.boss) {
      const bw = Math.max(24, e.w);
      ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(cx - bw / 2, e.y - 12, bw, 5);
      ctx.fillStyle = '#e4572e'; ctx.fillRect(cx - bw / 2, e.y - 12, bw * Math.max(0, e.hp / e.max), 5);
    }
  }

  // --- ARTICULATED 2-JOINT LEG RENDERING (REAL WALKING GAIT WITH KNEE & ANKLE) ---
  private drawArticulatedLeg(
    ctx: CanvasRenderingContext2D,
    hipX: number,
    hipY: number,
    runCycle: number,
    isMoving: boolean,
    isAir: boolean,
    vy: number,
    isBackLeg: boolean,
    legCol: string,
    shoeCol: string,
    armorSet?: ArmorSet
  ) {
    const L1 = 7.5; // Thigh length
    const L2 = 8.5; // Shin length
    const W = 5.2;  // Limb width

    let thighA = 0;
    let kneeA = 0;  // Angle relative to thigh
    let footA = 0;  // Ankle angle

    if (isAir) {
      if (vy < 0) {
        thighA = isBackLeg ? 0.35 : -0.7;
        kneeA = isBackLeg ? 0.45 : 0.85;
        footA = 0.2;
      } else {
        thighA = isBackLeg ? -0.2 : 0.25;
        kneeA = isBackLeg ? 0.25 : 0.2;
        footA = 0.1;
      }
    } else if (isMoving) {
      const phase = isBackLeg ? runCycle + Math.PI : runCycle;
      const sinP = Math.sin(phase);

      thighA = sinP * 0.65;

      if (sinP < 0) {
        // Recovery phase: bending knee to lift foot smoothly
        kneeA = 0.2 + Math.abs(sinP) * 0.95;
        footA = -0.2;
      } else {
        // Contact phase: knee supports weight
        kneeA = 0.08 + (1 - sinP) * 0.22;
        footA = 0.2 * sinP;
      }
    } else {
      const breath = Math.sin(this.timeSec * 3) * 0.04;
      thighA = (isBackLeg ? -0.06 : 0.06) + breath;
      kneeA = 0.12;
      footA = 0;
    }

    ctx.save();
    ctx.translate(hipX, hipY);
    ctx.rotate(thighA);

    // Upper Leg (Thigh)
    if (!armorSet) {
      // Base Character: Tattered navy/blue denim shorts with jagged hem
      ctx.fillStyle = '#394b63';
      ctx.beginPath();
      ctx.roundRect(-W / 2 - 0.5, 0, W + 1, L1 + 1, 1);
      ctx.fill();
      // Denim dark shading & ragged hem triangles
      ctx.fillStyle = '#273447';
      ctx.fillRect(-W / 2 - 0.5, 0, 1.4, L1);
      ctx.beginPath();
      ctx.moveTo(-W / 2 - 0.5, L1 + 1);
      ctx.lineTo(-W / 2 + 1, L1 - 1.2);
      ctx.lineTo(0, L1 + 1.2);
      ctx.lineTo(W / 2 - 0.5, L1 - 0.8);
      ctx.lineTo(W / 2 + 0.5, L1 + 1);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = legCol;
      ctx.beginPath();
      ctx.roundRect(-W / 2, 0, W, L1 + 1, 2.5);
      ctx.fill();
    }

    // Knee Cop Armor Joint (Unique set-specific design or bare skin knee)
    const kneeX = 0;
    const kneeY = L1;
    const trim = armorSet ? ARMOR_SETS[armorSet].trimColor : '#2c1e14';

    if (armorSet === 'dragon') {
      // Dragon spiked knee-cop
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath(); ctx.arc(kneeX, kneeY, 3.8, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(kneeX - 2, kneeY); ctx.lineTo(kneeX + 4.5, kneeY - 1); ctx.lineTo(kneeX - 1, kneeY + 2.5); ctx.fill();
    } else if (armorSet === 'iron') {
      // Heavy knight steel roundel
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath(); ctx.arc(kneeX, kneeY, 3.6, 0, TAU); ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.beginPath(); ctx.arc(kneeX, kneeY, 1.8, 0, TAU); ctx.fill();
    } else if (armorSet === 'astral') {
      // Glowing astral diamond poleyn
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(kneeX, kneeY - 3.8); ctx.lineTo(kneeX + 3.8, kneeY); ctx.lineTo(kneeX, kneeY + 3.8); ctx.lineTo(kneeX - 3.8, kneeY);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(kneeX, kneeY, 1.5, 0, TAU); ctx.fill();
    } else if (armorSet === 'huntsman') {
      // Leather strapped knee patch with brass stud
      ctx.fillStyle = '#14532d';
      ctx.beginPath(); ctx.roundRect(kneeX - 3, kneeY - 2.5, 6, 5, 2); ctx.fill();
      ctx.fillStyle = '#d97706';
      ctx.beginPath(); ctx.arc(kneeX + 1, kneeY, 1.6, 0, TAU); ctx.fill();
    } else {
      // Base Character bare skin knee joint
      ctx.fillStyle = '#e8b88d';
      ctx.beginPath();
      ctx.arc(kneeX, kneeY, 2.4, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#d29b71';
      ctx.fillRect(kneeX - 1.2, kneeY - 0.5, 2.4, 1.2);
    }

    // Lower Leg (Shin) from Knee
    ctx.save();
    ctx.translate(kneeX, kneeY);
    ctx.rotate(kneeA);

    if (!armorSet) {
      // Base Character bare skin calf
      ctx.fillStyle = '#f6caa1';
      ctx.beginPath();
      ctx.roundRect(-W / 2 + 0.6, 0, W - 1.2, L2, 1.5);
      ctx.fill();
      // Pixel shadow outline on back edge
      ctx.fillStyle = '#d29b71';
      ctx.fillRect(-W / 2 + 0.6, 0, 1.2, L2);
    } else {
      ctx.fillStyle = legCol;
      ctx.beginPath();
      ctx.roundRect(-W / 2 + 0.3, 0, W - 0.6, L2, 2);
      ctx.fill();

      // Shin Plate Highlight / Ridge
      if (armorSet === 'iron') {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-0.8, 1, 1.6, L2 - 1.5); // Center ridge
      } else if (armorSet === 'dragon') {
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-1.5, 2, 3, 2); // Dragonscale segment
        ctx.fillRect(-1.5, 5, 3, 2);
      } else if (armorSet === 'astral') {
        ctx.fillStyle = 'rgba(224, 242, 254, 0.7)';
        ctx.fillRect(-W / 2 + 1, 1, 1.5, L2 - 2);
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.18)';
        ctx.fillRect(-W / 2 + 1, 1, 1.5, L2 - 2);
      }
    }

    // Foot / Shoe from Ankle (Distinct Sabatons / Boots per set or bare skin foot)
    const ankleX = 0;
    const ankleY = L2;
    ctx.save();
    ctx.translate(ankleX, ankleY);
    ctx.rotate(footA);

    ctx.fillStyle = shoeCol;

    if (armorSet === 'iron') {
      // Steel Sabatons: articulated metal lame plates & pointed toe
      ctx.beginPath();
      ctx.moveTo(-3.5, -1);
      ctx.lineTo(8.5, -0.5);
      ctx.lineTo(9.5, 4);
      ctx.lineTo(-4, 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-2, 0.5, 2.5, 3);
      ctx.fillRect(1.5, 0.5, 2.5, 3);
      ctx.fillRect(5, 0.5, 2.5, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-2, 0.5, 8, 1);
    } else if (armorSet === 'dragon') {
      // Wyrmscale Sabatons: clawed toe & molten trim
      ctx.beginPath();
      ctx.moveTo(-3, -1);
      ctx.lineTo(7.5, 0);
      ctx.lineTo(9.5, 2);
      ctx.lineTo(8.5, 4.5);
      ctx.lineTo(-3.5, 4.5);
      ctx.closePath();
      ctx.fill();
      // Molten claw toes
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(7, 2); ctx.lineTo(10, 3.5); ctx.lineTo(7, 4.5); ctx.fill();
    } else if (armorSet === 'astral') {
      // Voidstride Boots: sleek starlight hover wings
      ctx.beginPath();
      ctx.moveTo(-3, -1);
      ctx.lineTo(7, 0);
      ctx.lineTo(7, 4);
      ctx.lineTo(-3.5, 4);
      ctx.closePath();
      ctx.fill();
      // Celestial wing heel
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.moveTo(-3, 0); ctx.lineTo(-6.5, -3); ctx.lineTo(-3, 2); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, 0.5, 6, 1.2);
    } else if (armorSet === 'huntsman') {
      // Stalker Prowler Boots: laced soft leather with cuff
      ctx.beginPath();
      ctx.moveTo(-3.5, -2);
      ctx.lineTo(6.5, -0.5);
      ctx.lineTo(6.5, 4);
      ctx.lineTo(-4, 4);
      ctx.closePath();
      ctx.fill();
      // Fur/leather cuff
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-3.8, -2, 7.6, 2.2);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(1, 0, 1.2, 3.5); // Leather strap
    } else {
      // Base Character bare skin foot with toes & dark pixel sole outline
      ctx.fillStyle = '#f6caa1';
      ctx.beginPath();
      ctx.roundRect(-2.8, -1.5, 4.5, 3, 1);
      ctx.fill();
      // Forward foot & toes
      ctx.beginPath();
      ctx.moveTo(-2.5, 0);
      ctx.lineTo(6.5, 0);
      ctx.lineTo(6.5, 3.5);
      ctx.lineTo(-3, 3.5);
      ctx.closePath();
      ctx.fill();
      // Toe division line & sole shadow
      ctx.fillStyle = '#d29b71';
      ctx.fillRect(-3, 2.5, 9.5, 1);
      ctx.fillRect(3.5, 0.5, 1, 2);
    }

    ctx.restore(); // Foot
    ctx.restore(); // Shin
    ctx.restore(); // Thigh
  }

  // --- DISTINCT TORSO CUIRASS DESIGNS ---
  private drawTorso(ctx: CanvasRenderingContext2D, bob: number, bodyItem?: Item | null) {
    const set = bodyItem?.armorSet;
    const col = set ? ARMOR_SETS[set].color : RAR_COLORS[bodyItem?.rar || 0];
    const trim = set ? ARMOR_SETS[set].trimColor : '#fbbf24';

    if (set === 'iron') {
      // Iron Knight: Deflecting center ridge, steel gorget plate, brass belt buckle
      ctx.fillStyle = '#64748b';
      ctx.fillRect(-9, -31 + bob, 18, 18);
      // Polished center ridge
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-1.5, -31 + bob, 3, 15);
      // Steel gorget neck guard
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(-9, -31 + bob); ctx.lineTo(9, -31 + bob); ctx.lineTo(6, -26 + bob); ctx.lineTo(-6, -26 + bob); ctx.closePath();
      ctx.fill();
      // Heavy leather belt with brass buckle
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-9, -17 + bob, 18, 4);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-3, -18 + bob, 6, 5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-1.5, -16.5 + bob, 3, 2.5);
    } else if (set === 'huntsman') {
      // Huntsman Ranger: Forest green leather tunic, crossed quiver straps, brass ring
      ctx.fillStyle = '#14532d';
      ctx.fillRect(-9, -31 + bob, 18, 18);
      // Crossed brown leather quiver straps
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-9, -31 + bob); ctx.lineTo(7, -15 + bob);
      ctx.moveTo(9, -31 + bob); ctx.lineTo(-7, -15 + bob);
      ctx.stroke();
      // Center brass ring
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath(); ctx.arc(0, -23 + bob, 3.2, 0, TAU); ctx.fill();
      ctx.fillStyle = '#14532d';
      ctx.beginPath(); ctx.arc(0, -23 + bob, 1.5, 0, TAU); ctx.fill();
      // Belt
      ctx.fillStyle = '#451a03';
      ctx.fillRect(-9, -16 + bob, 18, 3);
    } else if (set === 'dragon') {
      // Dragon Slayer: Scalloped crimson dragonscales & glowing molten core rune
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(-9, -31 + bob, 18, 18);
      // Overlapping dragonscale plates
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.moveTo(-8, -30 + bob); ctx.quadraticCurveTo(-4, -25 + bob, 0, -30 + bob); ctx.quadraticCurveTo(4, -25 + bob, 8, -30 + bob); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-8, -25 + bob); ctx.quadraticCurveTo(-4, -20 + bob, 0, -25 + bob); ctx.quadraticCurveTo(4, -20 + bob, 8, -25 + bob); ctx.fill();
      // Molten core chest rune
      const pulse = 0.85 + Math.sin(this.timeSec * 6) * 0.15;
      ctx.fillStyle = `rgba(251, 191, 36, ${pulse})`;
      ctx.beginPath();
      ctx.moveTo(0, -27 + bob); ctx.lineTo(3.5, -23 + bob); ctx.lineTo(0, -19 + bob); ctx.lineTo(-3.5, -23 + bob); ctx.closePath();
      ctx.fill();
      // Belt
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(-9, -16 + bob, 18, 3);
    } else if (set === 'astral') {
      // Astral Paladin: Deep celestial cosmic hauberk with glowing starlight constellations
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-9, -31 + bob, 18, 18);
      // Glowing constellation lines
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-6, -28 + bob); ctx.lineTo(0, -23 + bob); ctx.lineTo(6, -27 + bob);
      ctx.lineTo(3, -18 + bob); ctx.lineTo(-3, -18 + bob); ctx.closePath();
      ctx.stroke();
      // Constellation stars
      ctx.fillStyle = '#e0f2fe';
      [[-6, -28], [0, -23], [6, -27], [3, -18], [-3, -18]].forEach(([sx, sy]) => {
        ctx.beginPath(); ctx.arc(sx, sy + bob, 1.4, 0, TAU); ctx.fill();
      });
      // Belt
      ctx.fillStyle = '#312e81';
      ctx.fillRect(-9, -16 + bob, 18, 3);
    } else {
      // Base Character: Tattered white shirt with ragged hem, collar neckline, and tear mark (from sprite sheet)
      // Base shirt body
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-8, -31 + bob);
      ctx.lineTo(8, -31 + bob);
      ctx.lineTo(8.5, -15 + bob);
      ctx.lineTo(-8.5, -15 + bob);
      ctx.closePath();
      ctx.fill();

      // Neck / Collar opening showing bare skin
      ctx.fillStyle = '#f6caa1';
      ctx.beginPath();
      ctx.moveTo(-3, -31 + bob);
      ctx.lineTo(0, -25 + bob);
      ctx.lineTo(3, -31 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d29b71';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-3, -31 + bob); ctx.lineTo(0, -25 + bob); ctx.lineTo(3, -31 + bob);
      ctx.stroke();

      // Small tattered chest tear mark (as seen in the sprite sheet template)
      ctx.fillStyle = '#e8b88d';
      ctx.beginPath();
      ctx.moveTo(3, -26 + bob);
      ctx.lineTo(4.5, -24 + bob);
      ctx.lineTo(2.5, -23 + bob);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#c79165';
      ctx.fillRect(3, -25 + bob, 1, 1);

      // Shirt bottom ragged zigzag cut hem
      ctx.fillStyle = '#e2e8f0'; // Subtle cloth shading on lower hem
      ctx.fillRect(-8.5, -18 + bob, 17, 3);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.moveTo(-8.5, -15 + bob);
      ctx.lineTo(-6, -12 + bob);
      ctx.lineTo(-3, -15 + bob);
      ctx.lineTo(0, -12 + bob);
      ctx.lineTo(3, -15 + bob);
      ctx.lineTo(6, -12 + bob);
      ctx.lineTo(8.5, -15 + bob);
      ctx.lineTo(8.5, -18 + bob);
      ctx.lineTo(-8.5, -18 + bob);
      ctx.closePath();
      ctx.fill();

      // Subtle shadow creases on left side
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-8, -28 + bob, 2, 10);
      ctx.fillRect(7, -27 + bob, 1.5, 9);
    }
  }

  // --- DISTINCT HELMET DESIGNS ---
  private drawHelmet(ctx: CanvasRenderingContext2D, bob: number, plume: number, headItem?: Item | null) {
    const set = headItem?.armorSet;
    const col = set ? ARMOR_SETS[set].color : RAR_COLORS[headItem?.rar || 0];
    const trim = set ? ARMOR_SETS[set].trimColor : '#fbbf24';

    // Face / Head base
    ctx.fillStyle = '#f1c9a0';
    ctx.beginPath(); ctx.arc(0, -38 + bob, 8, 0, TAU); ctx.fill();

    if (set === 'iron') {
      // 1. Iron Greathelm: Cylindrical bucket helm, reinforced cross brow band, cross visor slit, flowing crimson horsehair plume
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.moveTo(-10.5, -48 + bob);
      ctx.lineTo(10.5, -48 + bob);
      ctx.lineTo(11, -33 + bob);
      ctx.lineTo(-10.5, -33 + bob);
      ctx.closePath();
      ctx.fill();

      // Top curvature
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath(); ctx.arc(0, -47 + bob, 10.5, Math.PI, 0); ctx.fill();

      // Polished brass cruciform visor reinforcement
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-10.5, -40.5 + bob, 21, 4.5); // Horizontal band
      ctx.fillRect(-2, -47 + bob, 4, 14);       // Vertical band

      // T-shaped vision slits
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-8.5, -39.5 + bob, 7, 2.2);
      ctx.fillRect(1.5, -39.5 + bob, 7, 2.2);
      ctx.fillRect(-1, -43 + bob, 2, 7);

      // Crimson horsehair plume flowing in wind
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(0, -50 + bob);
      ctx.quadraticCurveTo(plume - 5, -64 + bob - Math.sin(this.timeSec * 7) * 2, plume - 14, -50 + bob);
      ctx.quadraticCurveTo(plume - 4, -54 + bob, 3, -48 + bob);
      ctx.fill();
    } else if (set === 'huntsman') {
      // 2. Ranger Cowl: Deep cowl hood with folded cloth, leather brow band, pheasant feather
      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      // Hood draping over head & shoulders
      ctx.moveTo(-12, -31 + bob);
      ctx.quadraticCurveTo(-11, -49 + bob, 0, -50 + bob);
      ctx.quadraticCurveTo(11, -49 + bob, 11, -34 + bob);
      ctx.lineTo(7, -34 + bob);
      ctx.quadraticCurveTo(5, -44 + bob, -3, -44 + bob);
      ctx.quadraticCurveTo(-9, -43 + bob, -8, -31 + bob);
      ctx.closePath();
      ctx.fill();

      // Face shadow in hood
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.beginPath(); ctx.arc(1, -39 + bob, 6.5, 0, TAU); ctx.fill();

      // Focused eyes
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(2, -40 + bob, 3, 2);

      // Brown leather brow strap with gold buckle
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-11, -42 + bob, 18, 2.5);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-4, -43 + bob, 3.5, 4.5);

      // Pheasant hunting feather tucked into band
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.moveTo(-8, -43 + bob);
      ctx.quadraticCurveTo(plume - 12, -56 + bob, plume - 18, -60 + bob);
      ctx.quadraticCurveTo(plume - 10, -52 + bob, -6, -41 + bob);
      ctx.fill();
    } else if (set === 'dragon') {
      // 3. Dragon Horned Helm: Crimson dragon bone, twin swept horns, glowing molten eye slit
      ctx.fillStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.arc(0, -40 + bob, 10.5, Math.PI, 0);
      ctx.lineTo(10.5, -34 + bob);
      ctx.lineTo(-10.5, -34 + bob);
      ctx.closePath();
      ctx.fill();

      // Sharp cheek guards
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.moveTo(-10.5, -34 + bob); ctx.lineTo(-5, -28 + bob); ctx.lineTo(-5, -34 + bob); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(10.5, -34 + bob); ctx.lineTo(5, -28 + bob); ctx.lineTo(5, -34 + bob); ctx.fill();

      // Swept dragon horns
      ctx.fillStyle = '#f59e0b';
      // Front horn
      ctx.beginPath();
      ctx.moveTo(3, -46 + bob);
      ctx.quadraticCurveTo(14, -58 + bob, 18, -65 + bob);
      ctx.quadraticCurveTo(11, -55 + bob, 1, -43 + bob);
      ctx.fill();
      // Back horn
      ctx.beginPath();
      ctx.moveTo(-5, -46 + bob);
      ctx.quadraticCurveTo(-16, -58 + bob, -20, -65 + bob);
      ctx.quadraticCurveTo(-12, -55 + bob, -3, -43 + bob);
      ctx.fill();

      // Glowing molten eye slit
      const eyeGlow = 0.8 + Math.sin(this.timeSec * 8) * 0.2;
      ctx.fillStyle = `rgba(251, 191, 36, ${eyeGlow})`;
      ctx.fillRect(1, -39 + bob, 9, 2.5);
    } else if (set === 'astral') {
      // 4. Astral Diadem: Celestial platinum crown, glowing third-eye sapphire gem, floating starlight halo
      // Flowing cosmic hair
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, -38 + bob, 8.5, 0, TAU);
      ctx.fill();

      // Platinum diadem band
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(-9, -41 + bob, 18, 3.5);
      // Diadem front peak
      ctx.beginPath();
      ctx.moveTo(-3, -41 + bob); ctx.lineTo(0, -48 + bob); ctx.lineTo(3, -41 + bob); ctx.fill();

      // Glowing third-eye sapphire
      ctx.fillStyle = '#a855f7';
      ctx.beginPath(); ctx.arc(0, -43 + bob, 2.5, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, -43 + bob, 1, 0, TAU); ctx.fill();

      // Eye
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(2, -38 + bob, 4, 2.5);

      // Floating starlight halo spinning overhead
      const haloBob = Math.sin(this.timeSec * 4) * 2;
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.75)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(0, -53 + bob + haloBob, 11, 3.5, 0.1, 0, TAU);
      ctx.stroke();

      // Halo starlight sparks
      const sparkA = this.timeSec * 5;
      const hx = Math.cos(sparkA) * 11;
      const hy = Math.sin(sparkA) * 3.5;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(hx, -53 + bob + haloBob + hy, 1.8, 0, TAU); ctx.fill();
    } else {
      // Base Character (from attached sprite sheet):
      // Clean rounded bald head, pixel-accurate skin tone, dark eyes, ear, and jaw outline
      // Head base skin
      ctx.fillStyle = '#f6caa1';
      ctx.beginPath();
      ctx.arc(0, -38 + bob, 8.5, 0, TAU);
      ctx.fill();

      // Top-left soft highlight on forehead
      ctx.fillStyle = '#fde2c9';
      ctx.beginPath();
      ctx.arc(-2, -40 + bob, 5, 0, TAU);
      ctx.fill();

      // Jaw and neck shadow outline
      ctx.fillStyle = '#d29b71';
      ctx.fillRect(-6.5, -31 + bob, 13, 2); // Neck shadow
      ctx.beginPath();
      ctx.arc(-6.5, -37 + bob, 2.2, 0, TAU); // Ear
      ctx.fill();

      // Ear highlight
      ctx.fillStyle = '#f6caa1';
      ctx.beginPath();
      ctx.arc(-6, -37 + bob, 1.4, 0, TAU);
      ctx.fill();

      // Expressive dark pixel eyes (as shown in the sprite template)
      ctx.fillStyle = '#1e1b2e';
      ctx.fillRect(2.5, -39.5 + bob, 3, 4);

      // Eye glint
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(3, -39.5 + bob, 1.2, 1.5);

      // Brow pixel line
      ctx.fillStyle = '#a16e45';
      ctx.fillRect(1.5, -42 + bob, 4.5, 1.2);
    }
  }

  // --- PLAYER RENDERING WITH ARTICULATED WALKING LEGS & 4 ARMOR PIECES ---
  private renderPlayer(ctx: CanvasRenderingContext2D) {
    const p = this.player;
    const cx = p.x + p.w / 2;
    const fy = p.y + p.h;
    const eq = p.eq;
    const moving = p.ground && Math.abs(p.vx) > 30;
    const air = !p.ground;
    const wt = eq.weapon.type || 'sword';
    const W_ = WEAPON_TYPES[wt];

    if (p.ground) {
      ctx.fillStyle = 'rgba(0,0,0,.28)';
      ctx.beginPath(); ctx.ellipse(cx, fy, 13, 4, 0, 0, TAU); ctx.fill();
    }

    ctx.save();
    ctx.translate(cx, fy);
    ctx.scale(p.face * (p.sx || 1), p.sy || 1);

    if (p.invulnerableTimer > 0 && Math.floor(this.timeSec * 22) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    const bob = moving ? Math.abs(Math.sin(p.run || 0)) * -2 : Math.sin(this.timeSec * 3) * 0.8;
    const k = p.isAttacking ? 1 - (p.attackTimer / p.attackDuration) : -1;
    let thr = 0;

    const hasOff = !!eq.offhand;
    const offType = hasOff ? eq.offhand?.type : null;
    const offCol = hasOff ? RAR_COLORS[eq.offhand?.rar || 0] : null;
    const isDualGuns = wt === 'gun' && offType === 'gun';
    const isDualBlades = hasOff && !W_.ranged && offType && !WEAPON_TYPES[offType].ranged;

    let armA = -0.5 + (moving ? Math.sin((p.run || 0) + Math.PI) * 0.5 : Math.sin(this.timeSec * 3) * 0.08);
    let leftArmA = hasOff
      ? (-0.6 + (moving ? Math.sin(p.run || 0) * 0.4 : Math.sin(this.timeSec * 3) * 0.08))
      : (0.4 + (moving ? Math.sin(p.run || 0) * 0.5 : 0));

    if (air) armA = p.vy < 0 ? -1.2 : -0.2;

    let bowBend = 0;
    if (wt === 'bow') {
      if (k >= 0) {
        if (k < 0.42) {
          bowBend = k / 0.42;
          armA = -1.55;
          leftArmA = -1.55 + bowBend * 0.35;
        } else {
          bowBend = Math.max(0, 1 - (k - 0.42) * 6) * Math.sin((k - 0.42) * 35) * 0.3;
          armA = -1.55;
          leftArmA = -1.1;
        }
      } else {
        armA = -0.55 + (moving ? Math.sin((p.run || 0) + Math.PI) * 0.4 : Math.sin(this.timeSec * 3) * 0.06);
      }
    } else if (k >= 0) {
      if (isDualGuns) {
        armA = k < 0.22 ? -1.55 : -1.95 + ((k - 0.22) / 0.78) * 0.5;
        leftArmA = k < 0.34 ? -1.52 : -1.92 + ((k - 0.34) / 0.66) * 0.5;
      } else if (isDualBlades) {
        armA = k < 0.25 ? -2.4 : -2.6 + ((k - 0.25) / 0.75) * 3.2;
        leftArmA = k < 0.32 ? -0.3 : -0.3 - ((k - 0.32) / 0.68) * 2.8;
      } else if (hasOff && wt === 'gun') {
        armA = k < 0.22 ? -1.55 : -1.95 + ((k - 0.22) / 0.78) * 0.5;
        leftArmA = -1.1 + Math.sin(k * Math.PI) * 0.4;
      } else if (hasOff && offType === 'gun') {
        armA = k < 0.25 ? -2.4 : -2.6 + ((k - 0.25) / 0.75) * 3.2;
        leftArmA = k < 0.35 ? -1.55 : -1.95 + ((k - 0.35) / 0.65) * 0.5;
      } else if (W_.anim === 'dagger') {
        armA = -1.4 + Math.sin(k * TAU * 2) * 0.25;
        thr = Math.sin(k * TAU) * 12;
      } else if (W_.anim === 'spear') {
        armA = -1.45;
        thr = Math.sin(Math.min(1, k) * Math.PI) * 22;
        leftArmA = -1.3;
      } else if (W_.anim === 'gun') {
        armA = k < 0.25 ? -1.55 : -1.95 + ((k - 0.25) / 0.75) * 0.5;
      } else if (W_.anim === 'greatsword') {
        const w1 = W_.w1;
        if (k < w1) {
          armA = -2.8 - (k / w1) * 0.4;
          leftArmA = armA + 0.2;
        } else {
          const pr = (k - w1) / (1 - w1);
          armA = -3.2 + pr * 4.2;
          leftArmA = armA + 0.3;
        }
      } else if (W_.anim === 'battleaxe') {
        const w1 = W_.w1;
        armA = k < w1 ? -1.8 - (k / w1) * 1.6 : -3.4 + ((k - w1) / (1 - w1)) * 3.8;
        leftArmA = armA + 0.25;
      } else if (W_.anim === 'hammer') {
        const w1 = W_.w1;
        armA = k < w1 ? -2.6 - (k / w1) * 0.6 : -3.2 + ((k - w1) / (1 - w1)) * 3.8;
        leftArmA = armA + 0.2;
      } else if (W_.anim === 'handaxe') {
        armA = k < 0.3 ? -2.2 : -2.2 + ((k - 0.3) / 0.7) * 3.0;
      } else {
        const w1 = W_.w1;
        armA = k < w1 ? -0.5 - (k / w1) * 2.4 : k < w1 + 0.3 ? -2.9 + ((k - w1) / 0.3) * 3.2 : 0.3 - ((k - w1 - 0.3) / (1 - w1 - 0.3)) * 0.8;
        if (W_.hand === 'two') leftArmA = armA + 0.2;
      }
    }

    const ac = eq.body?.armorSet ? ARMOR_SETS[eq.body.armorSet].color : RAR_COLORS[eq.body?.rar || 0];
    const hc = eq.head?.armorSet ? ARMOR_SETS[eq.head.armorSet].color : RAR_COLORS[eq.head?.rar || 0];
    const lc = eq.legs?.armorSet ? ARMOR_SETS[eq.legs.armorSet].color : '#4a3a2c';
    const scCol = eq.shoes?.armorSet ? ARMOR_SETS[eq.shoes.armorSet].trimColor : '#2c1e14';
    const wc = RAR_COLORS[eq.weapon.rar];

    // 1. Back Leg (Articulated with thigh, knee, calf, foot)
    this.drawArticulatedLeg(ctx, -4, -14 + bob, p.run || 0, moving, air, p.vy, true, lc, scCol, eq.legs?.armorSet);

    // 2. Back Arm & Offhand Weapon
    ctx.save();
    ctx.translate(-5, -27 + bob);
    ctx.rotate(leftArmA);

    if (eq.body) {
      // Armored arm sleeve
      ctx.fillStyle = ac; ctx.fillRect(-2.5, 0, 5, 6);
      ctx.fillStyle = '#f6caa1'; ctx.fillRect(-2.2, 5, 4.4, 6);
    } else {
      // Base character: White sleeveless ragged shirt cuff & bare skin arm
      ctx.fillStyle = '#f8fafc'; ctx.fillRect(-2.8, -0.5, 5.6, 3.5);
      ctx.fillStyle = '#273447'; ctx.fillRect(-2.8, 2.5, 5.6, 1); // Dark inner shirt rim
      ctx.fillStyle = '#f6caa1'; ctx.fillRect(-2.4, 3, 4.8, 8);
      ctx.fillStyle = '#d29b71'; ctx.fillRect(-2.4, 3, 1.2, 8); // Arm shadow
    }

    if (hasOff && offType && offCol) {
      ctx.save();
      ctx.translate(0, 11);
      this.drawWeaponShape(ctx, offType, offCol, eq.offhand?.swordStyle, eq.offhand?.element, undefined, eq.offhand?.gunStyle);
      ctx.restore();
      ctx.fillStyle = '#f6caa1'; ctx.beginPath(); ctx.arc(0, 11, 3.6, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-2.5, 9.5, 5, 2.2);
    } else if (wt === 'bow' && k >= 0) {
      ctx.fillStyle = '#f6caa1'; ctx.beginPath(); ctx.arc(0, 11, 3.6, 0, TAU); ctx.fill();
      ctx.fillStyle = '#2c1c0e'; ctx.fillRect(-2, 9, 4, 3);
    }
    ctx.restore();

    // Back Shoulder (Pauldron if armored, or white shirt shoulder cap)
    if (eq.body) {
      ctx.fillStyle = ac; ctx.beginPath(); ctx.arc(-7, -23 + bob, 6, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.arc(-7, -23 + bob, 2.8, 0, TAU); ctx.fill();
    } else {
      ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(-7, -23 + bob, 4.5, 0, TAU); ctx.fill();
      ctx.fillStyle = '#cbd5e1'; ctx.fillRect(-8, -21 + bob, 3, 2);
    }

    // 3. Torso Cuirass & Belts (Distinct visual design per armor set, or tattered shirt)
    this.drawTorso(ctx, bob, eq.body);

    // 4. Front Leg (Articulated with thigh, knee, calf, foot)
    this.drawArticulatedLeg(ctx, 4, -14 + bob, p.run || 0, moving, air, p.vy, false, lc, scCol, eq.legs?.armorSet);

    // 5. Head, Helmet & Dynamic Set Crest/Plume
    this.drawHelmet(ctx, bob, p.plume || 0, eq.head);

    // 6. Front Weapon Arm & Hand Anchor
    ctx.save();
    ctx.translate(4, -27 + bob);
    ctx.rotate(armA);

    if (eq.body) {
      ctx.fillStyle = ac; ctx.fillRect(-2.5, 0, 5, 6);
      ctx.fillStyle = '#f6caa1'; ctx.fillRect(-2.2, 5, 4.4, 6);
    } else {
      // Base character: White sleeveless ragged shirt cuff & bare skin arm
      ctx.fillStyle = '#f8fafc'; ctx.fillRect(-2.8, -0.5, 5.6, 3.5);
      ctx.fillStyle = '#273447'; ctx.fillRect(-2.8, 2.5, 5.6, 1);
      ctx.fillStyle = '#f6caa1'; ctx.fillRect(-2.4, 3, 4.8, 8);
      ctx.fillStyle = '#d29b71'; ctx.fillRect(-2.4, 3, 1.2, 8); // Arm shadow
    }

    if (wt === 'bow') {
      ctx.save();
      ctx.translate(0, 11);
      ctx.rotate(Math.PI / 2);
      this.drawWeaponShape(ctx, 'bow', wc, undefined, eq.weapon.element, bowBend);
      ctx.restore();
      ctx.fillStyle = '#f6caa1'; ctx.beginPath(); ctx.arc(0, 11, 3.8, 0, TAU); ctx.fill();
      ctx.fillStyle = '#2c1c0e'; ctx.fillRect(-2.5, 9.5, 5, 2.5);
    } else {
      ctx.save();
      ctx.translate(0, 11 + thr);
      this.drawWeaponShape(ctx, wt, wc, eq.weapon.swordStyle, eq.weapon.element, undefined, eq.weapon.gunStyle);
      ctx.restore();
      ctx.fillStyle = '#f6caa1'; ctx.beginPath(); ctx.arc(0, 11 + thr, 3.8, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-2.5, 9.5 + thr, 5, 2.2);
    }
    ctx.restore();

    // Front Shoulder (Pauldron if armored, or white shirt shoulder cap)
    if (eq.body) {
      ctx.fillStyle = ac; ctx.beginPath(); ctx.arc(4, -25 + bob, 6, 0, TAU); ctx.fill();
    } else {
      ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.arc(4, -25 + bob, 4.5, 0, TAU); ctx.fill();
      ctx.fillStyle = '#cbd5e1'; ctx.fillRect(2, -23 + bob, 3, 2);
    }

    // 7. Slashing & Thrust Trails (Enhanced with fire curves if fire element)
    if (k >= 0 && !W_.ranged) {
      const elem = eq.weapon.element || 'none';
      const trailCol = elem !== 'none' ? ELEMENT_INFO[elem].color : wc;

      if (W_.thrust || W_.anim === 'dagger') {
        const Lr = W_.reach * Math.min(1, k / 0.4);
        ctx.save();
        ctx.lineCap = 'round';
        ctx.globalAlpha = Math.max(0, 1 - k) * 0.85;
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = wt === 'spear' ? 4 : 2.5;
        ctx.beginPath(); ctx.moveTo(12, -24 + bob); ctx.lineTo(12 + Lr, -24 + bob); ctx.stroke();
        ctx.strokeStyle = trailCol;
        ctx.lineWidth = 8;
        ctx.globalAlpha *= 0.35;
        ctx.beginPath(); ctx.moveTo(12, -24 + bob); ctx.lineTo(12 + Lr * 0.9, -24 + bob); ctx.stroke();
        ctx.restore();
      } else if (wt !== 'hammer') {
        const pr = (k - W_.w1) / 0.45;
        if (pr >= 0 && pr < 1) {
          const rad = wt === 'greatsword' ? 74 : wt === 'scythe' ? 66 : wt === 'battleaxe' ? 58 : wt === 'handaxe' ? 44 : 48;
          const a0 = -2.7;
          const a1 = a0 + pr * 3.6;
          ctx.save();
          ctx.translate(4, -27 + bob);
          ctx.globalAlpha = (1 - pr) * 0.9;
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = wt === 'greatsword' ? 9 : 6;
          ctx.beginPath(); ctx.arc(0, 0, rad, Math.max(a0, a1 - 1.6), a1); ctx.stroke();
          ctx.strokeStyle = trailCol;
          ctx.lineWidth = wt === 'greatsword' ? 16 : 11;
          ctx.globalAlpha = (1 - pr) * 0.4;
          ctx.beginPath(); ctx.arc(0, 0, rad - 2, Math.max(a0, a1 - 2.2), a1); ctx.stroke();

          // Extra stylized flame tongues leaping along the slash crescent!
          if (elem === 'fire') {
            ctx.globalAlpha = (1 - pr) * 0.95;
            const midA = (Math.max(a0, a1 - 1.6) + a1) * 0.5;
            const fx = Math.cos(midA) * rad;
            const fy = Math.sin(midA) * rad;
            this.drawStylizedFlame(ctx, fx, fy, 14, 22, this.timeSec, 0);
          }
          ctx.restore();
        }
      }

      if (isDualBlades && k >= 0.12 && k < 0.85 && offCol) {
        const offPr = (k - 0.12) / 0.73;
        ctx.save();
        ctx.translate(-5, -27 + bob);
        ctx.globalAlpha = (1 - offPr) * 0.85;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(0, 0, 48, Math.PI * 0.7 - offPr * 2.5, Math.PI * 0.7); ctx.stroke();
        ctx.strokeStyle = offCol;
        ctx.lineWidth = 9;
        ctx.globalAlpha = (1 - offPr) * 0.4;
        ctx.beginPath(); ctx.arc(0, 0, 46, Math.PI * 0.7 - offPr * 2.5, Math.PI * 0.7); ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }

  // --- STYLIZED PROCEDURAL FIRE ANIMATION (MATCHING THE 8-FRAME SHEET ATTACHMENT) ---
  private drawStylizedFlame(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    animTime: number,
    phaseOffset: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    // 8 frame progression matching the user's attachment
    const f = Math.floor((animTime * 12 + phaseOffset) % 8);
    const frames = [
      { waist: 0.85, tipX: -2, tipH: 1.0, tearY: -h * 1.25, tearSz: 3.2 },
      { waist: 0.95, tipX: 1,  tipH: 1.1, tearY: -h * 1.30, tearSz: 2.8 },
      { waist: 1.10, tipX: 2,  tipH: 1.05, tearY: -h * 1.35, tearSz: 2.5 },
      { waist: 0.90, tipX: -1, tipH: 0.95, tearY: -h * 1.20, tearSz: 3.6 },
      { waist: 0.80, tipX: 1.5, tipH: 1.15, tearY: -h * 1.28, tearSz: 3.0 },
      { waist: 1.05, tipX: -1.5, tipH: 1.0, tearY: -h * 1.32, tearSz: 3.8 },
      { waist: 0.88, tipX: 2,  tipH: 1.08, tearY: -h * 1.26, tearSz: 2.7 },
      { waist: 0.92, tipX: -0.5, tipH: 1.02, tearY: -h * 1.22, tearSz: 3.2 },
    ];

    const fr = frames[f];
    const hw = (w / 2) * fr.waist;
    const th = h * fr.tipH;

    // 1. Outer Flame Layer (#ea580c to #f97316) with bottom notch
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(0, 0); // Notched base
    ctx.lineTo(-hw * 0.4, 1.2);
    ctx.quadraticCurveTo(-hw * 1.25, -th * 0.35, -hw * 0.7, -th * 0.65);
    ctx.quadraticCurveTo(-hw * 1.15, -th * 0.75, fr.tipX, -th);
    ctx.quadraticCurveTo(hw * 1.15, -th * 0.75, hw * 0.7, -th * 0.65);
    ctx.quadraticCurveTo(hw * 1.25, -th * 0.35, hw * 0.4, 1.2);
    ctx.closePath();
    ctx.fill();

    // 2. Mid Flame Layer (#facc15 golden yellow)
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-hw * 0.28, 0.6);
    ctx.quadraticCurveTo(-hw * 0.85, -th * 0.3, -hw * 0.45, -th * 0.55);
    ctx.quadraticCurveTo(-hw * 0.65, -th * 0.7, fr.tipX * 0.7, -th * 0.85);
    ctx.quadraticCurveTo(hw * 0.65, -th * 0.7, hw * 0.45, -th * 0.55);
    ctx.quadraticCurveTo(hw * 0.85, -th * 0.3, hw * 0.28, 0.6);
    ctx.closePath();
    ctx.fill();

    // 3. Inner Hot Core Layer (#ffffff white glow)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-hw * 0.16, 0.3);
    ctx.quadraticCurveTo(-hw * 0.45, -th * 0.2, -hw * 0.2, -th * 0.38);
    ctx.quadraticCurveTo(0, -th * 0.55, hw * 0.2, -th * 0.38);
    ctx.quadraticCurveTo(hw * 0.45, -th * 0.2, hw * 0.16, 0.3);
    ctx.closePath();
    ctx.fill();

    // 4. Detached Rising Teardrop Ember
    const tearBob = Math.sin(animTime * 14 + phaseOffset) * 2;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.ellipse(fr.tipX + tearBob * 0.4, fr.tearY + tearBob, fr.tearSz * 0.8, fr.tearSz * 1.3, 0.15, 0, TAU);
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(fr.tipX + tearBob * 0.4, fr.tearY + tearBob, fr.tearSz * 0.45, fr.tearSz * 0.75, 0.15, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  // --- WEAPON SPRITES WITH REAL STYLIZED FLAME ANIMATIONS ---
  private drawWeaponShape(
    ctx: CanvasRenderingContext2D,
    type: WeaponType,
    c: string,
    swordStyle?: string,
    element?: WeaponElement,
    pBend?: number,
    gunStyle?: GunStyle
  ) {
    const br = '#5b3d22';
    const gold = '#e0b84a';
    const hl = 'rgba(255,255,255,.6)';
    const iron = '#2a323d';

    if (type === 'dagger') {
      ctx.fillStyle = br; ctx.fillRect(-1.5, -4, 3, 8);
      ctx.fillStyle = gold; ctx.fillRect(-4.5, 4, 9, 2);
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.moveTo(-2.5, 6); ctx.lineTo(2.5, 6); ctx.lineTo(1.5, 22); ctx.lineTo(0, 29); ctx.lineTo(-2, 22); ctx.closePath(); ctx.fill();
      ctx.fillStyle = hl; ctx.fillRect(-0.4, 7, 1.2, 16);
    } else if (type === 'sword') {
      if (swordStyle === 'katana') {
        ctx.fillStyle = '#1e1b4b'; ctx.fillRect(-1.5, -4, 3, 11);
        ctx.fillStyle = gold; ctx.beginPath(); ctx.ellipse(0, 7, 5.5, 2, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.moveTo(-1.5, 8); ctx.lineTo(-2.5, 34); ctx.lineTo(0, 42); ctx.lineTo(2, 36); ctx.lineTo(1.5, 8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = hl; ctx.beginPath(); ctx.moveTo(0, 9); ctx.lineTo(1, 35); ctx.lineTo(0, 41); ctx.stroke();
      } else if (swordStyle === 'broadsword') {
        ctx.fillStyle = br; ctx.fillRect(-1.5, -4, 3, 10);
        ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(0, 5, 6, 0, TAU); ctx.fill();
        ctx.fillStyle = iron; ctx.beginPath(); ctx.arc(0, 5, 3.5, 0, TAU); ctx.fill();
        ctx.fillStyle = c; ctx.fillRect(-3.5, 9, 7, 34);
        ctx.beginPath(); ctx.moveTo(-3.5, 43); ctx.lineTo(0, 50); ctx.lineTo(3.5, 43); ctx.fill();
        ctx.fillStyle = hl; ctx.fillRect(-0.5, 10, 1.5, 32);
      } else if (swordStyle === 'scimitar') {
        ctx.fillStyle = br; ctx.fillRect(-1.5, -4, 3, 10);
        ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(-7, 6); ctx.quadraticCurveTo(0, 8, 7, 6); ctx.lineWidth = 2.5; ctx.stroke();
        ctx.fillStyle = c;
        ctx.beginPath(); ctx.moveTo(-2, 8); ctx.quadraticCurveTo(-4, 22, -1, 33); ctx.lineTo(6, 38); ctx.quadraticCurveTo(3, 24, 2, 8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = hl; ctx.beginPath(); ctx.moveTo(0, 9); ctx.quadraticCurveTo(2, 24, 5, 37); ctx.stroke();
      } else if (swordStyle === 'rapier') {
        ctx.fillStyle = iron; ctx.fillRect(-1, -4, 2, 10);
        ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(0, -4, 2.5, 0, TAU); ctx.fill();
        ctx.strokeStyle = gold; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(-3.5, 5, 3.5, -Math.PI * 0.5, Math.PI * 0.5); ctx.arc(3.5, 5, 3.5, -Math.PI * 0.5, Math.PI * 0.5); ctx.stroke();
        ctx.fillStyle = c; ctx.fillRect(-1, 8, 2, 36);
        ctx.beginPath(); ctx.moveTo(-1, 44); ctx.lineTo(0, 50); ctx.lineTo(1, 44); ctx.fill();
      } else {
        ctx.fillStyle = br; ctx.fillRect(-1.5, -4, 3, 10);
        ctx.beginPath(); ctx.arc(0, -5, 2.5, 0, TAU); ctx.fill();
        ctx.fillStyle = gold; ctx.fillRect(-7, 6, 14, 3);
        ctx.fillStyle = c; ctx.fillRect(-2.5, 9, 5, 34);
        ctx.beginPath(); ctx.moveTo(-2.5, 43); ctx.lineTo(0, 51); ctx.lineTo(2.5, 43); ctx.fill();
        ctx.fillStyle = hl; ctx.fillRect(-0.5, 10, 1.5, 32);
      }
    } else if (type === 'greatsword') {
      ctx.fillStyle = iron; ctx.fillRect(-2, -12, 4, 16);
      ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(0, -13, 3.5, 0, TAU); ctx.fill();
      ctx.fillStyle = gold; ctx.fillRect(-12, 4, 24, 4.5);
      ctx.fillStyle = c; ctx.fillRect(-4.5, 8.5, 9, 56);
      ctx.beginPath(); ctx.moveTo(-4.5, 64.5); ctx.lineTo(0, 74); ctx.lineTo(4.5, 64.5); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.3)'; ctx.fillRect(-1, 10, 2, 48);
      ctx.fillStyle = hl; ctx.fillRect(1.5, 10, 1.5, 48);
    } else if (type === 'handaxe') {
      ctx.fillStyle = br; ctx.fillRect(-1.5, -4, 3, 38);
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.moveTo(1.5, 20); ctx.lineTo(14, 16); ctx.lineTo(16, 30); ctx.lineTo(1.5, 28); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = hl; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(14, 16); ctx.lineTo(16, 30); ctx.stroke();
      ctx.fillStyle = gold; ctx.fillRect(-2.5, 20, 5, 2); ctx.fillRect(-2.5, 28, 5, 2);
    } else if (type === 'battleaxe') {
      ctx.fillStyle = br; ctx.fillRect(-2, -8, 4, 58);
      ctx.fillStyle = c;
      ctx.beginPath(); ctx.moveTo(2, 32); ctx.quadraticCurveTo(22, 26, 20, 44); ctx.quadraticCurveTo(20, 58, 2, 52); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-2, 32); ctx.quadraticCurveTo(-22, 26, -20, 44); ctx.quadraticCurveTo(-20, 58, -2, 52); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = hl; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(19, 30); ctx.quadraticCurveTo(22, 44, 19, 54); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-19, 30); ctx.quadraticCurveTo(-22, 44, -19, 54); ctx.stroke();
      ctx.fillStyle = gold; ctx.fillRect(-3.5, 36, 7, 12); ctx.beginPath(); ctx.arc(0, 42, 4, 0, TAU); ctx.fill();
    } else if (type === 'spear') {
      ctx.fillStyle = br; ctx.fillRect(-1.5, -12, 3, 74);
      ctx.fillStyle = '#d2452f'; ctx.fillRect(-3, 56, 6, 5);
      ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, 84); ctx.lineTo(6, 66); ctx.lineTo(0, 60); ctx.lineTo(-6, 66); ctx.closePath(); ctx.fill();
      ctx.fillStyle = hl; ctx.beginPath(); ctx.moveTo(0, 80); ctx.lineTo(2, 66); ctx.lineTo(0, 62); ctx.fill();
    } else if (type === 'hammer') {
      ctx.fillStyle = br; ctx.fillRect(-2, -6, 4, 54);
      ctx.fillStyle = c; ctx.fillRect(-12, 40, 24, 15);
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-12, 40, 4, 15); ctx.fillRect(8, 40, 4, 15);
      ctx.fillStyle = hl; ctx.fillRect(-8, 42, 16, 2);
      ctx.fillStyle = gold; ctx.fillRect(-3.5, 38, 7, 3);
    } else if (type === 'scythe') {
      ctx.fillStyle = br; ctx.fillRect(-1.5, -8, 3, 66); ctx.fillStyle = gold; ctx.fillRect(-2.5, 52, 5, 2);
      ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(1.5, 50); ctx.quadraticCurveTo(32, 48, 28, 78); ctx.lineTo(23, 68); ctx.quadraticCurveTo(16, 58, 1.5, 58); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = hl; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(4, 52); ctx.quadraticCurveTo(28, 50, 27, 74); ctx.stroke();
    } else if (type === 'bow') {
      const bend = Math.max(0, Math.min(1.2, pBend || 0));
      const limbPull = bend * 7;
      const stringPull = -bend * 18;

      ctx.strokeStyle = '#8c5b30'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, -5); ctx.bezierCurveTo(7 - limbPull * 0.3, -16, 4 - limbPull * 0.8, -26, -3 - limbPull, -34); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, 5); ctx.bezierCurveTo(7 - limbPull * 0.3, 16, 4 - limbPull * 0.8, 26, -3 - limbPull, 34); ctx.stroke();

      ctx.fillStyle = '#4a2e16'; ctx.fillRect(-2, -6, 4, 12);
      ctx.fillStyle = gold; ctx.fillRect(-2.5, -6, 5, 2); ctx.fillRect(-2.5, 4, 5, 2);

      ctx.strokeStyle = 'rgba(245,245,245,.9)'; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-3 - limbPull, -34);
      ctx.lineTo(stringPull - 2, 0);
      ctx.lineTo(-3 - limbPull, 34);
      ctx.stroke();

      if (bend > 0.05 || pBend === undefined) {
        const arrowBack = stringPull - 2;
        const arrowLen = 30;
        ctx.fillStyle = '#b58d59'; ctx.fillRect(arrowBack, -1, arrowLen, 2);
        ctx.fillStyle = c; ctx.beginPath();
        ctx.moveTo(arrowBack + arrowLen, 0); ctx.lineTo(arrowBack + arrowLen - 6, -3.5); ctx.lineTo(arrowBack + arrowLen - 4, 0); ctx.lineTo(arrowBack + arrowLen - 6, 3.5); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#d2452f'; ctx.beginPath();
        ctx.moveTo(arrowBack, 0); ctx.lineTo(arrowBack - 4, -3); ctx.lineTo(arrowBack + 2, 0); ctx.lineTo(arrowBack - 4, 3); ctx.closePath(); ctx.fill();
      }
    } else if (type === 'gun') {
      const gStyle = gunStyle || 'pistol';

      if (gStyle === 'smg') {
        // --- 1. REPEATER SMG: Compact tactical submachine gun with perforated barrel shroud & curved box mag ---
        // Matte dark receiver body
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-3, 0, 6, 18);
        // Wire stock extending backwards
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-2, 0); ctx.lineTo(-7, -8); ctx.lineTo(-7, -13); ctx.lineTo(-2, -13);
        ctx.stroke();
        // Pistol grip
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-2, -7, 4, 8);
        // Curved magazine extending out the bottom
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.moveTo(-4, 6); ctx.quadraticCurveTo(-9, 10, -9, 16); ctx.lineTo(-6, 16); ctx.quadraticCurveTo(-6, 11, -2, 8); ctx.closePath();
        ctx.fill();
        // Vented barrel shroud (heat shield with cooling slots)
        ctx.fillStyle = iron;
        ctx.fillRect(-2.5, 18, 5, 12);
        ctx.fillStyle = '#020617';
        ctx.fillRect(-1.5, 20, 3, 1.6);
        ctx.fillRect(-1.5, 23, 3, 1.6);
        ctx.fillRect(-1.5, 26, 3, 1.6);
        // Short muzzle flash hider
        ctx.fillStyle = gold;
        ctx.fillRect(-3, 30, 6, 2.5);
        // Top tactical picatinny rail
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-1, 2, 2, 14);
        // Rarity trim ring
        ctx.fillStyle = c;
        ctx.fillRect(-2.8, 4, 5.6, 2.5);

      } else if (gStyle === 'rifle') {
        // --- 2. LEVER CARBINE RIFLE: Sleek frontier rifle with walnut stock, lever loop & rifled barrel ---
        // Polished walnut wooden stock
        ctx.fillStyle = br;
        ctx.beginPath();
        ctx.moveTo(-3, -15);
        ctx.lineTo(2, -15);
        ctx.lineTo(3, 4);
        ctx.lineTo(-4, 4);
        ctx.closePath();
        ctx.fill();
        // Brass butt plate
        ctx.fillStyle = gold;
        ctx.fillRect(-3.5, -16, 6, 2);
        // Brass receiver & finger lever loop
        ctx.fillStyle = gold;
        ctx.fillRect(-3, 4, 6, 9);
        ctx.strokeStyle = gold;
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.ellipse(-2, 0, 3.5, 4.5, 0.4, 0, TAU); ctx.stroke();
        // Long steel rifled barrel
        ctx.fillStyle = iron;
        ctx.fillRect(-2, 13, 4, 30);
        ctx.fillStyle = hl;
        ctx.fillRect(-0.6, 14, 1.2, 28);
        // Wooden fore-end under barrel
        ctx.fillStyle = br;
        ctx.fillRect(-2.8, 13, 5.6, 12);
        // Brass barrel bands holding barrel to stock
        ctx.fillStyle = gold;
        ctx.fillRect(-2.8, 16, 5.6, 2);
        ctx.fillRect(-2.5, 33, 5, 2);
        // Front iron bead sight
        ctx.fillStyle = gold;
        ctx.fillRect(-1, 41, 2, 2.5);
        // Rarity accent
        ctx.fillStyle = c;
        ctx.fillRect(-2.5, 7, 5, 3);

      } else if (gStyle === 'sniper') {
        // --- 3. SHARPSHOOTER SNIPER: Heavy long-range rifle with fluted barrel, scope & muzzle brake ---
        // Heavy composite thumbhole stock
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(-4, -18);
        ctx.lineTo(3, -18);
        ctx.lineTo(3.5, 5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fill();
        // Recoil pad
        ctx.fillStyle = '#334155';
        ctx.fillRect(-4.5, -19.5, 8, 2.5);
        // Receiver & bolt handle
        ctx.fillStyle = iron;
        ctx.fillRect(-3.5, 5, 7, 12);
        ctx.fillStyle = gold;
        ctx.fillRect(3.5, 7, 3, 2); ctx.beginPath(); ctx.arc(6.5, 8, 2, 0, TAU); ctx.fill();
        // Telescopic Optical Scope mounted on top
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-7.5, 6, 3, 14); // Scope tube
        // Front and rear scope bells
        ctx.fillStyle = gold;
        ctx.fillRect(-8.5, 5, 5, 2.5);
        ctx.fillRect(-8.5, 18, 5, 2.5);
        // Optical glass glint
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath(); ctx.ellipse(-6, 19.5, 2, 1, 0, 0, TAU); ctx.fill();
        // Heavy fluted sniper barrel (very long and authoritative)
        ctx.fillStyle = '#334155';
        ctx.fillRect(-2.2, 17, 4.4, 38);
        ctx.fillStyle = hl;
        ctx.fillRect(-0.7, 18, 1.4, 35);
        // Folded stabilizing bipod legs
        ctx.fillStyle = '#64748b';
        ctx.fillRect(-3.5, 36, 1.4, 10);
        ctx.fillRect(2.1, 36, 1.4, 10);
        // Multi-port tactical muzzle brake
        ctx.fillStyle = iron;
        ctx.fillRect(-3.8, 55, 7.6, 5);
        ctx.fillStyle = '#020617';
        ctx.fillRect(-3.8, 56.5, 7.6, 1.2);
        // Rarity rune bands
        ctx.fillStyle = c;
        ctx.fillRect(-3, 10, 6, 2.5);
        ctx.fillRect(-2.5, 28, 5, 2);

      } else {
        // --- 4. FLINTLOCK PISTOL: Classic quick-draw pirate/adventurer pistol with curved wood grip ---
        ctx.fillStyle = br;
        ctx.beginPath(); ctx.moveTo(-2, -8); ctx.quadraticCurveTo(-4, -2, -2, 4); ctx.lineTo(2.5, 4); ctx.quadraticCurveTo(1.5, -2, 2, -8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = gold; ctx.beginPath(); ctx.ellipse(0, -8, 2.8, 1.8, 0.1, 0, TAU); ctx.fill();
        ctx.strokeStyle = gold; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(1.2, 2.8, 2.8, 0, Math.PI); ctx.stroke();
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(1, 1.8, 1.2, 2.5);
        ctx.fillStyle = iron; ctx.fillRect(-3.5, 1, 3.5, 5);
        ctx.fillStyle = '#bbb'; ctx.beginPath(); ctx.arc(-2, 0.5, 2, 0, TAU); ctx.fill();
        ctx.fillStyle = iron; ctx.fillRect(-2.5, 2, 5, 22);
        ctx.fillStyle = hl; ctx.fillRect(-0.8, 3, 1.6, 20);
        ctx.fillStyle = c; ctx.fillRect(-3, 7, 6, 3);
        ctx.fillStyle = gold; ctx.fillRect(-3, 16, 6, 2.5);
        ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(-4, 24); ctx.lineTo(-6, 27); ctx.lineTo(6, 27); ctx.lineTo(4, 24); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(0, 27, 4.2, 1.6, 0, 0, TAU); ctx.fill();
      }
    }

    // --- STYLIZED ELEMENTAL FIRE ANIMATION ON WEAPON BLADE (BASED ON ATTACHED IMAGE) ---
    if (element === 'fire') {
      // Draw 3 stylized animated flame tongues dancing along the blade
      this.drawStylizedFlame(ctx, 0, 18, 9, 14, this.timeSec, 0);
      this.drawStylizedFlame(ctx, 1, 28, 10, 16, this.timeSec, 2.5);
      this.drawStylizedFlame(ctx, 0, 38, 8, 12, this.timeSec, 4.8);
    } else if (element === 'ice') {
      // Crystalline frost shimmering along blade
      ctx.fillStyle = '#38bdf8';
      const f1 = Math.sin(this.timeSec * 8) * 1.5;
      ctx.fillRect(-2, 16 + f1, 4, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, 26 - f1, 2, 10);
    } else if (element === 'electric') {
      // Branching lightning sparks
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const z = Math.sin(this.timeSec * 25) * 3;
      ctx.moveTo(-1, 14); ctx.lineTo(z, 24); ctx.lineTo(-z, 32); ctx.lineTo(0, 42);
      ctx.stroke();
    }
  }

  private renderParticles(ctx: CanvasRenderingContext2D) {
    this.particles.forEach(q => {
      const a = Math.max(0, q.l / q.max);
      if (q.type === 'ring') {
        ctx.globalAlpha = a;
        ctx.strokeStyle = q.c;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(q.x, q.y, q.sz * (1 - a), q.sz * (1 - a) * 0.4, 0, 0, TAU);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (q.type === 'spark') {
        ctx.globalAlpha = a;
        ctx.strokeStyle = q.c;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(q.x, q.y);
        ctx.lineTo(q.x - q.vx * 0.04, q.y - q.vy * 0.04);
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else {
        ctx.globalAlpha = a;
        ctx.fillStyle = q.c;
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.sz * (q.g < 0 ? (2 - a) : a), 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  }

  private renderForegroundWeather(ctx: CanvasRenderingContext2D) {
    const am = REGIONS[this.currentRegion].amb;
    this.ambientParticles.forEach(a => {
      if (am === 'snow') {
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.s, 0, TAU); ctx.fill();
      } else if (am === 'leaf') {
        ctx.save();
        ctx.translate(a.x, a.y);
        ctx.rotate(a.ph * 2);
        ctx.fillStyle = 'rgba(110,180,80,.85)';
        ctx.fillRect(-3, -1.5, 6, 3);
        ctx.restore();
      } else if (am === 'ember') {
        ctx.fillStyle = `rgba(255,140,40,${0.4 + 0.4 * Math.sin(a.ph * 3)})`;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.s * 1.2, 0, TAU); ctx.fill();
      } else {
        ctx.fillStyle = `rgba(190,160,255,${0.3 + 0.3 * Math.sin(a.ph * 2)})`;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.s, 0, TAU); ctx.fill();
      }
    });
  }
}

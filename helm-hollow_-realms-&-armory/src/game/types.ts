export type GameState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'BAG' | 'SHOP' | 'PORTAL' | 'GAME_OVER';

export type WeaponType = 
  | 'dagger' 
  | 'sword' 
  | 'greatsword' 
  | 'handaxe' 
  | 'battleaxe' 
  | 'spear' 
  | 'hammer' 
  | 'scythe' 
  | 'bow' 
  | 'gun';

export type WeaponElement = 'none' | 'fire' | 'ice' | 'electric';

export type GunStyle = 'pistol' | 'smg' | 'rifle' | 'sniper';

export type ItemSlot = 'head' | 'body' | 'legs' | 'shoes' | 'weapon' | 'offhand';

export type ArmorSet = 'iron' | 'huntsman' | 'dragon' | 'astral';

export type Rarity = 0 | 1 | 2 | 3 | 4 | 5; // Common, Uncommon, Rare, Epic, Legendary, Mythic

export interface WeaponDef {
  name: string;
  dmg: number;
  reach: number;
  dur: number;
  cd: number;
  crit: number;
  desc: string;
  base: number;
  srar: Rarity;
  w1: number;
  hitK: number;
  anim: string;
  hand: 'one' | 'two';
  ranged?: 'arrow' | 'bullet';
  thrust?: boolean;
  swordStyle?: 'arming' | 'broadsword' | 'scimitar' | 'katana' | 'claymore' | 'rapier';
  gunStyle?: GunStyle;
}

export interface Item {
  id: string;
  slot: ItemSlot;
  rar: Rarity;
  val: number;
  name: string;
  type?: WeaponType;
  element?: WeaponElement;
  armorSet?: ArmorSet;
  swordStyle?: 'arming' | 'broadsword' | 'scimitar' | 'katana' | 'claymore' | 'rapier';
  gunStyle?: GunStyle;
}

export interface Ramp {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  h?: number;
  name?: string;
}

export interface PlayerEquipment {
  head: Item | null;
  body: Item | null;
  legs: Item | null;
  shoes: Item | null;
  weapon: Item;
  offhand: Item | null;
}

export interface PlayerState {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  ground: boolean;
  face: 1 | -1;
  hp: number;
  maxHp: number;
  lvl: number;
  xp: number;
  nextXp: number;
  gold: number;
  wood: number;
  ore: number;
  kills: number;
  dashCooldown: number;
  invulnerableTimer: number;
  combo: number;
  comboTimer: number;
  eq: PlayerEquipment;
  inv: Item[];
  isAttacking: boolean;
  attackDuration: number;
  attackTimer: number;
  weaponType: WeaponType;
  offhandType: WeaponType | null;
  activeSetBonus: string | null;
  run?: number;
  plume?: number;
  sx?: number;
  sy?: number;
}

export interface RegionDef {
  id: number;
  name: string;
  sky: [string, string];
  far: string;
  mid: string;
  ground: string;
  top: string;
  plat: string;
  mobs: string[];
  boss: string;
  bossName: string;
  amb: 'leaf' | 'dust' | 'snow' | 'ember' | 'stars';
  rec: string;
  treeKind: 'oak' | 'chasm' | 'pine' | 'magma' | 'celestial';
  leafCol: string;
  oreCol: string;
}

export interface MobDef {
  w: number;
  h: number;
  hp: number;
  dmg: number;
  spd: number;
  xp: number;
  gold: number;
  kind: 'hop' | 'walk' | 'fly';
  col: string;
}

export interface StatusEffect {
  type: 'burn' | 'freeze' | 'shock';
  duration: number;
  tickTimer?: number;
  damagePerTick?: number;
}

export interface EnemyEntity {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  s: number;
  vx: number;
  vy: number;
  ground: boolean;
  dir: number;
  hp: number;
  max: number;
  dmg: number;
  minX: number;
  maxX: number;
  flash: number;
  ph: number;
  t: number;
  boss: boolean;
  baseY: number;
  jt: number;
  kind: 'hop' | 'walk' | 'fly';
  stun: number;
  sq: number;
  pvy: number;
  slam: boolean;
  hurtCd: number;
  status?: StatusEffect | null;
}

export interface TreeEntity {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  shake: number;
  fell: boolean;
  fallAngle: number;
  fallDir: number;
  logsDropped: boolean;
  regrowTimer?: number;
  burningTimer?: number;
}

export interface ProjectileEntity {
  id: string;
  type: 'arrow' | 'bullet' | 'spell';
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  dmg: number;
  crit: boolean;
  face: number;
  l: number;
  w: number;
  h: number;
  color?: string;
  element?: WeaponElement;
}

export interface PickupEntity {
  id: string;
  kind: 'coin' | 'log' | 'ore' | 'item';
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  phys: boolean;
  ground?: boolean;
  age: number;
  ph: number;
  val?: number;
  it?: Item;
}

export interface ParticleEntity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  l: number;
  max: number;
  c: string;
  sz: number;
  type: 'dot' | 'spark' | 'ring' | 'leaf' | 'flame' | 'frost' | 'lightning';
  g: number;
}

export interface FloatingTextEntity {
  x: number;
  y: number;
  t: string;
  c: string;
  l: number;
  crit?: boolean;
}

export interface SolidPlatform {
  x: number;
  y: number;
  w: number;
  h: number;
  kind: 'hub' | 'plateau' | 'step' | 'outpost';
}

export interface OneWayPlatform {
  x: number;
  y: number;
  w: number;
  h: number;
  groundY?: number;
}

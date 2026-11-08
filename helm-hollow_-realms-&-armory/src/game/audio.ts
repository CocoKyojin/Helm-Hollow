/**
 * Helm Hollow Procedural Web Audio Synth Engine
 * High-performance sound effects for combat, weapons, harvesting, and atmosphere.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // AudioContext will initialize on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.35, this.ctx.currentTime);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playWeaponSwing(type: string) {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    if (type === 'gun') {
      // Gunpowder blast + punch
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.18);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.18);

      // Noise burst for smoke crackle
      this.playNoise(0.12, 0.4);
      return;
    }

    if (type === 'bow') {
      // Bowstring release twang
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(420, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.14);
      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.14);
      return;
    }

    if (type === 'hammer') {
      // Heavy ground thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.28);
      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.28);
      return;
    }

    // Blade / axe swoosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const isHeavy = type === 'greatsword' || type === 'battleaxe' || type === 'scythe';

    osc.type = 'sine';
    const startFreq = isHeavy ? 380 : 540;
    const endFreq = isHeavy ? 90 : 160;
    const dur = isHeavy ? 0.22 : 0.12;

    osc.frequency.setValueAtTime(startFreq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + dur);

    gain.gain.setValueAtTime(isHeavy ? 0.45 : 0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + dur);
  }

  public playHit(isCrit: boolean = false) {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isCrit ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(isCrit ? 480 : 220, t);
    osc.frequency.exponentialRampToValueAtTime(isCrit ? 80 : 50, t + (isCrit ? 0.14 : 0.08));

    gain.gain.setValueAtTime(isCrit ? 0.5 : 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (isCrit ? 0.14 : 0.08));

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + (isCrit ? 0.14 : 0.08));
  }

  public playTreeChop(fell: boolean = false) {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // Wood biting thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(fell ? 160 : 240, t);
    osc.frequency.exponentialRampToValueAtTime(fell ? 40 : 70, t + (fell ? 0.45 : 0.09));

    gain.gain.setValueAtTime(fell ? 0.6 : 0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (fell ? 0.45 : 0.09));

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + (fell ? 0.45 : 0.09));

    if (fell) {
      this.playNoise(0.35, 0.3);
    }
  }

  public playCoin() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, t); // B5
    osc.frequency.setValueAtTime(1318.51, t + 0.04); // E6

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playWoodPickup() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.08);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  public playJump() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(360, t + 0.12);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.12);
  }

  public playDash() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.15);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playLevelUp() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.07);

      gain.gain.setValueAtTime(0.25, t + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + idx * 0.07);
      osc.stop(t + idx * 0.07 + 0.35);
    });
  }

  public playPortalWarp() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.4);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  public playShopBell() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    [1046.5, 1318.5].forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.08);
      gain.gain.setValueAtTime(0.2, t + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.3);
    });
  }

  public playFireIgnite() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // Resonant flame roar
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.22);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.22);

    this.playNoise(0.2, 0.25);
  }

  public playIceFreeze() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // High crystalline chime shimmer
    [1567.98, 2093.00, 2637.02].forEach((freq, i) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + i * 0.03);
      gain.gain.setValueAtTime(0.25, t + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.03 + 0.25);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t + i * 0.03);
      osc.stop(t + i * 0.03 + 0.25);
    });
  }

  public playElectricShock() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    // Fast modulated spark zap
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.setValueAtTime(440, t + 0.03);
    osc.frequency.setValueAtTime(1200, t + 0.06);
    osc.frequency.setValueAtTime(220, t + 0.09);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.16);
  }

  public playEquipArmor() {
    this.initContext();
    if (this.isMuted || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(240, t + 0.1);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  private playNoise(duration: number, volume: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    noise.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
  }
}

export const sound = new SoundEngine();

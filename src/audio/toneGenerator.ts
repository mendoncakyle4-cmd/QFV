/**
 * Physical Tone Synthesizer
 * 
 * Spec rule:
 * "Sound toggle only if sound is implemented and OFF BY DEFAULT."
 * Converts the active field angular frequency omega into an audible sine wave
 * with soft gain ramp to avoid speaker clipping or harsh pops.
 */

class FieldAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isEnabled: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
  }

  public toggle(enabled?: boolean): boolean {
    this.initContext();
    if (!this.ctx || !this.gainNode) return false;

    if (enabled !== undefined) {
      this.isEnabled = enabled;
    } else {
      this.isEnabled = !this.isEnabled;
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isEnabled) {
      if (!this.osc) {
        this.osc = this.ctx.createOscillator();
        this.osc.type = 'sine';
        this.osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        this.osc.connect(this.gainNode);
        this.osc.start();
      }
      // Soft ramp up
      this.gainNode.gain.setTargetAtTime(0.08, this.ctx.currentTime, 0.05);
    } else {
      // Soft ramp down
      this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
    }

    return this.isEnabled;
  }

  public updateFrequency(omega: number) {
    if (!this.ctx || !this.osc || !this.isEnabled) return;
    // Map omega [0.5..8] to audible frequencies [130Hz .. 520Hz]
    const baseFreq = 160;
    const targetFreq = Math.max(80, Math.min(880, baseFreq * omega));
    this.osc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.08);
  }

  public getStatus(): boolean {
    return this.isEnabled;
  }
}

export const toneSynthesizer = new FieldAudioSynthesizer();


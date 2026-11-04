/**
 * Quietide Audio Engine
 * Generates continuous ambient layers with the Web Audio API.
 * Fully offline – no external files required.
 */

type LayerId = "rain" | "ocean" | "forest" | "brown" | "wind";

interface LayerNodes {
  gain: GainNode;
  source: AudioNode;
  started: boolean;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private layers: Partial<Record<LayerId, LayerNodes>> = {};
  private fadeInterval: number | null = null;

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.7;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private createNoiseBuffer(type: "brown" | "white" | "pink" = "brown"): AudioBuffer {
    const ctx = this.ensureContext();
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === "brown") {
      let last = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      }
    } else if (type === "pink") {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    }
    return buffer;
  }

  private createLayer(id: LayerId): LayerNodes {
    const ctx = this.ensureContext();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.masterGain!);

    let source: AudioNode;

    switch (id) {
      case "brown": {
        const buffer = this.createNoiseBuffer("brown");
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        noise.connect(gain);
        source = noise;
        break;
      }
      case "rain": {
        const buffer = this.createNoiseBuffer("pink");
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.value = 1200;
        filter.Q.value = 0.7;
        noise.connect(filter);
        filter.connect(gain);
        source = noise;
        break;
      }
      case "ocean": {
        const buffer = this.createNoiseBuffer("brown");
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 600;
        filter.Q.value = 0.4;
        noise.connect(filter);
        filter.connect(gain);
        source = noise;
        break;
      }
      case "forest": {
        const buffer = this.createNoiseBuffer("pink");
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 800;
        const tone = ctx.createOscillator();
        tone.type = "sine";
        tone.frequency.value = 220;
        const toneGain = ctx.createGain();
        toneGain.gain.value = 0.03;
        tone.connect(toneGain);
        toneGain.connect(gain);
        tone.start();
        noise.connect(filter);
        filter.connect(gain);
        source = noise;
        break;
      }
      case "wind": {
        const buffer = this.createNoiseBuffer("pink");
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 400;
        noise.connect(filter);
        filter.connect(gain);
        source = noise;
        break;
      }
      default:
        source = ctx.createGain();
    }

    return { gain, source, started: false };
  }

  setLayer(id: LayerId, active: boolean, volume: number) {
    if (!this.layers[id]) {
      this.layers[id] = this.createLayer(id);
    }
    const layer = this.layers[id]!;
    const ctx = this.ensureContext();

    if (active && !layer.started) {
      try {
        (layer.source as AudioBufferSourceNode).start(0);
        layer.started = true;
      } catch {
        // already started
      }
    }

    const target = active ? Math.max(0, Math.min(1, volume)) : 0;
    layer.gain.gain.cancelScheduledValues(ctx.currentTime);
    layer.gain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.4);
  }

  fadeOut(seconds = 20) {
    if (!this.masterGain || !this.ctx) return;
    const ctx = this.ctx;
    this.masterGain.gain.cancelScheduledValues(ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + seconds);

    if (this.fadeInterval) window.clearTimeout(this.fadeInterval);
    this.fadeInterval = window.setTimeout(() => {
      this.stopAll();
    }, seconds * 1000 + 200);
  }

  stopAll() {
    Object.values(this.layers).forEach((layer) => {
      if (layer) {
        layer.gain.gain.value = 0;
      }
    });
    if (this.masterGain) this.masterGain.gain.value = 0.7;
  }

  setMasterVolume(v: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, v));
    }
  }
}

export const audioEngine = new AudioEngine();

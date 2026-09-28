// Pure Web Audio API synthesized sounds & ambient generator (Zero external asset dependency)

let audioCtx: AudioContext | null = null;
let currentAmbientNode: { stop: () => void } | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCelebrationChime(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Pleasant major chord chime (C5 - E5 - G5 - C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.8);
    });
  } catch (e) {
    console.warn('Audio chime playback omitted', e);
  }
}

export function playSessionEndAlarm(): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Double beep notification
    [0, 0.25, 0.5].forEach((startDelay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now + startDelay);

      gain.gain.setValueAtTime(0, now + startDelay);
      gain.gain.linearRampToValueAtTime(0.2, now + startDelay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + startDelay + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + startDelay);
      osc.stop(now + startDelay + 0.2);
    });
  } catch (e) {
    console.warn('Audio notification omitted', e);
  }
}

export type AmbientSoundType = 'none' | 'rain' | 'whitenoise' | 'binaural' | 'stream';

export function startAmbientSound(type: AmbientSoundType, volume: number = 0.2): () => void {
  stopAmbientSound();
  if (type === 'none') return () => {};

  try {
    const ctx = getAudioContext();
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.connect(ctx.destination);

    if (type === 'rain' || type === 'whitenoise' || type === 'stream') {
      // Generate 4 seconds of filtered noise in a buffer loop
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink/brown filtered noise simulating rain patter
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else if (type === 'stream') {
          // Soft rushing water modulation
          lastOut = (lastOut + 0.05 * white) / 1.04;
          data[i] = lastOut * 2.2;
        } else {
          // Smooth white noise
          data[i] = white * 0.15;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter
      const filter = ctx.createBiquadFilter();
      if (type === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 900;
      } else if (type === 'stream') {
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
      } else {
        filter.type = 'lowpass';
        filter.frequency.value = 1800;
      }

      noiseSource.connect(filter);
      filter.connect(gainNode);
      noiseSource.start();

      currentAmbientNode = {
        stop: () => {
          try {
            noiseSource.stop();
            noiseSource.disconnect();
            filter.disconnect();
            gainNode.disconnect();
          } catch {}
        }
      };
    } else if (type === 'binaural') {
      // 200 Hz carrier with 40 Hz gamma focus difference
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.value = 200;
      osc2.frequency.value = 240;

      const merger = ctx.createChannelMerger(2);
      osc1.connect(merger, 0, 0);
      osc2.connect(merger, 0, 1);
      merger.connect(gainNode);

      osc1.start();
      osc2.start();

      currentAmbientNode = {
        stop: () => {
          try {
            osc1.stop();
            osc2.stop();
            osc1.disconnect();
            osc2.disconnect();
            merger.disconnect();
            gainNode.disconnect();
          } catch {}
        }
      };
    }

    return () => stopAmbientSound();
  } catch (e) {
    console.warn('Failed to start ambient audio', e);
    return () => {};
  }
}

export function stopAmbientSound(): void {
  if (currentAmbientNode) {
    try {
      currentAmbientNode.stop();
    } catch {}
    currentAmbientNode = null;
  }
}

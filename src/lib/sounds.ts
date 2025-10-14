// This utility uses the Web Audio API to generate simple sounds without needing audio files.
// It should only be called on the client-side.
let audioContext: AudioContext | null = null;
const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser.", e);
      return null;
    }
  }
  return audioContext;
};
export const playWinSound = () => {
  const ctx = getAudioContext();
  if (!ctx) return;
  // Ensure context is running (required after user interaction)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.type = 'triangle';
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  // A simple winning arpeggio (C4, E4, G4, C5) with a longer duration
  const now = ctx.currentTime;
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
  oscillator.frequency.setValueAtTime(261.63, now); // C4
  oscillator.frequency.setValueAtTime(329.63, now + 0.15); // E4
  oscillator.frequency.setValueAtTime(392.00, now + 0.3); // G4
  oscillator.frequency.setValueAtTime(523.25, now + 0.45); // C5
  gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 1.5);
  oscillator.start(now);
  oscillator.stop(now + 1.5);
};
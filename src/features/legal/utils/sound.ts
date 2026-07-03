export const soundStore = {
  isMuted: false,
  listeners: new Set<(isMuted: boolean) => void>(),
  toggleMute() {
    this.isMuted = !this.isMuted;
    this.listeners.forEach(listener => listener(this.isMuted));
  },
  subscribe(listener: (isMuted: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
};

export function playSound(src: string, options: { volume?: number; playbackRate?: number; forcePlay?: boolean; interrupt?: boolean } = {}) {
  const {
    volume = 0.1,
    playbackRate = 1,
    forcePlay = false
  } = options;

  if (soundStore.isMuted && !forcePlay) return;

  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.playbackRate = playbackRate;
    audio.play().catch(e => {
      console.warn('Audio play rejected:', e);
    });
  } catch (error) {
    console.warn('Audio initialization failed:', error);
  }
}

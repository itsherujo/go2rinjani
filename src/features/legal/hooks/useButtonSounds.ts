import { useCallback, useEffect, useState } from "react";
import { soundStore, playSound } from "../utils/sound";

export function useButtonSounds() {
  const [isMuted, setIsMuted] = useState(soundStore.isMuted);

  useEffect(() => {
    return soundStore.subscribe(setIsMuted);
  }, []);

  const handleButtonDown = useCallback(() => {
    playSound('/sound/button_up.m4a', { volume: 0.1, playbackRate: 1 });
  }, []);

  const handleButtonUp = useCallback(() => {
    playSound('/sound/button_down.m4a', { volume: 0.1, playbackRate: 1.2 });
  }, []);

  const handleSoundMouseDown = useCallback(() => {
    playSound('/sound/button_up.m4a', { volume: 0.1, playbackRate: 1, forcePlay: true });
  }, []);

  const handleSoundMouseUp = useCallback(() => {
    playSound('/sound/button_down.m4a', { volume: 0.1, playbackRate: 1.2, forcePlay: true });
  }, []);

  const toggleMute = useCallback(() => {
    soundStore.toggleMute();
  }, []);

  return {
    isMuted,
    handleButtonDown,
    handleButtonUp,
    handleSoundMouseDown,
    handleSoundMouseUp,
    toggleMute
  };
}

import { type MusicPlayer, pauseMusicWithGame } from '../musicWithGame'
import { pauseNow, resumeNow, sendVolume, setVolume, skip, useRadio } from './radio'

/** Whether Radio is sounding or connecting (others pause as soon as a station is asked for). */
function activeHere(): boolean {
  const { playing, loading } = useRadio.getState()
  return playing || loading
}

/** Radio as one of the cab's players (musicWithGame.ts, oneAtATime.ts, keybinds.ts). */
export const radioPlayer: MusicPlayer = {
  name: 'radio',
  playingHere: activeHere,
  pauseHere: pauseNow,
  resumeHere: resumeNow,
  volume: () => useRadio.getState().volume,
  sendVolume,
  setVolume,
  skip,
  subscribe: (changed) =>
    useRadio.subscribe((state, before) => {
      const now = state.playing || state.loading
      const was = before.playing || before.loading
      changed(now && !was)
    }),
}

/** Radio with the game (musicWithGame.ts). Returns the function that stops it. */
export function pauseRadioWithGame(): () => void {
  return pauseMusicWithGame(radioPlayer)
}

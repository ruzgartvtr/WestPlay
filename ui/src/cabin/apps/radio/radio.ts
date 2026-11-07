import { useMemo } from 'react'
import { create } from 'zustand'
import type { MediaSource } from '../../../shared/media'
import { STATIONS, stationById, type RadioStation } from './stations'

/**
 * Radio: live Turkish stations streamed in the cabin page (HTML5 Audio), through the PC's speakers as
 * YouTube's sound is. One station at a time; Next / Back move in the list; volume is the player's own.
 */
export interface RadioState {
  stationId: string | null
  playing: boolean
  loading: boolean
  error: boolean
  volume: number
  nowPlaying: boolean
}

export const useRadio = create<RadioState>(() => ({
  stationId: null,
  playing: false,
  loading: false,
  error: false,
  volume: 1,
  nowPlaying: false,
}))

let audio: HTMLAudioElement | null = null

function element(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio()
    audio.preload = 'none'
    audio.addEventListener('playing', () => {
      useRadio.setState({ playing: true, loading: false, error: false })
    })
    audio.addEventListener('pause', () => {
      // A station change pauses first; only mark stopped when nothing is loading in.
      if (!useRadio.getState().loading) useRadio.setState({ playing: false })
    })
    audio.addEventListener('waiting', () => {
      useRadio.setState({ loading: true })
    })
    audio.addEventListener('error', () => {
      useRadio.setState({ playing: false, loading: false, error: true })
    })
  }
  return audio
}

/** Plays `station`, or the one already chosen; starts loading at once. */
export function play(station?: RadioStation): void {
  const chosen = station ?? stationById(useRadio.getState().stationId) ?? STATIONS[0]
  if (!chosen) return
  const el = element()
  const same = el.src === chosen.url && !el.error
  useRadio.setState({
    stationId: chosen.id,
    loading: true,
    error: false,
    playing: false,
    nowPlaying: true,
  })
  el.volume = useRadio.getState().volume
  if (!same) {
    el.src = chosen.url
    el.load()
  }
  void el.play().catch(() => {
    useRadio.setState({ playing: false, loading: false, error: true })
  })
}

export function playOrPause(): void {
  const { stationId, playing } = useRadio.getState()
  if (!stationId) {
    play()
    return
  }
  if (playing) pauseNow()
  else resumeNow()
}

export function pauseNow(): void {
  const el = audio
  if (!el) {
    useRadio.setState({ playing: false, loading: false })
    return
  }
  el.pause()
  useRadio.setState({ playing: false, loading: false })
}

export function resumeNow(): void {
  const station = stationById(useRadio.getState().stationId)
  if (!station) return
  play(station)
}

/** Next (1) or previous (-1) station in the list, wrapping. */
export function skip(direction: 1 | -1): void {
  const { stationId } = useRadio.getState()
  const at = Math.max(
    0,
    STATIONS.findIndex((station) => station.id === stationId),
  )
  const next = STATIONS[(at + direction + STATIONS.length) % STATIONS.length]
  play(next)
}

export function sendVolume(share: number): void {
  const volume = Math.min(1, Math.max(0, share))
  if (audio) audio.volume = volume
}

export function setVolume(share: number): void {
  const volume = Math.min(1, Math.max(0, share))
  useRadio.setState({ volume })
  sendVolume(volume)
}

export function playingNow(): boolean {
  return useRadio.getState().playing
}

export function useCurrentStation(): RadioStation | null {
  const id = useRadio((state) => state.stationId)
  return useMemo(() => stationById(id), [id])
}

/** What Radio plays, as the Dashboard's Now Playing takes music; `null` while nothing does. */
export function useRadioSource(): { source: MediaSource; artwork: string | null; color: string } | null {
  const stationId = useRadio((state) => state.stationId)
  const playing = useRadio((state) => state.playing)
  const loading = useRadio((state) => state.loading)
  return useMemo(() => {
    const station = stationById(stationId)
    if (!station) return null
    return {
      source: {
        id: `westplay-radio:${station.id}`,
        service: 'radio',
        title: station.name,
        artist: station.detail,
        album: '',
        artwork: null,
        status: playing ? 'playing' : loading ? 'playing' : 'paused',
        positionMs: 0,
        positionAt: Date.now(),
        durationMs: 0,
        controls: { playPause: true, next: true, previous: true, shuffle: false, repeat: false },
        shuffle: null,
        repeat: null,
      },
      artwork: null,
      color: station.color,
    }
  }, [stationId, playing, loading])
}

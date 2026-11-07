import { type CSSProperties, type PointerEvent, type ReactNode, useRef, useState } from 'react'
import { useText } from '../../state/text'
import {
  play,
  playOrPause,
  setVolume,
  skip,
  useCurrentStation,
  useRadio,
} from './radio'
import { STATIONS, type RadioStation } from './stations'
import './radio.css'

/**
 * Radio: Turkish live stations on the truck's screen. The list, a mini player at the foot, and Now Playing
 * over it; sound through HTML5 Audio in WestPlay's own browser (radio.ts).
 */
export function RadioApp() {
  const text = useText()
  const open = useRadio((state) => state.nowPlaying)
  const has = useRadio((state) => state.stationId !== null)

  return (
    <section className="app-panel radio-app" aria-label={text.apps.radio}>
      <header className="rd-bar">
        <h1 className="rd-title">{text.apps.radio}</h1>
        <span className="rd-gap" />
        <span className="rd-pill">{text.radio.live}</span>
      </header>

      <div className="rd-scroll">
        <p className="rd-lead">{text.radio.subtitle}</p>
        <ul className="rd-list">
          {STATIONS.map((station) => (
            <StationRow key={station.id} station={station} />
          ))}
        </ul>
      </div>

      {has && <MiniPlayer />}
      {has && open && <NowPlaying />}
    </section>
  )
}

function StationRow({ station }: { station: RadioStation }) {
  const current = useRadio((state) => state.stationId === station.id)
  const sounding = useRadio((state) => state.playing && state.stationId === station.id)
  const loading = useRadio((state) => state.loading && state.stationId === station.id)
  return (
    <li>
      <button
        type="button"
        className={current ? 'rd-row playing' : 'rd-row'}
        onClick={() => play(station)}
      >
        <Mark station={station} size="row" />
        <span className="rd-row-words">
          <span className="rd-row-name">{station.name}</span>
          <span className="rd-row-detail">{station.detail}</span>
        </span>
        <span className="rd-row-end">
          {loading ? <span className="rd-loading" /> : current ? <Bars playing={sounding} /> : null}
        </span>
      </button>
    </li>
  )
}

function MiniPlayer() {
  const text = useText()
  const station = useCurrentStation()
  const playing = useRadio((state) => state.playing)
  const loading = useRadio((state) => state.loading)
  const open = useRadio((state) => state.nowPlaying)
  if (!station) return null
  return (
    <div className={open ? 'rd-mini away' : 'rd-mini'}>
      <button type="button" className="rd-mini-open" onClick={() => useRadio.setState({ nowPlaying: true })}>
        <Mark station={station} size="mini" />
        <span className="rd-row-words">
          <span className="rd-row-name">{station.name}</span>
          <span className="rd-row-detail">{loading ? text.radio.connecting : station.detail}</span>
        </span>
      </button>
      <button
        type="button"
        className="rd-icon"
        aria-label={playing ? text.pause : text.play}
        onClick={playOrPause}
      >
        {playing ? <PauseGlyph /> : <PlayGlyph />}
      </button>
      <button type="button" className="rd-icon" aria-label={text.next} onClick={() => skip(1)}>
        <NextGlyph />
      </button>
    </div>
  )
}

function NowPlaying() {
  const text = useText()
  const station = useCurrentStation()
  const playing = useRadio((state) => state.playing)
  const loading = useRadio((state) => state.loading)
  const error = useRadio((state) => state.error)
  if (!station) return null
  return (
    <div className="rd-now">
      <button
        type="button"
        className="rd-round rd-now-close"
        aria-label={text.close}
        onClick={() => useRadio.setState({ nowPlaying: false })}
      >
        <DownGlyph />
      </button>
      <Mark station={station} size="now" />
      <div className="rd-now-side">
        <div className="rd-now-words">
          <div className="rd-now-live">{text.radio.live}</div>
          <div className="rd-now-title">{station.name}</div>
          <div className="rd-now-artist">
            {error ? text.radio.failed : loading ? text.radio.connecting : station.detail}
          </div>
        </div>
        <div className="rd-now-controls">
          <button type="button" className="rd-icon" aria-label={text.previous} onClick={() => skip(-1)}>
            <PreviousGlyph />
          </button>
          <button
            type="button"
            className="rd-icon big"
            aria-label={playing ? text.pause : text.play}
            onClick={playOrPause}
          >
            {playing ? <PauseGlyph /> : <PlayGlyph />}
          </button>
          <button type="button" className="rd-icon" aria-label={text.next} onClick={() => skip(1)}>
            <NextGlyph />
          </button>
        </div>
        <Volume />
      </div>
    </div>
  )
}

function shareAt(bar: HTMLElement, event: PointerEvent): number {
  const box = bar.getBoundingClientRect()
  return Math.min(1, Math.max(0, (event.clientX - box.left) / box.width))
}

function Volume() {
  const text = useText()
  const volume = useRadio((state) => state.volume)
  const bar = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const before = useRef(volume || 0.5)
  return (
    <div className="rd-volume">
      <button
        type="button"
        className="rd-icon small"
        aria-label={volume === 0 ? text.radio.unmute : text.radio.mute}
        onClick={() => {
          if (volume > 0) before.current = volume
          setVolume(volume > 0 ? 0 : before.current)
        }}
      >
        <SpeakerGlyph volume={volume} />
      </button>
      <div
        ref={bar}
        className={dragging ? 'rd-volume-bar dragging' : 'rd-volume-bar'}
        role="slider"
        aria-label={text.radio.volume}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(volume * 100)}
        style={{ '--share': volume } as CSSProperties}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          setDragging(true)
          setVolume(shareAt(bar.current!, event))
        }}
        onPointerMove={(event) => {
          if (dragging) setVolume(shareAt(bar.current!, event))
        }}
        onPointerUp={(event) => {
          if (!dragging) return
          setVolume(shareAt(bar.current!, event))
          setDragging(false)
        }}
        onPointerCancel={() => setDragging(false)}
      >
        <span />
      </div>
    </div>
  )
}

function Mark({ station, size }: { station: RadioStation; size: 'row' | 'mini' | 'now' }) {
  return (
    <span className={`rd-mark ${size}`} style={{ background: station.color }} aria-hidden>
      <RadioGlyph />
    </span>
  )
}

function Bars({ playing }: { playing: boolean }) {
  return (
    <span className={playing ? 'rd-bars moving' : 'rd-bars'} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

function Glyph({ children, fill = false }: { children: ReactNode; fill?: boolean }) {
  return (
    <svg
      className="rd-glyph"
      viewBox="0 0 24 24"
      fill={fill ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={fill ? 0 : 2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const PlayGlyph = () => (
  <Glyph fill>
    <path d="M7 4.8v14.4a1 1 0 0 0 1.5.86l12-7.2a1 1 0 0 0 0-1.72l-12-7.2A1 1 0 0 0 7 4.8Z" />
  </Glyph>
)
const PauseGlyph = () => (
  <Glyph fill>
    <rect x="5.5" y="4" width="4.5" height="16" rx="1.4" />
    <rect x="14" y="4" width="4.5" height="16" rx="1.4" />
  </Glyph>
)
const NextGlyph = () => (
  <Glyph fill>
    <path d="M3 6.2v11.6a.9.9 0 0 0 1.38.76L12 13.6v4.2a.9.9 0 0 0 1.38.76l8.6-5.8a.9.9 0 0 0 0-1.52l-8.6-5.8A.9.9 0 0 0 12 6.2v4.2L4.38 5.44A.9.9 0 0 0 3 6.2Z" />
  </Glyph>
)
const PreviousGlyph = () => (
  <Glyph fill>
    <path d="M21 6.2v11.6a.9.9 0 0 1-1.38.76L12 13.6v4.2a.9.9 0 0 1-1.38.76l-8.6-5.8a.9.9 0 0 1 0-1.52l8.6-5.8A.9.9 0 0 1 12 6.2v4.2l7.62-4.96A.9.9 0 0 1 21 6.2Z" />
  </Glyph>
)
const DownGlyph = () => (
  <Glyph>
    <path d="m5 9 7 7 7-7" />
  </Glyph>
)
const SpeakerGlyph = ({ volume }: { volume: number }) => (
  <Glyph>
    <path d="M4 9.5h3l4.5-4v13L7 14.5H4z" fill="currentColor" strokeWidth={1.6} />
    {volume === 0 && <path d="m15.5 9.5 5 5m0-5-5 5" />}
    {volume > 0 && <path d="M15 9.2a4 4 0 0 1 0 5.6" />}
    {volume > 0.5 && <path d="M17.8 6.6a7.6 7.6 0 0 1 0 10.8" />}
  </Glyph>
)
const RadioGlyph = () => (
  <Glyph fill>
    <path d="M12 3.2a1 1 0 0 1 .7.3l8 8a1 1 0 0 1-1.4 1.4L12 5.6 4.7 12.9a1 1 0 1 1-1.4-1.4l8-8a1 1 0 0 1 .7-.3Z" />
    <path d="M5.5 13.5h13a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20v-5a1.5 1.5 0 0 1 1.5-1.5Zm3.5 3a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm5 .5h3.5a.75.75 0 0 0 0-1.5H14a.75.75 0 0 0 0 1.5Zm0 2.5h3.5a.75.75 0 0 0 0-1.5H14a.75.75 0 0 0 0 1.5Z" />
  </Glyph>
)

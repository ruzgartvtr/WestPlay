/**
 * Turkish internet radio stations for WestPlay's Radio app. Streams are HTTPS where possible so WebView2
 * can play them; names and tags are as Turkish drivers know them.
 */
export interface RadioStation {
  id: string
  name: string
  /** City / genre line under the name. */
  detail: string
  /** Direct audio URL (Icecast / Shoutcast / StreamTheWorld), not HLS. */
  url: string
  /** Accent colour for the station's mark on the list and Now Playing. */
  color: string
}

export const STATIONS: readonly RadioStation[] = [
  {
    id: 'power-turk',
    name: 'Power Türk',
    detail: 'Türkçe pop',
    url: 'https://listen.powerapp.com.tr/powerturk/mpeg/icecast.audio',
    color: '#e11d48',
  },
  {
    id: 'power-fm',
    name: 'Power FM',
    detail: 'Yabancı hit',
    url: 'https://listen.powerapp.com.tr/powerfm/mpeg/icecast.audio',
    color: '#2563eb',
  },
  {
    id: 'power-turk-slow',
    name: 'Power Türk Slow',
    detail: 'Slow',
    url: 'https://listen.powerapp.com.tr/powerturkslow/mpeg/icecast.audio',
    color: '#7c3aed',
  },
  {
    id: 'power-dance',
    name: 'Power Dance',
    detail: 'Dance',
    url: 'https://listen.powerapp.com.tr/powerdance/mpeg/icecast.audio',
    color: '#db2777',
  },
  {
    id: 'slow-turk',
    name: 'Slow Türk',
    detail: 'Slow',
    url: 'https://radyo.duhnet.tv/slowturk',
    color: '#0ea5e9',
  },
  {
    id: 'radyo-d',
    name: 'Radyo D',
    detail: 'Türkçe pop',
    url: 'https://radyo.duhnet.tv/radyod',
    color: '#dc2626',
  },
  {
    id: 'fenomen',
    name: 'Radyo Fenomen',
    detail: 'Pop / dance',
    url: 'https://live.radyofenomen.com/fenomen/128/icecast.audio',
    color: '#f59e0b',
  },
  {
    id: 'joy-turk',
    name: 'JoyTürk',
    detail: 'Türkçe pop',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_TURK_SC',
    color: '#ea580c',
  },
  {
    id: 'joy-fm',
    name: 'Joy FM',
    detail: 'Yabancı',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/JOY_FM_SC',
    color: '#16a34a',
  },
  {
    id: 'metro-fm',
    name: 'Metro FM',
    detail: 'Yabancı hit',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/METRO_FM_SC',
    color: '#0891b2',
  },
  {
    id: 'super-fm',
    name: 'Süper FM',
    detail: 'Pop',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/SUPER_FM_SC',
    color: '#eab308',
  },
  {
    id: 'virgin',
    name: 'Virgin Radio',
    detail: 'Rock / alternatif',
    url: 'https://playerservices.streamtheworld.com/api/livestream-redirect/VIRGIN_RADIO_SC',
    color: '#ef4444',
  },
  {
    id: 'trt-fm',
    name: 'TRT FM',
    detail: 'TRT',
    url: 'https://trt.radyotvonline.net/trtfm',
    color: '#1d4ed8',
  },
  {
    id: 'trt-haber',
    name: 'TRT Haber Radyo',
    detail: 'Haber',
    url: 'https://trt.radyotvonline.net/trthaber',
    color: '#1e3a8a',
  },
  {
    id: 'kral-turk',
    name: 'Kral Türk FM',
    detail: 'Türkçe',
    url: 'https://live.radyositesihazir.com/8032/stream',
    color: '#b91c1c',
  },
  {
    id: 'damar-turk',
    name: 'Damar Türk FM',
    detail: 'Arabesk / fantezi',
    url: 'https://live.radyositesihazir.com:10997/stream',
    color: '#92400e',
  },
  {
    id: 'alem-fm',
    name: 'Alem FM',
    detail: 'Türkçe',
    url: 'https://turkmedya.radyotvonline.net/alemfmaac',
    color: '#4f46e5',
  },
  {
    id: 'show-radyo',
    name: 'Show Radyo',
    detail: 'Pop',
    url: 'https://edge1.radyotvonline.net/shoutcast/play/showradyo',
    color: '#be123c',
  },
  {
    id: 'radyo-45lik',
    name: 'Radyo 45’lik',
    detail: 'Nostalji',
    url: 'https://stream.radyo45lik.com:4545/',
    color: '#a16207',
  },
  {
    id: 'best-slow',
    name: 'Best Slow',
    detail: 'Slow',
    url: 'https://hepsibest.radyotvonline.net/bestslow',
    color: '#64748b',
  },
]

export function stationById(id: string | null | undefined): RadioStation | null {
  return (id && STATIONS.find((station) => station.id === id)) || null
}

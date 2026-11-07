import { describe, expect, it } from 'vitest'
import { STATIONS, stationById } from './stations'

describe('Turkish radio stations', () => {
  it('lists unique ids and https streams', () => {
    const ids = new Set(STATIONS.map((station) => station.id))
    expect(ids.size).toBe(STATIONS.length)
    for (const station of STATIONS) {
      expect(station.url.startsWith('https://')).toBe(true)
      expect(station.name.length).toBeGreaterThan(0)
      expect(station.color.startsWith('#')).toBe(true)
    }
  })

  it('finds a station by id', () => {
    expect(stationById('power-turk')?.name).toBe('Power Türk')
    expect(stationById('missing')).toBeNull()
    expect(stationById(null)).toBeNull()
  })
})

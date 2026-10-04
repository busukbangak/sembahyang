import { describe, expect, it } from 'vitest'
import { formatKm, getDistanceToKaaba, getQiblaBearing, normalizeDegrees } from './qibla'

describe('getQiblaBearing', () => {
  it('Hamburg points south-east towards Mecca', () => {
    expect(getQiblaBearing(53.5511, 9.9937)).toBeCloseTo(133.05, 1)
  })

  it('New York points north-east towards Mecca', () => {
    expect(getQiblaBearing(40.7128, -74.006)).toBeCloseTo(58.48, 1)
  })

  it('Jakarta points west towards Mecca', () => {
    expect(getQiblaBearing(-6.2088, 106.8456)).toBeCloseTo(295.15, 1)
  })

  it('Cairo points roughly south-east towards Mecca', () => {
    expect(getQiblaBearing(30.0444, 31.2357)).toBeCloseTo(136.14, 1)
  })

  it('Mecca itself has a bearing of 0', () => {
    expect(getQiblaBearing(21.4225, 39.8262)).toBeCloseTo(0, 5)
  })
})

describe('getDistanceToKaaba', () => {
  it('Hamburg is roughly 4373 km away', () => {
    expect(getDistanceToKaaba(53.5511, 9.9937)).toBeCloseTo(4373, -1)
  })

  it('Mecca itself has zero distance', () => {
    expect(getDistanceToKaaba(21.4225, 39.8262)).toBeCloseTo(0, 3)
  })
})

describe('formatKm', () => {
  it('formats large distances with German thousands separators', () => {
    expect(formatKm(4373.4)).toBe('4.373 km')
  })
})

describe('normalizeDegrees', () => {
  it('keeps values inside 0–360', () => {
    expect(normalizeDegrees(400)).toBe(40)
    expect(normalizeDegrees(-30)).toBe(330)
    expect(normalizeDegrees(133)).toBe(133)
  })
})
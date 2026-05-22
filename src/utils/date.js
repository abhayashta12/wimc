export const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function formatDate(date) {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function getConceptionDates(birthDate) {
  const conception = new Date(birthDate)
  conception.setDate(conception.getDate() - 266)

  const rangeStart = new Date(birthDate)
  rangeStart.setDate(rangeStart.getDate() - 280)

  const rangeEnd = new Date(birthDate)
  rangeEnd.setDate(rangeEnd.getDate() - 252)

  return { conception, rangeStart, rangeEnd }
}

export function getDaysInMonth(month, year) {
  if (!month || !year) return 31
  return new Date(year, month, 0).getDate()
}

export function getZodiac(date) {
  const m = date.getMonth() + 1
  const d = date.getDate()
  const signs = [
    [1, 20, 'Capricorn'], [2, 19, 'Aquarius'], [3, 20, 'Pisces'],  [4, 20, 'Aries'],
    [5, 21, 'Taurus'],   [6, 21, 'Gemini'],    [7, 23, 'Cancer'],  [8, 23, 'Leo'],
    [9, 23, 'Virgo'],    [10, 23, 'Libra'],     [11, 22, 'Scorpio'],[12, 22, 'Sagittarius'],
  ]
  for (const [mo, lim, sign] of signs) {
    if (m === mo) {
      return d < lim
        ? signs[(signs.findIndex(x => x[0] === mo) - 1 + 12) % 12][2]
        : sign
    }
  }
  return 'Capricorn'
}

export function getSeason(date) {
  const m = date.getMonth()
  if ([11, 0, 1].includes(m)) return '❄️ Winter'
  if ([2, 3, 4].includes(m))  return '🌸 Spring'
  if ([5, 6, 7].includes(m))  return '☀️ Summer'
  return '🍂 Autumn'
}

export function getDayName(date) {
  return DAYS[date.getDay()]
}

export function toISODate(date) {
  return date.toISOString().split('T')[0]
}

export function buildShareURL(month, day, year, country) {
  const base = typeof window !== 'undefined' ? window.location.origin : ''
  return `${base}?m=${month}&d=${day}&y=${year}&c=${country}`
}

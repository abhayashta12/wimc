export async function fetchMusic(dateFrom, dateTo, country, tab) {
  const params = new URLSearchParams({ dateFrom, dateTo, country, tab })
  const res = await fetch(`/api/music?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchMovie(year, month, country) {
const params = new URLSearchParams({ year, month, country: country || 'US' })
  const res = await fetch(`/api/movies?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchCelebrities(month, day, country) {
  const params = new URLSearchParams({ month, day, country })
  const res = await fetch(`/api/celebrities?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

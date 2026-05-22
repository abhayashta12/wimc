export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: 'Missing year or month' });
  }

  const TMDB_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_KEY) {
    return res.status(500).json({ error: 'TMDB API key not configured on server' });
  }

  const monthPadded = String(month).padStart(2, '0');
  const lastDay = new Date(year, month, 0).getDate();
  const dateFrom = `${year}-${monthPadded}-01`;
  const dateTo   = `${year}-${monthPadded}-${lastDay}`;

  try {
    // Get top movie released that month, sorted by popularity
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}&sort_by=popularity.desc&page=1`;
    const r = await fetch(url);
    const data = await r.json();

    if (data.status_message) {
      return res.status(400).json({ error: data.status_message });
    }

    const results = (data.results || []).filter(m => m.poster_path);
    if (results.length === 0) {
      return res.status(200).json({ movie: null });
    }

    const top = results[0];
    return res.status(200).json({
      movie: {
        title: top.title,
        overview: top.overview,
        poster: `https://image.tmdb.org/t/p/w500${top.poster_path}`,
        releaseDate: top.release_date,
        rating: Math.round(top.vote_average * 10) / 10,
        tmdbId: top.id
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch movie: ' + err.message });
  }
}

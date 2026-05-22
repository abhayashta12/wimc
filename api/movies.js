export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { year, month, country } = req.query;

  if (!year || !month) {
    return res.status(400).json({ error: 'Missing year or month' });
  }

  const TMDB_KEY = process.env.TMDB_API_KEY;
  if (!TMDB_KEY) {
    return res.status(500).json({ error: 'TMDB API key not configured on server' });
  }

  const countryConfig = {
    IN: { language: 'hi', region: 'IN', label: 'Bollywood' },
    JP: { language: 'ja', region: 'JP', label: 'Japanese' },
    KR: { language: 'ko', region: 'KR', label: 'Korean' },
    CN: { language: 'zh', region: 'CN', label: 'Chinese' },
    FR: { language: 'fr', region: 'FR', label: null },
    DE: { language: 'de', region: 'DE', label: null },
    IT: { language: 'it', region: 'IT', label: null },
    ES: { language: 'es', region: 'ES', label: null },
    BR: { language: 'pt', region: 'BR', label: null },
    MX: { language: 'es', region: 'MX', label: null },
    PT: { language: 'pt', region: 'PT', label: null },
    AR: { language: 'es', region: 'AR', label: null },
    CO: { language: 'es', region: 'CO', label: null },
    CL: { language: 'es', region: 'CL', label: null },
    PE: { language: 'es', region: 'PE', label: null },
    RU: { language: 'ru', region: 'RU', label: null },
    PL: { language: 'pl', region: 'PL', label: null },
    TR: { language: 'tr', region: 'TR', label: null },
    TH: { language: 'th', region: 'TH', label: null },
    ID: { language: 'id', region: 'ID', label: null },
    NL: { language: 'nl', region: 'NL', label: null },
    SE: { language: 'sv', region: 'SE', label: null },
    NO: { language: 'no', region: 'NO', label: null },
    DK: { language: 'da', region: 'DK', label: null },
    FI: { language: 'fi', region: 'FI', label: null },
    GR: { language: 'el', region: 'GR', label: null },
    RO: { language: 'ro', region: 'RO', label: null },
    HU: { language: 'hu', region: 'HU', label: null },
    CZ: { language: 'cs', region: 'CZ', label: null },
    UA: { language: 'uk', region: 'UA', label: null },
    IL: { language: 'he', region: 'IL', label: null },
    EG: { language: 'ar', region: 'EG', label: null },
    SA: { language: 'ar', region: 'SA', label: null },
    AE: { language: 'ar', region: 'AE', label: null },
    NG: { language: 'en', region: 'NG', label: 'Nollywood' },
    PH: { language: 'tl', region: 'PH', label: null },
    VN: { language: 'vi', region: 'VN', label: null },
    MY: { language: 'ms', region: 'MY', label: null },
    PK: { language: 'ur', region: 'PK', label: null },
    BD: { language: 'bn', region: 'BD', label: null },
    US: { language: 'en', region: 'US', label: null },
    GB: { language: 'en', region: 'GB', label: null },
    CA: { language: 'en', region: 'CA', label: null },
    AU: { language: 'en', region: 'AU', label: null },
    NZ: { language: 'en', region: 'NZ', label: null },
    IE: { language: 'en', region: 'IE', label: null },
    SG: { language: 'en', region: 'SG', label: null },
    ZA: { language: 'en', region: 'ZA', label: null },
    GH: { language: 'en', region: 'GH', label: null },
    BE: { language: 'fr', region: 'BE', label: null },
    CH: { language: 'de', region: 'CH', label: null },
    AT: { language: 'de', region: 'AT', label: null },
  };

  const config = countryConfig[country] || { language: 'en', region: 'US', label: null };

  const monthPadded = String(month).padStart(2, '0');
  const lastDay = new Date(year, month, 0).getDate();
  const dateFrom = `${year}-${monthPadded}-01`;
  const dateTo   = `${year}-${monthPadded}-${lastDay}`;

  try {
    const localUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}` +
      `&primary_release_date.gte=${dateFrom}&primary_release_date.lte=${dateTo}` +
      `&sort_by=popularity.desc&with_original_language=${config.language}` +
      `&region=${config.region}&page=1`;

    let r = await fetch(localUrl);
    let data = await r.json();

    if (data.status_message) return res.status(400).json({ error: data.status_message });

    let results = (data.results || []).filter(m => m.poster_path);

    if (results.length === 0) {
      const yearUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}` +
        `&primary_release_date.gte=${year}-01-01&primary_release_date.lte=${year}-12-31` +
        `&sort_by=popularity.desc&with_original_language=${config.language}` +
        `&region=${config.region}&page=1`;
      r = await fetch(yearUrl);
      data = await r.json();
      results = (data.results || []).filter(m => m.poster_path);
    }

    if (results.length === 0) return res.status(200).json({ movie: null });

    const top = results[0];
    return res.status(200).json({
      movie: {
        title: top.title,
        overview: top.overview,
        poster: `https://image.tmdb.org/t/p/w500${top.poster_path}`,
        releaseDate: top.release_date,
        rating: Math.round(top.vote_average * 10) / 10,
        tmdbId: top.id,
        cinemaLabel: config.label
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch movie: ' + err.message });
  }
}
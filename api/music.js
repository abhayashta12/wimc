export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { dateFrom, dateTo, country, tab } = req.query;

  if (!dateFrom || !dateTo || !country) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
  if (!YOUTUBE_API_KEY) {
    return res.status(500).json({ error: 'YouTube API key not configured on server' });
  }

  const countryMusicStyle = {
    IN: 'Bollywood Hindi',    PK: 'Pakistani Urdu',
    BD: 'Bangla',             JP: 'J-Pop Japanese',
    KR: 'K-Pop Korean',       CN: 'Chinese Mandopop',
    FR: 'French pop',         DE: 'German pop',
    IT: 'Italian pop',        ES: 'Spanish pop',
    BR: 'Brazilian MPB',      MX: 'Mexican pop',
    AR: 'Argentine pop',      CO: 'Colombian pop',
    TR: 'Turkish pop',        RU: 'Russian pop',
    PL: 'Polish pop',         NG: 'Nigerian Afrobeats',
    GH: 'Ghanaian pop',       KE: 'Kenyan pop',
    ZA: 'South African pop',  EG: 'Egyptian Arabic pop',
    SA: 'Arabic pop',         AE: 'Arabic pop',
    ID: 'Indonesian pop',     PH: 'OPM Filipino pop',
    TH: 'Thai pop',           VN: 'Vietnamese V-pop',
    MY: 'Malaysian pop',      SE: 'Swedish pop',
    NO: 'Norwegian pop',      NL: 'Dutch pop',
    PT: 'Portuguese pop',     RO: 'Romanian pop',
    UA: 'Ukrainian pop',      GR: 'Greek pop',
    IL: 'Israeli pop',        US: 'American pop',
    GB: 'British pop',        CA: 'Canadian pop',
    AU: 'Australian pop',     NZ: 'New Zealand pop',
    IE: 'Irish pop',
  };

  const date     = new Date(dateFrom);
  const month    = date.toLocaleDateString('en-US', { month: 'long' });
  const year     = date.getFullYear();
  const regionCode = tab === 'global' ? 'US' : (country === 'OTHER' ? 'US' : country);
  const genre    = tab === 'global' ? 'pop' : (countryMusicStyle[country] || 'pop');

  const JUNK = [
    /playlist/i, /compilation/i, /\bmix\b/i, /top \d+/i, /best of/i,
    /\d+\s*songs/i, /\d+\s*hits/i, /nonstop/i, /non.stop/i, /jukebox/i,
    /full album/i, /all songs/i, /collection/i, /\bvol\b/i,
    /superhit/i, /super hit/i, /evergreen/i, /back.to.back/i,
    /audio jukebox/i, /video jukebox/i, /medley/i, /mashup/i,
    /\d{4}.*hits/i, /hits of \d{4}/i, /songs of \d{4}/i, /greatest hits/i,
  ];

  function isJunk(title) {
    return JUNK.some(p => p.test(title));
  }

  function score(title) {
    let s = 0;
    if (/official/i.test(title))         s += 4;
    if (/music video/i.test(title))      s += 3;
    if (/full video/i.test(title))       s += 2;
    if (/lyric/i.test(title))            s += 2;
    if (/audio/i.test(title))            s += 1;
    if (new RegExp(`\\b${year}\\b`).test(title) && !/official/i.test(title)) s -= 1;
    return s;
  }

  const queries = tab === 'global'
    ? [
        `${genre} song "${month} ${year}" official music video`,
        `${genre} hit song ${month} ${year} official`,
        `${genre} song ${year} official music video`,
      ]
    : [
        `${genre} song "${month} ${year}" official`,
        `${genre} hit "${year}" official music video`,
        `${genre} song ${year} official`,
      ];

  async function searchYT(q) {
    const url = `https://www.googleapis.com/youtube/v3/search` +
      `?part=snippet&q=${encodeURIComponent(q)}&type=video&videoCategoryId=10` +
      `&maxResults=20&regionCode=${regionCode}&key=${YOUTUBE_API_KEY}`;
    const r = await fetch(url);
    return r.json();
  }

  function process(items) {
    if (!items || !items.length) return [];
    return items
      .filter(i => !isJunk(i.snippet.title))
      .filter(i => !/jukebox|T-Series Hits|top \d+/i.test(i.snippet.channelTitle))
      .sort((a, b) => score(b.snippet.title) - score(a.snippet.title))
      .slice(0, 4)
      .map(i => ({
        videoId:     i.id.videoId,
        title:       i.snippet.title,
        channel:     i.snippet.channelTitle,
        thumbnail:   i.snippet.thumbnails.medium?.url || i.snippet.thumbnails.default?.url,
        publishedAt: i.snippet.publishedAt,
      }));
  }

  try {
    let videos = [];
    for (const q of queries) {
      if (videos.length >= 2) break;
      const data = await searchYT(q);
      if (data.error) return res.status(400).json({ error: data.error.message });
      videos = process(data.items);
    }
    return res.status(200).json({ videos });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch videos: ' + err.message });
  }
}
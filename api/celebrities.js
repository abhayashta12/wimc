export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { month, day, country } = req.query;

  if (!month || !day) {
    return res.status(400).json({ error: 'Missing month or day' });
  }

  // Map country codes to nationalities/demonyms for filtering
  const countryDemonyms = {
    US: ['American','United States'],
    GB: ['British','English','Scottish','Welsh'],
    CA: ['Canadian'],
    AU: ['Australian'],
    FR: ['French'],
    DE: ['German'],
    IT: ['Italian'],
    ES: ['Spanish'],
    BR: ['Brazilian'],
    MX: ['Mexican'],
    IN: ['Indian'],
    JP: ['Japanese'],
    KR: ['South Korean','Korean'],
    NG: ['Nigerian'],
    ZA: ['South African'],
    AR: ['Argentine','Argentinian'],
    CO: ['Colombian'],
    NL: ['Dutch','Netherlands'],
    SE: ['Swedish'],
    NO: ['Norwegian'],
    PL: ['Polish'],
    PT: ['Portuguese'],
    RU: ['Russian'],
    CN: ['Chinese'],
    PH: ['Filipino','Philippine'],
    ID: ['Indonesian'],
    PK: ['Pakistani'],
    EG: ['Egyptian'],
    TR: ['Turkish'],
    SA: ['Saudi'],
    AE: ['Emirati'],
    NZ: ['New Zealand'],
    SG: ['Singaporean'],
    BE: ['Belgian'],
    CH: ['Swiss'],
    AT: ['Austrian'],
    DK: ['Danish'],
    FI: ['Finnish'],
    IE: ['Irish'],
    GR: ['Greek'],
    IL: ['Israeli'],
    OTHER: []
  };

  try {
    // Wikipedia "On This Day" births API
    const monthPadded = String(month).padStart(2, '0');
    const dayPadded   = String(day).padStart(2, '0');
    const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/births/${monthPadded}/${dayPadded}`;

    const r = await fetch(url, {
      headers: { 'User-Agent': 'WhenIWasConceived/1.0' }
    });
    const data = await r.json();

    if (!data.births || data.births.length === 0) {
      return res.status(200).json({ celebrities: [] });
    }

    const demonyms = countryDemonyms[country] || [];

    // Filter and score celebrities by country relevance + notability
    let celebs = data.births.filter(b => {
      if (!b.pages || b.pages.length === 0) return false;
      const page = b.pages[0];
      if (!page.thumbnail) return false; // must have a photo
      return true;
    });

    // If country filter available, prefer matching celebs but fall back to all
    let filtered = celebs;
    if (demonyms.length > 0) {
      const countryMatch = celebs.filter(b => {
        const desc = (b.pages[0]?.description || '') + ' ' + (b.text || '');
        return demonyms.some(d => desc.toLowerCase().includes(d.toLowerCase()));
      });
      if (countryMatch.length >= 2) filtered = countryMatch;
    }

    // Sort by year descending (more recent = more recognizable), take top 4
    filtered.sort((a, b) => b.year - a.year);
    const top = filtered.slice(0, 4);

    const celebrities = top.map(b => {
      const page = b.pages[0];
      return {
        name: page.titles?.normalized || page.title,
        description: page.description || '',
        year: b.year,
        age: new Date().getFullYear() - b.year,
        thumbnail: page.thumbnail?.source || null,
        url: page.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${page.title}`
      };
    });

    return res.status(200).json({ celebrities });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch celebrities: ' + err.message });
  }
}

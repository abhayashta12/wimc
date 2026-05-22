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

  const countryNames = {
    US:'United States',GB:'United Kingdom',CA:'Canada',AU:'Australia',
    FR:'France',DE:'Germany',IT:'Italy',ES:'Spain',BR:'Brazil',MX:'Mexico',
    IN:'India',JP:'Japan',KR:'South Korea',NG:'Nigeria',ZA:'South Africa',
    AR:'Argentina',CO:'Colombia',NL:'Netherlands',SE:'Sweden',NO:'Norway',
    PL:'Poland',PT:'Portugal',RU:'Russia',CN:'China',PH:'Philippines',
    ID:'Indonesia',PK:'Pakistan',BD:'Bangladesh',EG:'Egypt',GH:'Ghana',
    KE:'Kenya',TR:'Turkey',SA:'Saudi Arabia',AE:'UAE',NZ:'New Zealand',
    SG:'Singapore',MY:'Malaysia',TH:'Thailand',VN:'Vietnam',CL:'Chile',
    PE:'Peru',RO:'Romania',UA:'Ukraine',BE:'Belgium',CH:'Switzerland',
    AT:'Austria',DK:'Denmark',FI:'Finland',IE:'Ireland',CZ:'Czech Republic',
    HU:'Hungary',GR:'Greece',IL:'Israel',OTHER:'World'
  };

  const countryName = countryNames[country] || 'World';
  const regionCode = tab === 'global' ? 'US' : (country === 'OTHER' ? 'US' : country);

  const date = new Date(dateFrom);
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();

  const query = tab === 'global'
    ? `top music hits ${month} ${year}`
    : `top music hits ${countryName} ${month} ${year}`;

  const afterDate = dateFrom + 'T00:00:00Z';
  const beforeDate = dateTo + 'T23:59:59Z';

  async function search(withDateFilter) {
    let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&maxResults=4&regionCode=${regionCode}&key=${YOUTUBE_API_KEY}`;
    if (withDateFilter) {
      url += `&publishedAfter=${afterDate}&publishedBefore=${beforeDate}`;
    }
    const r = await fetch(url);
    return r.json();
  }

  try {
    let data = await search(true);

    if (data.error || !data.items || data.items.length === 0) {
      data = await search(false);
    }

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const videos = (data.items || []).map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt
    }));

    return res.status(200).json({ videos });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch videos: ' + err.message });
  }
}

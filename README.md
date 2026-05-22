# WhenIWasConceived

A fun React + Vite app deployed on Vercel. Tells you when you were conceived, the #1 film of that month, famous people who share your birthday, and the music that was playing at that moment.

## Project Structure

```
wheniwasconceived/
├── api/                          # Vercel serverless functions (backend — API keys live here)
│   ├── music.js                  # YouTube Data API → music from conception window
│   ├── movies.js                 # TMDB API → top film of conception month
│   └── celebrities.js            # Wikipedia API → famous people born on your birthday
│
├── src/
│   ├── components/               # One folder per component (JSX + CSS Module)
│   │   ├── Header/
│   │   ├── Hero/
│   │   ├── BirthForm/
│   │   ├── ConceptionResult/
│   │   ├── MovieSection/
│   │   ├── CelebSection/
│   │   ├── MusicSection/
│   │   └── Toast/
│   │
│   ├── context/                  # React context providers
│   │   ├── LangContext.jsx       # Selected language
│   │   └── ThemeContext.jsx      # Light / dark mode
│   │
│   ├── hooks/                    # Reusable custom hooks
│   │   ├── useTranslation.js     # i18n helper
│   │   ├── useFetch.js           # Generic async data fetcher
│   │   └── useToast.js           # Toast notification state
│   │
│   ├── constants/
│   │   ├── countries.js          # Country list + code→name map
│   │   └── translations.js       # All UI strings for 7 languages
│   │
│   ├── utils/
│   │   ├── date.js               # Date math (conception calc, zodiac, season…)
│   │   └── api.js                # fetch() wrappers for all 3 API endpoints
│   │
│   ├── styles/
│   │   └── global.css            # CSS variables, resets, shared utilities
│   │
│   ├── App.jsx                   # Root component
│   └── main.jsx                  # React entry point
│
├── index.html                    # Vite HTML entry
├── vite.config.js
├── vercel.json                   # Build + routing config
├── package.json
├── .env.example                  # Template — copy to .env.local
└── .gitignore
```

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up env vars
cp .env.example .env.local
# Edit .env.local and add your keys

# 3. Run dev server
npm run dev
```

## Deploy to Vercel

```bash
# Install CLI
npm i -g vercel

# Deploy
vercel

# Add secrets
vercel env add YOUTUBE_API_KEY
vercel env add TMDB_API_KEY

# Production deploy
vercel --prod
```

## API Keys

| Key | Where to get it | Cost |
|-----|----------------|------|
| `YOUTUBE_API_KEY` | console.cloud.google.com → YouTube Data API v3 | Free (10k req/day) |
| `TMDB_API_KEY` | themoviedb.org → Settings → API → Developer | Free |
| Wikipedia (celebrities) | No key needed — public API | Free |

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: CSS Modules + CSS custom properties
- **Backend**: Vercel serverless functions (Node.js)
- **APIs**: YouTube Data v3, TMDB v3, Wikipedia REST
- **i18n**: 7 languages (EN, FR, ES, DE, PT, IT, NL)
- **Deployment**: Vercel

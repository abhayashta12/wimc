import { useState, useEffect, useRef } from 'react'
import { LangProvider } from './context/LangContext'
import { ThemeProvider } from './context/ThemeContext'
import { useToast } from './hooks/useToast'
import { getConceptionDates } from './utils/date'

import Header           from './components/Header/Header'
import Hero             from './components/Hero/Hero'
import BirthForm        from './components/BirthForm/BirthForm'
import ConceptionResult from './components/ConceptionResult/ConceptionResult'
import MovieSection     from './components/MovieSection/MovieSection'
import CelebSection     from './components/CelebSection/CelebSection'
import MusicSection     from './components/MusicSection/MusicSection'
import Toast            from './components/Toast/Toast'

import './styles/global.css'

export default function App() {
  const [result, setResult]   = useState(null)
  const { toast, showToast }  = useToast()
  const resultRef             = useRef(null)

  // Handle shared URL params on load
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('m') && p.get('d') && p.get('y') && p.get('c')) {
      handleCalculate({
        month:   parseInt(p.get('m')),
        day:     parseInt(p.get('d')),
        year:    parseInt(p.get('y')),
        country: p.get('c'),
      })
    }
  }, [])

  // Scroll to results when they appear
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }, [result])

  const handleCalculate = ({ month, day, year, country }) => {
    const birthDate = new Date(year, month - 1, day)
    const { conception, rangeStart, rangeEnd } = getConceptionDates(birthDate)
    setResult({ month, day, year, country, birthDate, conception, rangeStart, rangeEnd })
  }

  return (
    <ThemeProvider>
      <LangProvider>
        <Header />
        <Hero />

        <main style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1.5rem 4rem' }}>
          <BirthForm onCalculate={handleCalculate} />

          {result && (
            <div ref={resultRef} style={{ animation: 'fadeUp 0.4s ease' }}>
              <ConceptionResult result={result} showToast={showToast} />
              <MovieSection
                conceptionYear={result.conception.getFullYear()}
                conceptionMonth={result.conception.getMonth() + 1}
              />
              <CelebSection
                month={result.month}
                day={result.day}
                country={result.country}
              />
              <MusicSection
                rangeStart={result.rangeStart}
                rangeEnd={result.rangeEnd}
                country={result.country}
              />
            </div>
          )}
        </main>

        <footer style={{ textAlign: 'center', padding: '2rem 1.5rem', fontSize: '0.78rem', color: 'var(--text3)', borderTop: '1px solid var(--border2)' }}>
          Made with ❤️ · Just a bit of cheeky fun · Not scientifically precise 😄
        </footer>

        <Toast message={toast.message} visible={toast.visible} />
      </LangProvider>
    </ThemeProvider>
  )
}

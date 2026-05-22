import { useEffect, useCallback } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { useFetch } from '../../hooks/useFetch'
import { fetchMovie } from '../../utils/api'
import s from './MovieSection.module.css'

export default function MovieSection({ conceptionYear, conceptionMonth }) {
  const { t } = useTranslation()
  const fetcher = useCallback(() => fetchMovie(conceptionYear, conceptionMonth), [conceptionYear, conceptionMonth])
  const { data, loading, error, execute } = useFetch(fetcher)

  useEffect(() => { execute() }, [execute])

  const renderContent = () => {
    if (loading) return <div className="loading-state"><div className="spinner" /><span>{t('loadingFilm')}</span></div>
    if (error)   return <div className="info-box info-box--error">⚠️ {error}</div>
    if (!data?.movie) return <div className="info-box">{t('noFilm')}</div>

    const m = data.movie
    const releaseFormatted = new Date(m.releaseDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    return (
      <div className={s.layout}>
        {m.poster
          ? <img className={s.poster} src={m.poster} alt={m.title} loading="lazy" onError={e => { e.target.style.display = 'none' }} />
          : <div className={s.posterPlaceholder}>🎬</div>
        }
        <div>
          <div className={s.title}>{m.title}</div>
          <div className={s.meta}>
            <span>📅 {releaseFormatted}</span>
            <span className={s.rating}>⭐ {m.rating}/10</span>
          </div>
          <div className={s.overview}>{m.overview || 'No description available.'}</div>
          <a className={s.link} href={`https://www.themoviedb.org/movie/${m.tmdbId}`} target="_blank" rel="noopener noreferrer">
            {t('viewTmdb')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="section-tag">{t('movieTag')}</div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
        {t('movieSub')}
      </p>
      {renderContent()}
    </div>
  )
}

import { useEffect, useCallback } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { useFetch } from '../../hooks/useFetch'
import { fetchCelebrities } from '../../utils/api'
import s from './CelebSection.module.css'

export default function CelebSection({ month, day, country }) {
  const { t } = useTranslation()
  const fetcher = useCallback(() => fetchCelebrities(month, day, country), [month, day, country])
  const { data, loading, error, execute } = useFetch(fetcher)

  useEffect(() => { execute() }, [execute])

  const renderContent = () => {
    if (loading) return <div className="loading-state"><div className="spinner" /><span>{t('loadingCelebs')}</span></div>
    if (error)   return <div className="info-box info-box--error">⚠️ {error}</div>
    if (!data?.celebrities?.length) return <div className="info-box">{t('noCelebs')}</div>

    return (
      <div className={s.grid}>
        {data.celebrities.map(cel => (
          <a key={cel.name} className={s.card} href={cel.url} target="_blank" rel="noopener noreferrer">
            {cel.thumbnail
              ? <img className={s.avatar} src={cel.thumbnail} alt={cel.name} loading="lazy" onError={e => { e.target.outerHTML = '<div class="' + s.avatarPlaceholder + '">👤</div>' }} />
              : <div className={s.avatarPlaceholder}>👤</div>
            }
            <div>
              <div className={s.year}>{t('bornYear')} {cel.year} · {cel.age} {t('yearsAgo')}</div>
              <div className={s.name}>{cel.name}</div>
              <div className={s.desc}>{cel.description}</div>
            </div>
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="section-tag">{t('celebTag')}</div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
        {t('celebSub')}
      </p>
      {renderContent()}
    </div>
  )
}

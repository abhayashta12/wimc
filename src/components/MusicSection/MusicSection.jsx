import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { useFetch } from '../../hooks/useFetch'
import { fetchMusic } from '../../utils/api'
import { toISODate } from '../../utils/date'
import s from './MusicSection.module.css'

export default function MusicSection({ rangeStart, rangeEnd, country }) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('country')

  const dateFrom = toISODate(rangeStart)
  const dateTo   = toISODate(rangeEnd)

  const fetcher = useCallback(
    () => fetchMusic(dateFrom, dateTo, country, activeTab),
    [dateFrom, dateTo, country, activeTab]
  )
  const { data, loading, error, execute } = useFetch(fetcher)

  useEffect(() => { execute() }, [execute])

  const renderContent = () => {
    if (loading) return <div className="loading-state"><div className="spinner" /><span>{t('loadingMusic')}</span></div>
    if (error)   return <div className="info-box info-box--error">⚠️ {error}</div>
    if (!data?.videos?.length) return <div className="info-box">{t('noMusic')}</div>

    return (
      <div className={s.videoGrid}>
        {data.videos.map(v => (
          <a key={v.videoId} className={s.videoCard} href={`https://www.youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noopener noreferrer">
            <img src={v.thumbnail} alt={v.title} loading="lazy" />
            <div className={s.videoInfo}>
              <div className={s.videoTitle}>{v.title}</div>
              <div className={s.videoChannel}>{v.channel}</div>
            </div>
          </a>
        ))}
      </div>
    )
  }

  return (
    <div className="card">
      <div className="section-tag">{t('musicTag')}</div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text2)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
        {t('musicSub')}
      </p>
      <div className={s.tabs}>
        {['country', 'global'].map(tab => (
          <button
            key={tab}
            className={`${s.tabBtn} ${activeTab === tab ? s.tabBtnActive : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'country' ? `🌍 ${t('tabCountry')}` : `🌐 ${t('tabGlobal')}`}
          </button>
        ))}
      </div>
      {renderContent()}
    </div>
  )
}

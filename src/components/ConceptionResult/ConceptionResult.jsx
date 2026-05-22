import { useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { COUNTRY_MAP } from '../../constants/countries'
import { formatDate, getZodiac, getSeason, getDayName, buildShareURL } from '../../utils/date'
import s from './ConceptionResult.module.css'

export default function ConceptionResult({ result, showToast }) {
  const { t } = useTranslation()
  const [showCard, setShowCard] = useState(false)

  const { conception, rangeStart, rangeEnd, country, month, day, year } = result

  const cheekyArr = t('cheeky')
  const cheekyLine = Array.isArray(cheekyArr)
    ? cheekyArr[Math.floor(Math.random() * cheekyArr.length)]
    : cheekyArr

  const countryName = COUNTRY_MAP[country] || country

  const facts = [
    { label: t('dayLabel'),    value: getDayName(conception) },
    { label: t('zodiacLabel'), value: getZodiac(conception) },
    { label: t('seasonLabel'), value: getSeason(conception) },
    { label: t('countryLabel2'), value: countryName },
  ]

  const shareText = `I was conceived around ${formatDate(conception)} in ${countryName}! Find out when you were conceived 👶✨`

  const handleCopyLink = () => {
    const url = buildShareURL(month, day, year, country)
    navigator.clipboard.writeText(url).then(() => showToast('Link copied! 🎉'))
  }

  return (
    <div className="card">
      <div className="section-tag">{t('resultTag')}</div>
      <div className={s.bigDate}>{formatDate(conception)}</div>

      <div className={s.rangeBox}>
        <strong>{t('mostLikely')}:</strong> {formatDate(conception)}<br />
        <strong>{t('window')}:</strong> {formatDate(rangeStart)} — {formatDate(rangeEnd)}
      </div>

      <div className={s.cheeky}>{cheekyLine}</div>

      <div className={s.factsGrid}>
        {facts.map(f => (
          <div className={s.factPill} key={f.label}>
            <div className={s.factLabel}>{f.label}</div>
            <div className={s.factValue}>{f.value}</div>
          </div>
        ))}
      </div>

      <div className={s.shareRow}>
        <button className={`${s.shareBtn} ${s.shareBtnPrimary}`} onClick={handleCopyLink}>
          🔗 {t('copyLink')}
        </button>
        <button className={s.shareBtn} onClick={() => setShowCard(v => !v)}>
          🃏 {t('shareCard')}
        </button>
        <button className={s.shareBtn} onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.origin)}`, '_blank')}>
          𝕏 Twitter
        </button>
        <button className={s.shareBtn} onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + window.location.origin)}`, '_blank')}>
          💬 WhatsApp
        </button>
        <button className={s.shareBtn} onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank')}>
          📘 Facebook
        </button>
      </div>

      {showCard && (
        <div className={s.shareCard}>
          <div className={s.shareCardSite}>wheniwasconceived.com</div>
          <div className={s.shareCardDate}>{formatDate(conception)}</div>
          <div className={s.shareCardSub}>
            {getDayName(conception)} · {getZodiac(conception)} · {countryName}
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { COUNTRY_MAP } from '../../constants/countries'
import {
  formatDate, getZodiac, getSeason, getDayName,
  buildShareURL, getSpecialDateRoast, getConceptionRarity
} from '../../utils/date'
import s from './ConceptionResult.module.css'

export default function ConceptionResult({ result, showToast }) {
  const { t } = useTranslation()
  const [showCard, setShowCard] = useState(false)

  const { conception, rangeStart, rangeEnd, country, month, day, year } = result
  const countryName = COUNTRY_MAP[country] || country

  const cheekyArr  = t('cheeky')
  const cheekyLine = Array.isArray(cheekyArr)
    ? cheekyArr[Math.floor(Math.random() * cheekyArr.length)]
    : cheekyArr

  const specialRoast = getSpecialDateRoast(conception)
  const rarity       = getConceptionRarity(conception)

  const facts = [
    { label: t('dayLabel'),      value: getDayName(conception) },
    { label: t('zodiacLabel'),   value: getZodiac(conception) },
    { label: t('seasonLabel'),   value: getSeason(conception) },
    { label: t('countryLabel2'), value: countryName },
  ]

  // The viral one-liner sentence — this is what people screenshot
  const viralSentence = buildViralSentence(conception, countryName, getDayName(conception), getSeason(conception))

  const shareText = `😭 ${viralSentence}\n\nFind out yours 👉 wheniwasconceived.com`

  const handleCopyLink = () => {
    const url = buildShareURL(month, day, year, country)
    navigator.clipboard.writeText(url).then(() => showToast('Link copied! 🎉'))
  }

  const handleCopyViral = () => {
    navigator.clipboard.writeText(shareText).then(() => showToast('Copied! Go post it 😈'))
  }

  return (
    <div className="card">
      <div className="section-tag">{t('resultTag')}</div>

      {/* Big date */}
      <div className={s.bigDate}>{formatDate(conception)}</div>

      {/* Date range */}
      <div className={s.rangeBox}>
        <strong>{t('mostLikely')}:</strong> {formatDate(conception)}<br />
        <strong>{t('window')}:</strong> {formatDate(rangeStart)} — {formatDate(rangeEnd)}
      </div>

      {/* Special date roast — only shows on holidays/Mondays etc */}
      {specialRoast && (
        <div className={s.specialRoast}>
          {specialRoast}
        </div>
      )}

      {/* Standard cheeky line */}
      <div className={s.cheeky}>{cheekyLine}</div>

      {/* Facts grid */}
      <div className={s.factsGrid}>
        {facts.map(f => (
          <div className={s.factPill} key={f.label}>
            <div className={s.factLabel}>{f.label}</div>
            <div className={s.factValue}>{f.value}</div>
          </div>
        ))}
        {/* Rarity pill */}
        <div className={s.factPill}>
          <div className={s.factLabel}>Conception rarity</div>
          <div className={s.factValue}>{rarity.label}</div>
        </div>
        <div className={s.factPill}>
          <div className={s.factLabel}>% of people conceived this month</div>
          <div className={s.factValue}>{rarity.pct}% of all babies</div>
        </div>
      </div>

      {/* VIRAL SHARE CARD — the main Instagram story weapon */}
      <div className={s.crimeReport}>
        <div className={s.crimeHeader}>
          <span className={s.crimeStamp}>INCIDENT REPORT</span>
          <span className={s.crimeSite}>wheniwasconceived.com</span>
        </div>
        <div className={s.crimeBody}>
          <div className={s.crimeLine}>
            <span className={s.crimeKey}>DATE OF INCIDENT</span>
            <span className={s.crimeVal}>{formatDate(conception)}</span>
          </div>
          <div className={s.crimeLine}>
            <span className={s.crimeKey}>DAY OF WEEK</span>
            <span className={s.crimeVal}>{getDayName(conception)} 😬</span>
          </div>
          <div className={s.crimeLine}>
            <span className={s.crimeKey}>SEASON</span>
            <span className={s.crimeVal}>{getSeason(conception)}</span>
          </div>
          <div className={s.crimeLine}>
            <span className={s.crimeKey}>LOCATION</span>
            <span className={s.crimeVal}>{countryName}</span>
          </div>
          <div className={s.crimeLine}>
            <span className={s.crimeKey}>SUSPECTS</span>
            <span className={s.crimeVal}>Your parents 👀</span>
          </div>
          <div className={s.crimeViral}>{viralSentence}</div>
        </div>
      </div>

      {/* Share buttons */}
      <div className={s.shareRow}>
        <button className={`${s.shareBtn} ${s.shareBtnPrimary}`} onClick={handleCopyViral}>
          😈 Copy & Post
        </button>
        <button className={`${s.shareBtn} ${s.shareBtnPrimary}`} onClick={handleCopyLink}>
          🔗 {t('copyLink')}
        </button>
        <button className={s.shareBtn} onClick={() => setShowCard(v => !v)}>
          🃏 {t('shareCard')}
        </button>
        <button className={s.shareBtn} onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}>
          𝕏 Twitter
        </button>
        <button className={s.shareBtn} onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')}>
          💬 WhatsApp
        </button>
        <button className={s.shareBtn} onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`, '_blank')}>
          📘 Facebook
        </button>
      </div>

      {/* Collapsible share card */}
      {showCard && (
        <div className={s.shareCard}>
          <div className={s.shareCardSite}>wheniwasconceived.com</div>
          <div className={s.shareCardDate}>{formatDate(conception)}</div>
          <div className={s.shareCardSub}>
            {getDayName(conception)} · {getZodiac(conception)} · {countryName}
          </div>
          <div className={s.shareCardViral}>{viralSentence}</div>
        </div>
      )}
    </div>
  )
}

// Builds the deadpan one-liner that's actually shareable
function buildViralSentence(date, country, dayName, season) {
  const m = date.getMonth() + 1
  const d = date.getDate()
  const yr = date.getFullYear()

  // Special date overrides
  if (m === 2  && d === 14) return `My parents chose Valentine's Day ${yr} for this. I am the consequence of romance.`
  if (m === 12 && d === 25) return `My parents did this on Christmas ${yr}. Santa was not the only one coming that night.`
  if (m === 12 && d === 31) return `NYE ${yr}. The countdown was not the only thing happening.`
  if (m === 10 && d === 31) return `My parents were in costume on Halloween ${yr} and apparently very into it.`
  if (m === 4  && d === 1)  return `I was conceived on April Fools' Day ${yr}. The joke was on everyone.`
  if (m === 2  && d === 29) return `Leap Day ${yr}. My parents waited 4 years for this opportunity and took it.`

  // Season based
  const seasonLines = {
    '❄️ Winter': `My parents had nothing to do on a ${dayName} in ${season.replace('❄️ ', '')} ${yr}. Now I exist.`,
    '🌸 Spring': `Something was in the air on a ${dayName} in ${season.replace('🌸 ', '')} ${yr}. That something was me, apparently.`,
    '☀️ Summer': `A ${dayName} in ${season.replace('☀️ ', '')} ${yr}. It was hot outside. It was also hot inside.`,
    '🍂 Autumn': `A ${dayName} in ${season.replace('🍂 ', '')} ${yr}. The leaves weren't the only things falling.`,
  }

  return seasonLines[season]
    || `My parents were very busy on a ${dayName} in ${yr} in ${country}. Nine months later: me.`
}

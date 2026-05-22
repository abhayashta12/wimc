import { useState, useEffect } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import { COUNTRIES } from '../../constants/countries'
import { getDaysInMonth, MONTHS } from '../../utils/date'
import s from './BirthForm.module.css'

const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: currentYear - 1939 }, (_, i) => currentYear - i)

export default function BirthForm({ onCalculate }) {
  const { t } = useTranslation()
  const [month,   setMonth]   = useState('')
  const [day,     setDay]     = useState('')
  const [year,    setYear]    = useState('')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false)

  const maxDays = getDaysInMonth(parseInt(month), parseInt(year))
  const days    = Array.from({ length: maxDays }, (_, i) => i + 1)

  // Reset day if it exceeds days in new month/year
  useEffect(() => {
    if (day && parseInt(day) > maxDays) setDay('')
  }, [month, year, maxDays, day])

  const handleSubmit = () => {
    if (!month || !day || !year) { alert(t('dobLabel') + ' required'); return }
    if (!country)                { alert(t('countryLabel') + ' required'); return }
    setLoading(true)
    // Small delay for UX feedback
    setTimeout(() => {
      onCalculate({ month: parseInt(month), day: parseInt(day), year: parseInt(year), country })
      setLoading(false)
    }, 600)
  }

  return (
    <div className={s.formCard}>
      <h2>{t('formTitle')}</h2>

      <label className={s.label}>{t('dobLabel')}</label>
      <div className={s.dateRow}>
        <select className={s.select} value={month} onChange={e => setMonth(e.target.value)}>
          <option value="">Month</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>

        <select className={s.select} value={day} onChange={e => setDay(e.target.value)}>
          <option value="">Day</option>
          {days.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select className={`${s.select} ${s.yearCol}`} value={year} onChange={e => setYear(e.target.value)}>
          <option value="">Year</option>
          {YEARS.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className={s.countryRow}>
        <label className={s.label}>{t('countryLabel')}</label>
        <select className={s.select} value={country} onChange={e => setCountry(e.target.value)}>
          <option value="">Select your country...</option>
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
          ))}
        </select>
      </div>

      <button className={s.calcBtn} onClick={handleSubmit} disabled={loading}>
        {loading
          ? <span className={s.btnSpinner} />
          : t('calcBtn')
        }
      </button>
    </div>
  )
}

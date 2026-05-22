import { useContext } from 'react'
import { LangContext } from '../../context/LangContext'
import { ThemeContext } from '../../context/ThemeContext'
import { LANGUAGES } from '../../constants/translations'
import s from './Header.module.css'

export default function Header() {
  const { lang, setLang } = useContext(LangContext)
  const { isDark, toggle } = useContext(ThemeContext)

  return (
    <header className={s.header}>
      <a href="/" className={s.logo}>
        when<span className={s.logoAccent}>i</span>wasconceived
      </a>
      <div className={s.controls}>
        <select
          className={s.langSelect}
          value={lang}
          onChange={e => setLang(e.target.value)}
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
        <button className={s.themeBtn} onClick={toggle} title="Toggle dark mode">
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  )
}

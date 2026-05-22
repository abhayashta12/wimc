import { useContext } from 'react'
import { LangContext } from '../context/LangContext'
import { TRANSLATIONS } from '../constants/translations'

export function useTranslation() {
  const { lang } = useContext(LangContext)
  const t = (key) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key
  return { t, lang }
}

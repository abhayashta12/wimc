import { useTranslation } from '../../hooks/useTranslation'
import s from './Hero.module.css'

export default function Hero() {
  const { t } = useTranslation()
  return (
    <div className={s.hero}>
      <div className={s.eyebrow}>{t('eyebrow')}</div>
      <h1 className={s.h1} dangerouslySetInnerHTML={{ __html: t('h1') }} />
      <p className={s.sub} dangerouslySetInnerHTML={{ __html: t('sub') }} />
    </div>
  )
}

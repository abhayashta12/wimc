import s from './Toast.module.css'

export default function Toast({ message, visible }) {
  return (
    <div className={`${s.toast} ${visible ? s.toastVisible : ''}`}>
      {message}
    </div>
  )
}

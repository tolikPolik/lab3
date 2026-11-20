import { useState } from 'react'
import './FeedbackForm.css'

function FeedbackForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [wantReply, setWantReply] = useState(true)
  const [errors, setErrors] = useState({ name: null, email: null, phone: null, message: null })
  const [touched, setTouched] = useState({ name: false, email: false, phone: false, message: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validateName = (value) => {
    if (!value.trim()) return 'Имя обязательно для заполнения'
    if (value.trim().length < 2) return 'Минимум 2 символа'
    if (!/^[a-zA-Zа-яА-ЯёЁ\s-]+$/.test(value.trim())) return 'Только буквы, пробелы и дефис'
    return null
  }

  const validateEmail = (value, required = wantReply) => {
    if (!value.trim()) return required ? 'Email обязателен для заполнения' : null
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Некорректный формат email'
    return null
  }

  const validatePhone = (value) => {
    if (!value) return null
    if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value)) return 'Введите номер полностью'
    return null
  }

  const validateMessage = (value) => {
    if (!value.trim()) return 'Сообщение обязательно для заполнения'
    if (value.trim().length < 10) return 'Минимум 10 символов'
    if (value.length > 500) return 'Максимум 500 символов'
    return null
  }

  const validators = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
    message: validateMessage,
  }

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, '')
    if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1)
    digits = digits.slice(0, 10)
    if (!digits) return ''
    let result = '+7 (' + digits.slice(0, 3)
    if (digits.length >= 3) result += ')'
    if (digits.length > 3) result += ' ' + digits.slice(3, 6)
    if (digits.length > 6) result += '-' + digits.slice(6, 8)
    if (digits.length > 8) result += '-' + digits.slice(8, 10)
    return result
  }

  const handleChange = (field, value) => {
    if (field === 'name') setName(value)
    if (field === 'email') setEmail(value)
    if (field === 'phone') {
      value = formatPhone(value)
      setPhone(value)
    }
    if (field === 'message') setMessage(value)
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](value) }))
    }
  }

  const handleBlur = (field) => {
    const values = { name, email, phone, message }
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({ ...prev, [field]: validators[field](values[field]) }))
  }

  const handleReplyChange = (checked) => {
    setWantReply(checked)
    setErrors((prev) => ({ ...prev, email: validateEmail(email, checked) }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      message: validateMessage(message),
    }
    setErrors(newErrors)
    setTouched({ name: true, email: true, phone: true, message: true })
    if (Object.values(newErrors).some((error) => error !== null)) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setPhone('')
    setMessage('')
    setWantReply(true)
    setErrors({ name: null, email: null, phone: null, message: null })
    setTouched({ name: false, email: false, phone: false, message: false })
    setSubmitted(false)
  }

  const getInputClass = (field) => {
    const classes = ['field__input']
    if (touched[field] && errors[field]) classes.push('field__input--error')
    else if (touched[field] && !errors[field]) classes.push('field__input--valid')
    if (field === 'message') classes.push('field__input--textarea')
    return classes.join(' ')
  }

  if (submitted) {
    return (
      <div className="feedback-form feedback-form--success" role="status">
        <h2 className="feedback-form__title">Спасибо за обращение!</h2>
        <p className="feedback-form__text">{wantReply ? 'Мы свяжемся с вами в ближайшее время.' : 'Ваше сообщение принято.'}</p>
        <button type="button" className="feedback-form__submit" onClick={resetForm}>
          Отправить ещё одно сообщение
        </button>
      </div>
    )
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="name" className="field__label">Имя</label>
        <input id="name" type="text" autoComplete="name" className={getInputClass('name')} value={name} onChange={(e) => handleChange('name', e.target.value)} onBlur={() => handleBlur('name')} aria-invalid={Boolean(touched.name && errors.name)} />
        {touched.name && errors.name && <span className="field__error">{errors.name}</span>}
      </div>

      <div className="field">
        <label htmlFor="email" className="field__label">Email</label>
        <input id="email" type="email" autoComplete="email" className={getInputClass('email')} value={email} onChange={(e) => handleChange('email', e.target.value)} onBlur={() => handleBlur('email')} aria-invalid={Boolean(touched.email && errors.email)} />
        {touched.email && errors.email && <span className="field__error">{errors.email}</span>}
      </div>

      <div className="field">
        <label htmlFor="phone" className="field__label">Телефон</label>
        <input id="phone" type="tel" autoComplete="tel" placeholder="+7 (999) 123-45-67" className={getInputClass('phone')} value={phone} onChange={(e) => handleChange('phone', e.target.value)} onBlur={() => handleBlur('phone')} aria-invalid={Boolean(touched.phone && errors.phone)} />
        {touched.phone && errors.phone && <span className="field__error">{errors.phone}</span>}
      </div>

      <div className="field">
        <label htmlFor="message" className="field__label">Сообщение</label>
        <textarea id="message" rows={5} maxLength={500} className={getInputClass('message')} value={message} onChange={(e) => handleChange('message', e.target.value)} onBlur={() => handleBlur('message')} aria-invalid={Boolean(touched.message && errors.message)} />
        <span className="field__counter">{message.length} / 500</span>
        {touched.message && errors.message && <span className="field__error">{errors.message}</span>}
      </div>

      <label className="feedback-form__checkbox">
        <input type="checkbox" checked={wantReply} onChange={(e) => handleReplyChange(e.target.checked)} />
        <span>Хочу получить ответ</span>
      </label>

      <button type="submit" className="feedback-form__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Отправка…' : 'Отправить'}
      </button>
    </form>
  )
}

export default FeedbackForm

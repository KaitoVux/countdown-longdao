import { useState, type FormEvent } from 'react'
import { addMessage } from '../services/message-service'

interface MessageFormProps {
  onMessageSent: () => void
}

export function MessageForm({ onMessageSent }: MessageFormProps) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const nameValid = name.trim().length > 0 && name.trim().length <= 50
  const contentValid = content.trim().length > 0 && content.trim().length <= 500

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!nameValid || !contentValid) {
      setError('Vui lòng điền đầy đủ thông tin.')
      return
    }

    setSending(true)
    try {
      await addMessage(name, content)
      setName('')
      setContent('')
      setSuccess(true)
      // Delay refetch to let serverTimestamp() resolve
      setTimeout(onMessageSent, 500)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Gửi thất bại. Vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="msg-name" className="form-label">TÊN CỦA BẠN</label>
        <input
          id="msg-name"
          type="text"
          className="form-input"
          placeholder="Nhập tên của bạn..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          disabled={sending}
        />
      </div>
      <div className="form-field">
        <label htmlFor="msg-content" className="form-label">LỜI NHẮN</label>
        <textarea
          id="msg-content"
          className="form-textarea"
          placeholder="Viết lời nhắn gửi Long Đào..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          rows={4}
          disabled={sending}
        />
        <span className={`form-char-count${content.length > 450 ? ' near-limit' : ''}`}>
          {content.length}/500
        </span>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}
      {success && <p className="form-success" role="status">Gửi thư thành công!</p>}

      <button
        type="submit"
        className="form-submit"
        disabled={sending || !nameValid || !contentValid}
      >
        {sending ? 'Đang gửi...' : '✉ GỬI THƯ'}
      </button>
    </form>
  )
}

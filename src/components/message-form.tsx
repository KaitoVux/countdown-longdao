import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { addMessage } from '../services/message-service'

interface MessageFormProps {
  onMessageSent: (messageId: string) => void
}

export function MessageForm({ onMessageSent }: MessageFormProps) {
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showSendTrail, setShowSendTrail] = useState(false)
  const [submitPhase, setSubmitPhase] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const timeoutIds = useRef<number[]>([])
  const prefersReducedMotion = useReducedMotion()

  const nameValid = name.trim().length > 0 && name.trim().length <= 50
  const contentValid = content.trim().length > 0 && content.trim().length <= 500

  function clearQueuedTimeouts() {
    timeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId))
    timeoutIds.current = []
  }

  useEffect(() => {
    return () => {
      clearQueuedTimeouts()
    }
  }, [])

  function queueTimeout(callback: () => void, delayMs: number) {
    const timeoutId = window.setTimeout(callback, delayMs)
    timeoutIds.current.push(timeoutId)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    clearQueuedTimeouts()
    setError('')
    setSuccess(false)
    setShowSendTrail(false)

    if (!nameValid || !contentValid) {
      setError('Vui lòng điền đầy đủ thông tin.')
      setSubmitPhase('error')
      queueTimeout(() => setSubmitPhase('idle'), 900)
      return
    }

    setSending(true)
    setSubmitPhase('sending')
    try {
      const messageId = await addMessage(name, content)
      setName('')
      setContent('')
      setSuccess(true)
      setShowSendTrail(true)
      setSubmitPhase('success')
      onMessageSent(messageId)

      queueTimeout(() => setSuccess(false), 2500)
      queueTimeout(() => setSubmitPhase('idle'), 1400)
      queueTimeout(() => setShowSendTrail(false), 700)
    } catch {
      setError('Gửi thất bại. Vui lòng thử lại.')
      setSubmitPhase('error')
      queueTimeout(() => setSubmitPhase('idle'), 900)
    } finally {
      setSending(false)
    }
  }

  return (
    <motion.form
      className="message-form"
      onSubmit={handleSubmit}
      layout
      transition={{ duration: 0.28, ease: 'easeOut' }}
    >
      <AnimatePresence>
        {showSendTrail && !prefersReducedMotion && (
          <motion.span
            className="form-send-trail"
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: 340, y: -90, opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

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
      <AnimatePresence mode="wait">
        {!error && success && (
          <motion.p
            key="success-message"
            className="form-success"
            role="status"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            Gửi thư thành công!
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        className="form-submit"
        disabled={sending || !nameValid || !contentValid}
        initial={false}
        animate={submitPhase}
        whileHover={
          sending || !nameValid || !contentValid || prefersReducedMotion
            ? undefined
            : { y: -1 }
        }
        whileTap={
          sending || !nameValid || !contentValid || prefersReducedMotion
            ? undefined
            : { y: 0, scale: 0.99 }
        }
        variants={{
          idle: { x: 0, scale: 1, filter: 'brightness(1)' },
          sending: prefersReducedMotion
            ? { scale: 1 }
            : { scale: [1, 0.99, 1], transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' } },
          success: prefersReducedMotion
            ? { scale: 1 }
            : { scale: [1, 1.02, 1], filter: 'brightness(1.08)', transition: { duration: 0.36, ease: 'easeOut' } },
          error: prefersReducedMotion
            ? { x: 0 }
            : { x: [0, -6, 5, -3, 0], transition: { duration: 0.35, ease: 'easeInOut' } },
        }}
      >
        <span className="form-submit-label">
          {sending ? 'ĐANG GỬI...' : success ? 'ĐÃ GỬI' : 'GỬI THƯ'}
        </span>
        <AnimatePresence>
          {sending && (
            <motion.span
              className="form-submit-spinner"
              key="submit-spinner"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: 'linear', repeat: Infinity }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
        {!prefersReducedMotion && (
          <motion.span
            className="form-submit-glint"
            aria-hidden="true"
            initial={false}
            animate={sending ? { x: ['-120%', '160%'] } : { x: '-120%' }}
            transition={
              sending
                ? { duration: 1, repeat: Infinity, ease: 'linear' }
                : { duration: 0.2, ease: 'easeOut' }
            }
          />
        )}
      </motion.button>
    </motion.form>
  )
}

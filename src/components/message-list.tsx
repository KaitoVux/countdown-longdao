import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { getMessages, type Message } from '../services/message-service'
import { MessageCard } from './message-card'
import { MessageForm } from './message-form'

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [scrolledBottom, setScrolledBottom] = useState(false)
  const [freshMessageId, setFreshMessageId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const freshMessageTimerRef = useRef<number | null>(null)
  const fetchRetryTimerRef = useRef<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const fetchMessages = useCallback(async (expectedMessageId?: string) => {
    try {
      const data = await getMessages()
      setMessages(data)
      setError('')

      if (expectedMessageId && data.some((msg) => msg.id === expectedMessageId)) {
        setFreshMessageId(expectedMessageId)
        if (freshMessageTimerRef.current) {
          window.clearTimeout(freshMessageTimerRef.current)
        }
        freshMessageTimerRef.current = window.setTimeout(() => {
          setFreshMessageId(null)
        }, 2500)
      }
    } catch {
      setError('Không thể tải lời nhắn.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    return () => {
      if (freshMessageTimerRef.current) {
        window.clearTimeout(freshMessageTimerRef.current)
      }
      if (fetchRetryTimerRef.current) {
        window.clearTimeout(fetchRetryTimerRef.current)
      }
    }
  }, [fetchMessages])

  // Detect when user scrolls to bottom to hide fade overlay
  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20
    setScrolledBottom(atBottom)
  }

  const handleMessageSent = useCallback((messageId: string) => {
    if (fetchRetryTimerRef.current) {
      window.clearTimeout(fetchRetryTimerRef.current)
    }
    // Wait briefly so serverTimestamp ordering is stable.
    fetchRetryTimerRef.current = window.setTimeout(() => {
      void fetchMessages(messageId)
    }, 350)
  }, [fetchMessages])

  return (
    <motion.section
      className="message-section"
      initial={prefersReducedMotion ? false : { opacity: 0, x: 14 }}
      animate={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
    >
      <div className="message-section-divider">
        <span className="divider-line" />
        <span className="divider-text">
          THƯ GỬI CHIẾN SĨ
          {messages.length > 0 && (
            <motion.span
              className="message-count"
              key={messages.length}
              initial={prefersReducedMotion ? false : { scale: 0.85, opacity: 0.75 }}
              animate={prefersReducedMotion ? undefined : { scale: [0.9, 1.08, 1], opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              {messages.length}
            </motion.span>
          )}
        </span>
        <span className="divider-line" />
      </div>

      <MessageForm onMessageSent={handleMessageSent} />

      <AnimatePresence mode="wait" initial={false}>
        {loading && (
          <motion.div
            key="message-loading"
            className="message-loading"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <span className="loading-spinner" />
            <span>Đang tải lời nhắn...</span>
          </motion.div>
        )}

        {error && (
          <motion.p
            key="message-error"
            className="message-error"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {error}
          </motion.p>
        )}

        {!loading && !error && messages.length === 0 && (
          <motion.div
            key="message-empty"
            className="message-empty"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <span className="message-empty-icon" aria-hidden="true">&#9993;</span>
            <p>Chưa có ai gửi thư.</p>
            <p>Hãy là người đầu tiên!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.length > 0 && (
        <motion.div
          className={`message-scroll-container${scrolledBottom ? ' scrolled-bottom' : ''}`}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div
            className="message-scroll-area"
            ref={scrollRef}
            onScroll={handleScroll}
          >
            <motion.div
              className="message-grid"
              layout
              transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            >
              <AnimatePresence initial={!prefersReducedMotion}>
                {messages.map((msg, i) => (
                  <MessageCard
                    key={msg.id}
                    message={msg}
                    index={i}
                    isFresh={freshMessageId === msg.id}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.section>
  )
}

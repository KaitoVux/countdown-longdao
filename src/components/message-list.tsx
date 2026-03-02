import { useState, useEffect, useCallback, useRef } from 'react'
import { getMessages, type Message } from '../services/message-service'
import { MessageCard } from './message-card'
import { MessageForm } from './message-form'

export function MessageList() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [scrolledBottom, setScrolledBottom] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(async () => {
    try {
      const data = await getMessages()
      setMessages(data)
      setError('')
    } catch {
      setError('Không thể tải lời nhắn.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Detect when user scrolls to bottom to hide fade overlay
  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20
    setScrolledBottom(atBottom)
  }

  return (
    <section className="message-section">
      <div className="message-section-divider">
        <span className="divider-line" />
        <span className="divider-text">
          THƯ GỬI CHIẾN SĨ
          {messages.length > 0 && (
            <span className="message-count">{messages.length}</span>
          )}
        </span>
        <span className="divider-line" />
      </div>

      <MessageForm onMessageSent={fetchMessages} />

      {loading && (
        <div className="message-loading">
          <span className="loading-spinner" />
          <span>Đang tải lời nhắn...</span>
        </div>
      )}

      {error && <p className="message-error">{error}</p>}

      {!loading && !error && messages.length === 0 && (
        <div className="message-empty">
          <span className="message-empty-icon" aria-hidden="true">&#9993;</span>
          <p>Chưa có ai gửi thư.</p>
          <p>Hãy là người đầu tiên!</p>
        </div>
      )}

      {messages.length > 0 && (
        <div className={`message-scroll-container${scrolledBottom ? ' scrolled-bottom' : ''}`}>
          <div
            className="message-scroll-area"
            ref={scrollRef}
            onScroll={handleScroll}
          >
            <div className="message-grid">
              {messages.map((msg, i) => (
                <MessageCard key={msg.id} message={msg} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

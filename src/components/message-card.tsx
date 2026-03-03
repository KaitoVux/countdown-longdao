import { motion, useReducedMotion } from 'framer-motion'
import type { Message } from '../services/message-service'

function formatRelativeTime(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 30) return date.toLocaleDateString('vi-VN')
  if (days > 0) return `${days} ngày trước`
  if (hours > 0) return `${hours} giờ trước`
  if (minutes > 0) return `${minutes} phút trước`
  return 'Vừa xong'
}

interface MessageCardProps {
  message: Message
  index: number
  isFresh?: boolean
}

export function MessageCard({ message, index, isFresh = false }: MessageCardProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.article
      className={`message-card${isFresh ? ' fresh' : ''}`}
      layout
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96, filter: 'blur(3px)' }}
      animate={prefersReducedMotion
        ? { opacity: 1 }
        : {
            opacity: 1,
            y: 0,
            scale: isFresh ? [0.985, 1.015, 1] : 1,
            filter: 'blur(0px)',
          }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.97 }}
      transition={{
        duration: prefersReducedMotion ? 0.18 : 0.42,
        delay: prefersReducedMotion ? 0 : Math.min(index * 0.06, 0.42),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.005 }}
    >
      <div className="message-card-header">
        <span className="message-card-star">&#9734;</span>
        <span className="message-card-name">{message.name}</span>
      </div>
      <span className="message-card-time">
        {formatRelativeTime(message.createdAt)}
      </span>
      <p className="message-card-content">{message.content}</p>
    </motion.article>
  )
}

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
}

export function MessageCard({ message, index }: MessageCardProps) {
  return (
    <div
      className="message-card"
      style={{ animationDelay: `${Math.min(index * 0.08, 0.64)}s` }}
    >
      <div className="message-card-header">
        <span className="message-card-star">&#9734;</span>
        <span className="message-card-name">{message.name}</span>
      </div>
      <span className="message-card-time">
        {formatRelativeTime(message.createdAt)}
      </span>
      <p className="message-card-content">{message.content}</p>
    </div>
  )
}

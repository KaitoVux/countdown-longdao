import { useState, useEffect } from 'react'
import './App.css'
import './styles/message-board.css'
import { MessageList } from './components/message-list'

const ENLIST_DATE = new Date('2026-03-04T00:00:00').getTime()
const RETURN_DATE = new Date('2028-03-04T00:00:00').getTime()
const TOTAL_DURATION = RETURN_DATE - ENLIST_DATE

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const now = Date.now()
  const diff = Math.max(0, RETURN_DATE - now)

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function getProgress(): number {
  const now = Date.now()
  if (now <= ENLIST_DATE) return 0
  if (now >= RETURN_DATE) return 100
  return ((now - ENLIST_DATE) / TOTAL_DURATION) * 100
}

function App() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft())
  const [progress, setProgress] = useState<number>(getProgress())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft())
      setProgress(getProgress())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const isComplete = progress >= 100

  return (
    <div className="app">
      <div className="layout-split">
      <div className="container">
        <div className="badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="#c8a84e">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h1 className="name">LONG ĐÀO</h1>
        <p className="subtitle">NGHĨA VỤ QUÂN SỰ 2026 - 2028</p>

        <div className="dates">
          <div className="date-item">
            <span className="date-label">NHẬP NGŨ</span>
            <span className="date-value">04/03/2026</span>
          </div>
          <div className="date-separator">⟶</div>
          <div className="date-item">
            <span className="date-label">TRỞ VỀ</span>
            <span className="date-value">04/03/2028</span>
          </div>
        </div>

        {isComplete ? (
          <div className="complete-message">
            <h2>CHÀO MỪNG TRỞ VỀ!</h2>
            <p>Nhiệm vụ hoàn thành xuất sắc, chiến sĩ!</p>
          </div>
        ) : (
          <>
            <p className="countdown-label">THỜI GIAN CÒN LẠI</p>
            <div className="countdown">
              <div className="time-block">
                <span className="time-number" key={timeLeft.days}>{timeLeft.days}</span>
                <span className="time-label">NGÀY</span>
              </div>
              <div className="time-separator">:</div>
              <div className="time-block">
                <span className="time-number" key={`h-${timeLeft.hours}`}>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="time-label">GIỜ</span>
              </div>
              <div className="time-separator">:</div>
              <div className="time-block">
                <span className="time-number" key={`m-${timeLeft.minutes}`}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="time-label">PHÚT</span>
              </div>
              <div className="time-separator">:</div>
              <div className="time-block">
                <span className="time-number" key={`s-${timeLeft.seconds}`}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="time-label">GIÂY</span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <span>TIẾN ĐỘ HOÀN THÀNH</span>
                <span className="progress-percent">{progress.toFixed(2)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-milestones">
                <div className="progress-milestone" />
                <div className="progress-milestone" />
                <div className="progress-milestone" />
              </div>
            </div>
          </>
        )}

        <p className="footer-text">Chờ ngày anh về! 💪🇻🇳</p>
      </div>

      <MessageList />
      </div>
    </div>
  )
}

export default App

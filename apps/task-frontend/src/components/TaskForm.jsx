import { useState } from 'react'

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scheduled_at, setScheduledAt] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    const ok = await onSubmit({ title: title.trim(), description: description.trim(), scheduled_at })
    if (ok) {
      setTitle('')
      setDescription('')
      setScheduledAt('')
    }
    setSubmitting(false)
  }

  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.badge}>NEW</span>
        <h2 style={styles.cardTitle}>建立新任務</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={styles.label}>任務名稱 <span style={{ color: '#FF6BB5' }}>*</span></label>
          <input
            style={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. 每天早上九點寄出報表 Email"
            required
          />
        </div>

        <div>
          <label style={styles.label}>任務描述</label>
          <textarea
            style={{ ...styles.input, height: 80, resize: 'vertical' }}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="選填"
          />
        </div>

        <div>
          <label style={styles.label}>排程時間 <span style={{ color: '#888', fontWeight: 400 }}>(選填，留空立即執行)</span></label>
          <input
            style={styles.input}
            type="datetime-local"
            value={scheduled_at}
            onChange={e => setScheduledAt(e.target.value)}
          />
        </div>

        <button type="submit" disabled={submitting} style={submitting ? styles.btnDisabled : styles.btn}
          onMouseEnter={e => { if (!submitting) Object.assign(e.target.style, styles.btnHover) }}
          onMouseLeave={e => { if (!submitting) Object.assign(e.target.style, styles.btn) }}
        >
          {submitting ? '送出中...' : '➜ 送出任務'}
        </button>
      </form>
    </section>
  )
}

const styles = {
  card: {
    background: '#fff',
    border: '3px solid #000',
    boxShadow: '6px 6px 0px #000',
    padding: '28px 32px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  badge: {
    background: '#FF6BB5',
    color: '#000',
    fontWeight: 800,
    fontSize: 12,
    padding: '2px 8px',
    border: '2px solid #000',
    letterSpacing: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 800,
  },
  label: {
    display: 'block',
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '3px solid #000',
    borderRadius: 0,
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    background: '#F2F0E8',
    transition: 'box-shadow 0.1s',
  },
  btn: {
    background: '#FFE500',
    color: '#000',
    border: '3px solid #000',
    padding: '12px 32px',
    fontFamily: 'inherit',
    fontWeight: 800,
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '4px 4px 0px #000',
    transition: 'all 0.1s',
    letterSpacing: 0.5,
  },
  btnHover: {
    background: '#FFE500',
    color: '#000',
    border: '3px solid #000',
    padding: '12px 32px',
    fontFamily: 'inherit',
    fontWeight: 800,
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '2px 2px 0px #000',
    transform: 'translate(2px, 2px)',
    transition: 'all 0.1s',
    letterSpacing: 0.5,
  },
  btnDisabled: {
    background: '#ccc',
    color: '#666',
    border: '3px solid #888',
    padding: '12px 32px',
    fontFamily: 'inherit',
    fontWeight: 800,
    fontSize: 16,
    cursor: 'not-allowed',
    boxShadow: 'none',
    letterSpacing: 0.5,
  },
}

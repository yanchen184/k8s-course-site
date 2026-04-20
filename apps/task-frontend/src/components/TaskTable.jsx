export default function TaskTable({ tasks, loading, onRefresh }) {
  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.badge}>LIST</span>
        <h2 style={styles.cardTitle}>任務列表</h2>
        <button
          onClick={onRefresh}
          style={styles.refreshBtn}
          onMouseEnter={e => Object.assign(e.target.style, styles.refreshBtnHover)}
          onMouseLeave={e => Object.assign(e.target.style, styles.refreshBtn)}
        >
          ↻ 重整
        </button>
      </div>

      {loading ? (
        <div style={styles.empty}>載入中...</div>
      ) : tasks.length === 0 ? (
        <div style={styles.empty}>尚無任務，建立第一個吧！</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr style={{ background: '#000', color: '#FFE500' }}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>標題</th>
                <th style={styles.th}>狀態</th>
                <th style={styles.th}>建立時間</th>
                <th style={styles.th}>執行時間</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t, i) => (
                <tr key={t.id} style={{ background: i % 2 === 0 ? '#fff' : '#F2F0E8' }}>
                  <td style={styles.td}>
                    <span style={styles.idBadge}>#{t.id}</span>
                  </td>
                  <td style={{ ...styles.td, fontWeight: 700 }}>{t.title}</td>
                  <td style={styles.td}>
                    <StatusBadge status={t.status} />
                  </td>
                  <td style={styles.td}>{fmt(t.created_at)}</td>
                  <td style={styles.td}>{t.executed_at ? fmt(t.executed_at) : <span style={{ color: '#aaa' }}>—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function StatusBadge({ status }) {
  const map = {
    pending: { bg: '#FFE500', label: 'PENDING' },
    done:    { bg: '#00FF88', label: 'DONE' },
  }
  const { bg, label } = map[status] || { bg: '#eee', label: status.toUpperCase() }
  return (
    <span style={{
      background: bg,
      color: '#000',
      fontWeight: 800,
      fontSize: 11,
      padding: '2px 8px',
      border: '2px solid #000',
      letterSpacing: 1,
    }}>
      {label}
    </span>
  )
}

function fmt(iso) {
  return new Date(iso).toLocaleString('zh-TW', { hour12: false })
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
    background: '#00E5FF',
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
    flex: 1,
  },
  refreshBtn: {
    background: '#fff',
    color: '#000',
    border: '2px solid #000',
    padding: '6px 14px',
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    boxShadow: '3px 3px 0px #000',
    transition: 'all 0.1s',
  },
  refreshBtnHover: {
    background: '#fff',
    color: '#000',
    border: '2px solid #000',
    padding: '6px 14px',
    fontFamily: 'inherit',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    boxShadow: '1px 1px 0px #000',
    transform: 'translate(2px, 2px)',
    transition: 'all 0.1s',
  },
  empty: {
    textAlign: 'center',
    padding: '40px 0',
    color: '#888',
    fontWeight: 700,
    fontSize: 15,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '3px solid #000',
    fontSize: 14,
  },
  th: {
    padding: '10px 14px',
    textAlign: 'left',
    fontWeight: 800,
    fontSize: 13,
    letterSpacing: 0.5,
    borderRight: '2px solid #333',
  },
  td: {
    padding: '10px 14px',
    borderBottom: '2px solid #000',
    borderRight: '2px solid #eee',
    verticalAlign: 'middle',
  },
  idBadge: {
    fontWeight: 800,
    fontSize: 13,
    color: '#555',
  },
}

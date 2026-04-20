export default function Toast({ msg, type }) {
  const bg = type === 'error' ? '#FF6BB5' : '#00FF88'
  return (
    <div style={{
      position: 'fixed',
      bottom: 32,
      right: 32,
      background: bg,
      color: '#000',
      border: '3px solid #000',
      boxShadow: '5px 5px 0px #000',
      padding: '14px 24px',
      fontWeight: 800,
      fontSize: 15,
      maxWidth: 320,
      zIndex: 999,
    }}>
      {type === 'error' ? '✗ ' : '✓ '}{msg}
    </div>
  )
}

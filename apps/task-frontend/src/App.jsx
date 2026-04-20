import { useState, useEffect, useCallback } from 'react'
import TaskForm from './components/TaskForm'
import TaskTable from './components/TaskTable'
import Toast from './components/Toast'

const API = '/api'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API}/tasks`)
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch {
      showToast('無法連線到 API', 'error')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = async ({ title, description, scheduled_at }) => {
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, scheduled_at: scheduled_at || null })
      })
      const data = await res.json()
      if (res.ok) {
        showToast(`任務 #${data.task.id} 建立成功！`)
        loadTasks()
        return true
      } else {
        showToast(data.error || '建立失敗', 'error')
        return false
      }
    } catch {
      showToast('無法連線到 API', 'error')
      return false
    }
  }

  useEffect(() => {
    loadTasks()
    const timer = setInterval(loadTasks, 10000)
    return () => clearInterval(timer)
  }, [loadTasks])

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        <TaskForm onSubmit={createTask} />
        <TaskTable tasks={tasks} loading={loading} onRefresh={loadTasks} />
      </main>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  )
}

function Header() {
  return (
    <header style={{
      background: '#FFE500',
      borderBottom: '3px solid #000',
      padding: '20px 32px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{
        background: '#000',
        color: '#FFE500',
        fontWeight: 800,
        fontSize: 22,
        padding: '4px 12px',
        letterSpacing: 1,
      }}>
        TASK
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
        任務排程系統
      </h1>
      <div style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: '#555' }}>
        K8s Demo · Loop 3
      </div>
    </header>
  )
}

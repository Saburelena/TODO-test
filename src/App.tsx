import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

type Task = {
  id: number
  title: string
  done: boolean
}

function readTasks(): Task[] {
  const saved = localStorage.getItem('tasks')
  if (!saved) return []
  return JSON.parse(saved) as Task[]
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(readTasks)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(event: FormEvent) {
    event.preventDefault()
    const title = text.trim()
    if (title === '') return

    const task: Task = { id: Date.now(), title, done: false }
    setTasks([task, ...tasks])
    setText('')
  }

  function toggleTask(id: number) {
    const next = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, done: !task.done }
      }
      return task
    })
    setTasks(next)
  }

  function deleteTask(id: number) {
    const next = tasks.filter((task) => task.id !== id)
    setTasks(next)
  }

  let visible = tasks
  if (filter === 'active') {
    visible = tasks.filter((task) => !task.done)
  }
  if (filter === 'done') {
    visible = tasks.filter((task) => task.done)
  }

  return (
    <main>
      <h1>Задачи</h1>
      <form onSubmit={addTask}>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Новая задача"
        />
        <button type="submit" disabled={text.trim() === ''}>
          Добавить
        </button>
      </form>

      <div className="filters">
        <button type="button" className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
          Все
        </button>
        <button type="button" className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>
          Активные
        </button>
        <button type="button" className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>
          Выполненные
        </button>
      </div>

      <ul>
        {visible.map((task) => (
          <li key={task.id} className={task.done ? 'done' : ''}>
            <label>
              <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} />
              <span>{task.title}</span>
            </label>
            <button type="button" onClick={() => deleteTask(task.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="empty">Задач нет</p>}
    </main>
  )
}

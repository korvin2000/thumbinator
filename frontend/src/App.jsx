import { useEffect, useState } from 'react'

const API_URL = '/api/greeting'

export default function App() {
  const [name, setName] = useState('...')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
      })
      .then((data) => setName(data.name))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <main className="container">
      <section className="card">
        <h1>Thumbinator</h1>
        <p className="subtitle">Starter React + Spring Boot demo</p>
        {error ? (
          <p className="error">Unable to load greeting: {error}</p>
        ) : (
          <p className="message">Hello: {name}</p>
        )}
      </section>
    </main>
  )
}

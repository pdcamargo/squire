import { Deferred, Head, useForm } from '@inertiajs/react'

import { InferPageProps } from '@adonisjs/inertia/types'
import type DashboardController from '../../../app/controllers/dashboard_controller'

type PageProps = InferPageProps<DashboardController, 'worlds'>

export default function Worlds({ title, worlds }: PageProps) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    description: '',
    system: '',
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    post('/login')
  }

  return (
    <>
      <Head title={title} />

      <Deferred data="worlds" fallback={<div>Loading...</div>}>
        <>
          {worlds?.map((world) => (
            <div key={world.id}>
              <h2>{world.name}</h2>
              <p>{world.description}</p>
              <p>System: {world.system}</p>
              <p>Last Played: {world.lastPlayed}</p>
              <p>Last Updated: {world.lastUpdated}</p>
            </div>
          ))}
        </>
      </Deferred>

      <form onSubmit={submit} className="flex flex-col">
        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} />
        {errors.name && <div>{errors.name}</div>}
        <input
          type="password"
          value={data.description}
          onChange={(e) => setData('description', e.target.value)}
        />
        {errors.description && <div>{errors.description}</div>}
        <input
          type="checkbox"
          value={data.system}
          onChange={(e) => setData('system', e.target.value)}
        />{' '}
        system Me
        <button type="submit" disabled={processing}>
          Login
        </button>
      </form>
    </>
  )
}

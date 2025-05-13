import type DashboardController from '#controllers/dashboard_controller'
import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'

type PageProps = InferPageProps<DashboardController, 'home'>

export default function Home({ manifest }: PageProps) {
  return (
    <>
      <Head title="Homepage" />

      <pre className="text-sm">
        <code className="text-xs">{JSON.stringify(manifest, null, 2)}</code>
      </pre>
    </>
  )
}

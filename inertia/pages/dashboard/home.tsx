import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { Popover } from 'radix-ui'

import type DashboardController from '#controllers/dashboard_controller'

type PageProps = InferPageProps<DashboardController, 'index'>

export default function DashboardHome({ title, users }: PageProps) {
  return (
    <>
      <Head title={title} />

      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Welcome to the Dashboard</h1>
        <p className="mt-4 text-lg">This is the dashboard home page.</p>
        <p className="mt-2 text-sm text-gray-500">
          You can customize this page as per your requirements.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Current time: {new Date().toLocaleTimeString()}
        </p>

        <Popover.Root>
          <Popover.Trigger>More info</Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>
              Some more info…
              <Popover.Arrow />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {users.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">Users List</h2>
            <ul className="mt-4">
              {users.map((user) => (
                <li key={user.id} className="py-2">
                  {user.fullName}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

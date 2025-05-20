import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'

import type DashboardController from '#controllers/dashboard_controller'

import { DashboardFooter } from './components/dashboard-footer'
import { DashboardHeader } from './components/dashboard-header'
import { MainContent } from './components/main-content'
import { SideContent } from './components/side-content'

type PageProps = InferPageProps<DashboardController, 'index'>

export default function DashboardHome({ title, worlds, systems, modules }: PageProps) {
  return (
    <>
      <Head title={title} />

      <div className="grid h-screen overflow-hidden grid-rows-[auto_1fr_auto]">
        <DashboardHeader />
        <main className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
          <div className="lg:col-span-3 h-[inherit] overflow-hidden">
            <MainContent worlds={worlds} systems={systems} modules={modules} />
          </div>
          <div className="lg:col-span-1 h-[inherit] overflow-hidden">
            <SideContent />
          </div>
        </main>
        <DashboardFooter />
      </div>
    </>
  )
}

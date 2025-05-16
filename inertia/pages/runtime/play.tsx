import { useCallback, useMemo } from 'react'

import { InferPageProps } from '@adonisjs/inertia/types'
import { Deferred, Head } from '@inertiajs/react'
import Handlebars from 'handlebars'
import { Globe } from 'lucide-react'

import type RuntimeController from '#controllers/runtime_controller'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

type PageProps = InferPageProps<RuntimeController, 'play'>

export default function Play({ title, description, world, system, views, user }: PageProps) {
  const registerPartials = useCallback(() => {
    if (!views) {
      return
    }

    if (Object.keys(views).length === 0) {
      return
    }

    Object.entries(views).forEach(([name, view]) => {
      Handlebars.registerPartial(name, view)
    })
  }, [views])

  const randomRender = useMemo(() => {
    if (!views) {
      return ''
    }

    registerPartials()

    const randomView = Object.keys(views)[Math.floor(Math.random() * Object.keys(views).length)]

    const template = Handlebars.compile(`
      <div>
        <h2>{{ world }}</h2>
        <h3>{{ system }}</h3>
        {{> ${randomView} world=world system=system }}
      </div>
    `)

    const data = {
      world: world.name,
      system: system.name,
    }
    const rendered = template(data)
    return rendered
  }, [views, registerPartials, world.name, system.name])

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" side="left">
        <SidebarHeader>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>World</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Globe />
                    <span>World Item</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main>
        <Deferred data={['views']} fallback={<div>Loading...</div>}>
          <>
            <Head title={title} />

            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold">{title}</h1>
              <p className="mt-4 text-lg">{description}</p>
              <p className="mt-2 text-sm text-gray-500">
                World: {world.name} ({world.id})
              </p>
              <p className="mt-2 text-sm text-gray-500">
                System: {system.name} ({system.id})
              </p>

              <pre>
                <code>{JSON.stringify(user, null, 2)}</code>
              </pre>

              <>
                {console.log(views)}
                <div dangerouslySetInnerHTML={{ __html: randomRender }} />
              </>
            </div>
          </>
        </Deferred>
      </main>
    </SidebarProvider>
  )
}

import { useState } from 'react'

import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import { Globe } from 'lucide-react'
import { observer } from 'mobx-react-lite'

import type RuntimeController from '#controllers/runtime_controller'

import { Translate } from '@/components/translate'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { SquireSDK } from '@/sdk/squire-sdk'

type PageProps = InferPageProps<RuntimeController, 'play'>

const Play = observer(({ title, views, scripts, scenes }: PageProps) => {
  const [sdk] = useState(() => {
    return new SquireSDK({
      scripts: scripts.map((script) => script.path),
      views,
      scenes,
    })
  })

  // const randomRender = useMemo(() => {
  //   if (!views) {
  //     return ''
  //   }

  //   registerPartials()

  //   const randomView = Object.keys(views)[Math.floor(Math.random() * Object.keys(views).length)]

  //   const template = Handlebars.compile(`
  //     <div>
  //       <h2>{{ world }}</h2>
  //       <h3>{{ system }}</h3>
  //       {{> ${randomView} world=world system=system }}
  //     </div>
  //   `)

  //   const data = {
  //     world: world.name,
  //     system: system.name,
  //   }
  //   const rendered = template(data)
  //   return rendered
  // }, [views, registerPartials, world.name, system.name])

  return (
    <>
      <Head title={title} />

      <SidebarProvider>
        <Sidebar variant="inset" collapsible="icon" side="left">
          <SidebarHeader></SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                <Translate t="play.scenes" />
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {scenes.map((scene) => (
                    <SidebarMenuItem key={scene.id} onClick={() => sdk.setCurrentScene(scene)}>
                      <SidebarMenuButton isActive={sdk.currentScene?.id === scene.id}>
                        <Globe />
                        <span>{scene.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        <SidebarInset className="w-full grid h-screen grid-rows-[auto_1fr]">
          <header className="w-full group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
              {sdk.currentScene && (
                <h1 className="text-base font-medium">{sdk.currentScene.name}</h1>
              )}

              <Translate t="play.hello" data={{ name: 'Patrick' }} />
            </div>
          </header>

          <div className="relative overflow-hidden">
            <div className="from-primary/20 via-background to-background absolute inset-0 z-0 bg-gradient-to-br">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] [background-size:16px_16px] dark:bg-[radial-gradient(#333_1px,transparent_1px)]"></div>
            </div>
            <div className="relative z-10 w-full h-full" data-id="canvas-container"></div>
            <div className="bg-primary/10 absolute top-1/4 -left-20 h-64 w-64 rounded-full blur-3xl"></div>
            <div className="bg-primary/10 absolute -right-20 bottom-1/4 h-64 w-64 rounded-full blur-3xl"></div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
})

export default Play

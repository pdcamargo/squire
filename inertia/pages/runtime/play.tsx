import { useState } from 'react'

import { InferPageProps } from '@adonisjs/inertia/types'
import { Head } from '@inertiajs/react'
import Handlebars from 'handlebars'
import { Globe } from 'lucide-react'
import * as PIXI from 'pixi.js'

import type RuntimeController from '#controllers/runtime_controller'

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

type PageProps = InferPageProps<RuntimeController, 'play'>

function loadScript(script: string) {
  return new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script')
    scriptElement.src = script
    scriptElement.onload = () => resolve(true)
    scriptElement.onerror = () => reject(new Error(`Failed to load script: ${script}`))
    document.body.appendChild(scriptElement)
  })
}

class SquireSDK {
  constructor(private options: { scripts: string[]; views: Record<string, string> }) {
    this.#init()
  }

  #init = async () => {
    if (typeof window === 'undefined') {
      return
    }

    if (this.options.views && Object.keys(this.options.views).length > 0) {
      Object.entries(this.options.views).forEach(([name, view]) => {
        Handlebars.registerPartial(name, view)
      })
    }

    const app = new PIXI.Application()

    const container = document.querySelector<HTMLDivElement>('[data-id="canvas-container"]')!

    await app.init({
      background: '#1d1b22',
      resizeTo: container,
    })

    const resizeObserver = new ResizeObserver(() => {
      app.renderer.resize(container.clientWidth, container.clientHeight)
    })

    resizeObserver.observe(container)

    container.appendChild(app.canvas)

    // Create and add a container to the stage
    const c = new PIXI.Container()

    app.stage.addChild(c)

    // Load the bunny texture
    const texture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png')
    const bunny = new PIXI.Sprite(texture)

    c.x = app.screen.width / 2
    c.y = app.screen.height / 2

    c.addChild(bunny)
    bunny.anchor.set(0.5)

    {
      ;(window as any).Squire = this
    }

    // Initialize the SDK
    await Promise.all(
      this.options.scripts.map((script) => {
        return loadScript(script)
          .then(() => {
            console.log(`Script ${script} loaded`)
          })
          .catch((error) => {
            console.error(error)
          })
      })
    )

    console.log('Squire SDK initialized')
  }
}

export default function Play({ title, views, scripts }: PageProps) {
  useState(() => {
    return new SquireSDK({
      scripts: scripts.map((script) => script.path),
      views,
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
        <SidebarInset className="w-full grid h-screen grid-rows-[auto_1fr]">
          <header className="w-full group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
              <h1 className="text-base font-medium">The Scene Name</h1>
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
}

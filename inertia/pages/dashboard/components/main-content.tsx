'use client'

import { useState } from 'react'

import { InferPageProps } from '@adonisjs/inertia/types'
import { Globe, Box, Puzzle } from 'lucide-react'

import type DashboardController from '#controllers/dashboard_controller'

import { NewSystemDialogTrigger } from '@/components/dialogs/new-system-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ContentGrid } from './content-grid'

type PageProps = InferPageProps<DashboardController, 'index'>

type MainContentProps = Pick<PageProps, 'worlds' | 'systems' | 'modules'>

export function MainContent({ worlds, systems }: MainContentProps) {
  const [activeTab, setActiveTab] = useState('worlds')

  // Sample data for each tab
  const worldsData = [
    ...worlds.map(({ world, system }) => ({
      id: world.id,
      name: world.name,
      description: world.description || '',
      image: null,
      createdAt: world.createdAt,
      tags: [system.name, ...(world.tags ? world.tags : [])],
    })),
  ]

  const systemsData = [
    ...systems.map((system) => ({
      id: system.id,
      name: system.name,
      description: system.description || '',
      createdAt: system.createdAt,
      image: system.cover || null,
      tags: system.tags ? system.tags : [],
    })),
  ]

  const modulesData = [
    {
      id: '1',
      name: 'Dynamic Lighting',
      description: 'Advanced lighting system with shadows, colors, and animations.',
      image: '/placeholder.svg?height=200&width=300',
      createdAt: '2024-01-05',
      tags: ['Utility', 'Graphics', 'Core'],
    },
    {
      id: '2',
      name: 'Combat Tracker',
      description: 'Initiative tracker with turn management and status effects.',
      image: null,
      createdAt: '2024-02-10',
      tags: ['Combat', 'Utility', 'Core'],
    },
    {
      id: '3',
      name: 'Dice Roller Deluxe',
      description: 'Advanced dice rolling with 3D animations, custom dice, and roll history.',
      image: '/placeholder.svg?height=200&width=300',
      createdAt: '2024-03-15',
      tags: ['Dice', 'Animation', 'Community'],
    },
    {
      id: '4',
      name: 'Weather Effects',
      description: 'Dynamic weather system with visual and gameplay effects.',
      image: null,
      createdAt: '2024-04-01',
      tags: ['Environment', 'Graphics', 'Community'],
    },
    {
      id: '5',
      name: 'Character Importer',
      description: 'Import characters from popular character builders and sheets.',
      image: '/placeholder.svg?height=200&width=300',
      createdAt: '2024-04-20',
      tags: ['Utility', 'Character', 'Community'],
    },
  ]

  return (
    <div className="h-full bg-card rounded-md shadow-md overflow-hidden">
      <Tabs value={activeTab} className="w-full h-[inherit]" onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 rounded-none h-[unset]">
          <TabsTrigger value="worlds" className="flex items-center gap-2 py-4">
            <Globe className="h-5 w-5" />
            <span>Worlds</span>
          </TabsTrigger>
          <TabsTrigger value="systems" className="flex items-center gap-2 py-4">
            <Box className="h-5 w-5" />
            <span>Systems</span>
          </TabsTrigger>
          <TabsTrigger value="modules" className="flex items-center gap-2 py-4">
            <Puzzle className="h-5 w-5" />
            <span>Modules</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="worlds" className="p-4 overflow-auto">
          <ContentGrid items={worldsData} />
        </TabsContent>
        <TabsContent value="systems" className="p-4 overflow-auto">
          <NewSystemDialogTrigger />

          <ContentGrid items={systemsData} />
        </TabsContent>
        <TabsContent value="modules" className="p-4 overflow-auto">
          <ContentGrid items={modulesData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

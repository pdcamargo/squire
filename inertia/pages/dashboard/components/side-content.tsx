import { Link } from '@inertiajs/react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function SideContent() {
  // Sample news data
  const newsItems = [
    {
      id: '1',
      title: 'Major Update 2.5 Released',
      content:
        "We're excited to announce the release of version 2.5 with improved performance, new features, and bug fixes.",
      image: '/placeholder.svg?height=150&width=300',
      date: 'May 15, 2024',
    },
    {
      id: '2',
      title: 'Community Spotlight: Amazing Maps',
      content:
        'Check out these incredible maps created by our community members using our new mapping tools.',
      image: '/placeholder.svg?height=150&width=300',
      date: 'May 10, 2024',
    },
    {
      id: '3',
      title: 'Upcoming Feature Preview',
      content:
        'Get a sneak peek at our upcoming audio integration features coming in the next update.',
      image: '/placeholder.svg?height=150&width=300',
      date: 'May 5, 2024',
    },
  ]

  // Sample featured content
  const featuredContent = [
    {
      id: '1',
      title: 'Featured World: Eldoria',
      description:
        'A vast fantasy realm with diverse regions, rich lore, and intricate political systems.',
      image: '/placeholder.svg?height=150&width=300',
    },
    {
      id: '2',
      title: 'Featured Module: Advanced Combat',
      description:
        'Enhance your combat experience with this comprehensive module featuring new actions and conditions.',
      image: '/placeholder.svg?height=150&width=300',
    },
  ]

  return (
    <div className="grid gap-4">
      {/* News Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Latest News</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {newsItems.map((item) => (
            <div key={item.id} className="space-y-2">
              <Link href="#" className="block">
                <div className="h-32 relative rounded-md overflow-hidden mb-2">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.date}</p>
                <p className="text-sm line-clamp-1">{item.content}</p>
              </Link>
              {item.id !== newsItems[newsItems.length - 1].id && <Separator className="mt-3" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Featured Content Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Featured Content</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {featuredContent.map((item) => (
            <div key={item.id} className="space-y-2">
              <Link href="#" className="block">
                <div className="h-32 relative rounded-md overflow-hidden mb-2">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.title}
                    className="w-full object-cover"
                  />
                </div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm">{item.description}</p>
              </Link>
              {item.id !== featuredContent[featuredContent.length - 1].id && (
                <Separator className="mt-3" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

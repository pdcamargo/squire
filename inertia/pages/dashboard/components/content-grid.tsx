import { Calendar, Tag } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

interface ContentItem {
  id: string
  name: string
  description: string
  image: string | null
  createdAt: string
  tags: string[]
}

interface ContentGridProps {
  items: ContentItem[]
}

export function ContentGrid({ items }: ContentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.length === 0 && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center p-4">
          <p className="text-sm text-muted-foreground">No items found.</p>
        </div>
      )}

      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden flex flex-col h-full">
          <CardHeader className="p-4 pb-2">
            <h3 className="text-lg font-bold">{item.name}</h3>
          </CardHeader>
          <CardContent className="p-4 pt-0 pb-2 flex-grow">
            <div className="mb-4 h-40 relative overflow-hidden rounded-md bg-muted">
              {item.image ? (
                <img
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <Tag className="h-16 w-16 text-muted-foreground opacity-20" />
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </CardContent>
          <CardFooter className="p-4 pt-2 flex justify-between items-center">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{new Intl.DateTimeFormat().format(new Date(item.createdAt))}</span>
            </div>
            <div className="flex flex-wrap gap-1 justify-end">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

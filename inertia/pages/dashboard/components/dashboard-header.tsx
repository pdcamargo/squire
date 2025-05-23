import { Link } from '@inertiajs/react'
import { Dice5, Menu, Bell, Settings, User, Search } from 'lucide-react'

import { Translate } from '@/components/translate'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function DashboardHeader() {
  return (
    <header className="shadow-lg border-b border-b-white/5 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Dice5 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">
              <Translate t="dashboard.brand.name" />
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">
              <Translate t="dashboard.search" />
            </span>
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">
              <Translate t="dashboard.notifications" />
            </span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Settings className="h-5 w-5" />
            <span className="sr-only">
              <Translate t="dashboard.settings" />
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">
                  <Translate t="dashboard.user.menu" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <Translate t="dashboard.user.account" />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Translate t="dashboard.user.profile" />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Translate t="dashboard.settings" />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Translate t="dashboard.user.support" />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Translate t="dashboard.user.logout" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">
                  <Translate t="dashboard.menu" />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Search className="mr-2 h-4 w-4" />
                <span>
                  <Translate t="dashboard.search" />
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>
                  <Translate t="dashboard.settings" />
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

import { Link } from '@inertiajs/react'

import { Translate } from '@/components/translate'

export function DashboardFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            <p>
              <Translate t="dashboard.footer.version" /> |{' '}
              <Translate t="dashboard.footer.copyright" />
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Translate t="dashboard.footer.terms" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Translate t="dashboard.footer.privacy" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Translate t="dashboard.footer.contact" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

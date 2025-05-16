import { ComponentType } from 'react'

import { createInertiaApp } from '@inertiajs/react'
import ReactDOMServer from 'react-dom/server'

import Layout from './layout'

export default function render(page: any) {
  return createInertiaApp({
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob('../pages/**/*.tsx', { eager: true })
      const page = pages[`../pages/${name}.tsx`] as ComponentType & {
        default: {
          layout?: (page: any) => React.ReactNode
        }
      }

      page.default.layout = page.default.layout || ((page) => <Layout children={page} />)

      return page
    },
    setup: ({ App, props }) => <App {...props} />,
  })
}

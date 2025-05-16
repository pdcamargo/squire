This project uses Adonis with inertia.js and shadcn/ui. Therefore, there are some custom configuration that was done to make this project work.

- Always respect the paths configured on `inertia\tsconfig.json`.
- This project uses React 19+.
- This project uses npm, so any installation should be done using npm with the argument `--legacy-peer-deps`.
- Dark mode is enabled by default.
- Any generic component should be placed in the `components` folder, the root for this is found in `inertia\lib`, such as
  - `inertia\lib\components\ui\*`
  - `inertia\lib\hooks\*`
  - `inertia\lib\lib\*`

Because this project uses Inertia.js, pages (found on `inertia\pages\*`) can receive page props from the server, and to infer the page props we use the following rules:

```
import { InferPageProps } from '@adonisjs/inertia/types'
import type TheControllerName from '#controllers/my_controller_name'

type PageProps = InferPageProps<TheControllerName, 'methodName'>

export default function Page({ props }: { props: PageProps }) {
  return (
    ...
  )
}
```

Controllers can be found in `app\controllers\*`. Any controller that uses { inertia } from the method context is used to render a page, that matches a file name inside `inertia\pages\*`.

To create a new page route, it needs to be registered in `start\routes.ts` and the controller method should be added to the route. The route should be registered as a GET request, and the controller method should return a page using { inertia } from the method context. If it's an authenticated route, it should be registered as a GET request with the `auth` middleware. The controller method should return a page using { inertia } from the method context.

Example on how to create a new page route:

```ts
router.get('/:dynamic/other-route-part', '#controllers/my_controller.myMethod')

// With auth middleware
router
  .get('/:dynamic/other-route-part', '#controllers/my_controller.myMethod')
  .use(middleware.auth())
```

Component file names should be dash-case.tsx, and the folder structure should be the same as the component name. For example, if you have a component called `MyComponent`, it should be placed in `inertia\lib\components\ui\my-component.tsx`, we don't need a component folder with the same name. They should all be defined in a const and arrow function, and we don't export default. In the end of the file we always have export { TheComponent }, without index file. File names for components should always be on this pattern: `my-component.tsx`, and the folder structure should be the same as the component name (all lowercase separated by dash)

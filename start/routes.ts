/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
router.get('/', '#controllers/dashboard_controller.home')

router.on('/login').renderInertia('login')

// SSR
router.get('/dashboard', '#controllers/dashboard_controller.index')
router.get('/dashboard/worlds', '#controllers/dashboard_controller.worlds')

// REST
router.post('/dashboard/worlds', '#controllers/dashboard_controller.create')

router.get('/assets/:world/*', '#controllers/assets_controller.show')

router.get('/play/:world', '#controllers/runtime_controller.play')

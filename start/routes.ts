/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

import { middleware } from './kernel.js'
router.get('/', '#controllers/dashboard_controller.home')

router.post('/:world/login', '#controllers/auth_controller.login')
router.get('/:world/login', '#controllers/auth_controller.loginPage')

router.get('/:world/play', '#controllers/runtime_controller.play').use(middleware.auth())
router.get('/:world/assets/*', '#controllers/assets_controller.show').use(middleware.auth())
router
  .get('/:world/system/assets/*', '#controllers/assets_controller.showSystem')
  .use(middleware.auth())

// SSR
router.get('/dashboard', '#controllers/dashboard_controller.index')
router.get('/dashboard/worlds', '#controllers/dashboard_controller.worlds')

// REST
router.post('/dashboard/worlds', '#controllers/dashboard_controller.create')

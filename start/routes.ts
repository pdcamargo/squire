/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('home')

// SSR
router.get('/dashboard', '#controllers/dashboard_controller.index')
router.get('/dashboard/worlds', '#controllers/dashboard_controller.worlds')

// REST
router.post('/dashboard/worlds', '#controllers/dashboard_controller.create')

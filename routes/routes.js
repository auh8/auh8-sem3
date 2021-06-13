
import Router from 'koa-router'
import bodyParser from 'koa-body'

import publicRouter from './public.js'
import galleryRouter from'./gallery.js'

const mainRouter = new Router()
mainRouter.use(bodyParser({multipart: true}))

const nestedRoutes = [publicRouter, galleryRouter]
for (const router of nestedRoutes) {
	mainRouter.use(router.routes())
	mainRouter.use(router.allowedMethods())
}

export default mainRouter

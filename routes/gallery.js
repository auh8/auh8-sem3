
import Router from 'koa-router'

const router = new Router({ prefix: '/gallery' })

import Items from '../modules/items.js'
const dbName = 'website.db'

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)

router.get('/', async ctx => {
  const items = await new Items(dbName)
  try {
    const records = await items.all()
    console.log(records)
    ctx.hbs.records = records
    await ctx.render('gallery', ctx.hbs)
  } catch(err) {
	ctx.hbs.error = err.message
    await ctx.render('error', ctx.hbs)
  }
})

export default router

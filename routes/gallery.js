
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

router.get('/add', async ctx => {
  await ctx.render('add', ctx.hbs)
})

router.post('/add', async ctx => {
  const items = await new Items(dbName)
  try{
    ctx.request.body.account = ctx.session.userid
    if(ctx.request.files.photo.name) {
      ctx.request.body.filePath = ctx.request.files.photo.path
      ctx.request.body.fileName = ctx.request.files.photo.name
      ctx.request.body.fileType = ctx.request.files.photo.type
    }
    
    await items.add(ctx.request.body)
    return ctx.redirect('/gallery?msg=new item added')
  } catch(err) {
    console.log(err)
    await ctx.render('error', ctx.hbs)
  } finally {
    items.close()
  }

})

export default router

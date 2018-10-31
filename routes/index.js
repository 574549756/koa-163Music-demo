const router = require('koa-router')()/* 

router.get('/', async (ctx, next) => {
  await ctx.render('index', {})
}) */
router.get('/song')
router.get('/playlist/:id', async (ctx, next) => {
  await next.render('playlist',{})
})

module.exports = router
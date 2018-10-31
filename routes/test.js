const router = require('koa-router')()
router.prefix('/test')
router.get('/test', async (ctx, next) => {
  await ctx.render('index', {})
})

router.get('/song', async (ctx, next) => {
  await ctx.render('song', {})
})

router.get('/playlist', async (ctx, next) => {
  await ctx.render('playlist',{})
})

module.exports = router

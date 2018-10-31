const router = require('koa-router')()

router.get('/playlist', async (ctx, next) => {
  await console.log(ctx)
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
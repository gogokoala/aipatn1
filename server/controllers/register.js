// 用户登录
module.exports = async (ctx, next) => {
    ctx.state.data = ctx.state.$oauth2
}

async function sf1 (ctx, next) {
    ctx.state.data = ctx.state.$cnipr
}

module.exports = {
    sf1
}

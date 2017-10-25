const debug = require('debug')('cnipr-sdk[sf1]')
const http = require('axios')
const config = require('../../config')()
const { ERRORS } = require('../constants')

let search = async function (req) {
    debug('sf1:search() - %o', req.query)
    const {
        exp,
        dbs,
        order,
        option,
        from,
        to,
        displayCols
    } = req.query

    // 检查 querystring
    if ([exp, dbs, order, option, from, to].some(v => !v)) {
        debug(ERRORS.CNIPR.ERR_INVALID_PARAM)
        throw new Error(ERRORS.CNIPR.ERR_INVALID_PARAM)
    }

    const clientId = config.oauth2.clientId
    const url = 'https://open.cnipr.com/cnipr-api/rs/api/search/sf1/' + clientId
    const openId = config.oauth2.openId
    const accessToken = config.oauth2.accessToken

    let res = await http({
        url: url,
        method: 'POST',
        params: {
            exp: exp,
            dbs: dbs,
            order: order,
            option: option,
            from: from,
            to: to,
            displayCols: displayCols,
            openid: openId,
            access_token: accessToken
        }
    })

    res = res.data
    debug('search result = %o', res)
    if (parseInt(res.status) !== 0) {
        debug('Http Request Error: %s %o', ERRORS.CNIPR.ERR_REQUEST_FAIL, res)
        throw new Error(`${ERRORS.CNIPR.ERR_REQUEST_FAIL}\n${JSON.stringify(res)}`)
    } else {
        return res
    }
}

let sf1Middleware = async function (ctx, next) {
    let result = await search(ctx.request)
    ctx.state.$cnipr = result
    await next()
}

module.exports = {
    sf1Middleware
}

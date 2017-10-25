const debug = require('debug')('cnipr-sdk[auth]')
const http = require('axios')
const config = require('../../config')()

const {
    ERRORS
} = require('../constants')

const OAuth2Service = require('../../common/mysql/OAuth2Service')
const moment = require('moment')

/**
 * Step1：获取Authorization Code
 * 
 */
let getAuthorizationCode = async function () {
    const clientId = config.oauth2.clientId
    const redirectUri = encodeURI(config.oauth2.redirectUri)
    const account = config.oauth2.account
    const password = config.oauth2.password
    const state = config.oauth2.csfrState

    let res = await http({
        url: 'https://open.cnipr.com/oauth2/authorize',
        method: 'GET',
        params: {
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            state: state,
            account: account,
            password: password
        }
    })

    res = res.data
    debug('getAuthorizationCode: %O', res)
    if (res.code) {
        debug('%s: %o', ERRORS.OAUTH2.ERR_WHEN_GET_AUTH_CODE, res)
        throw new Error(`${ERRORS.OAUTH2.ERR_WHEN_GET_AUTH_CODE}\n${JSON.stringify(res)}`)
    } else {
        return {
            res
        }
    }
}

/**
 * OAuth 2.0 回调处理
 * @param {koa request} req
 * @return {Promise}
 * @example 基于 Express
 * authorizationCallback(this.req).then(accessToken => { // ...some code })
 */
let authorizationCallback = async function (req) {
    const {
        'code': authCode,
        'openid': openId,
        'openkey': openKey
    } = req.query

    // 检查 querystring
    if ([authCode, openId, openKey].some(v => !v)) {
        debug(ERRORS.OAUTH2.ERR_IN_CALLBACK)
        throw new Error(ERRORS.OAUTH2.ERR_IN_CALLBACK)
    }

    debug('code: %s, openId: %s, openKey: %s', authCode, openId, openKey)
    config.set({
        authorizationCode: authCode,
        openId: openId,
        openKey: openKey
    })

    let res = await getAccessTokenByAuthorizationCode(authCode)

    const {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: expiresIn
    } = res
    config.set({
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresIn: expiresIn
    })
    debug('access_token: %s, refresh_token: %s, expires_in: %s', accessToken, refreshToken, expiresIn)

    await OAuth2Service.saveOAuth2Info(accessToken, refreshToken, expiresIn, {
        openId,
        openKey
    })

    return {
        openId,
        openKey,
        accessToken,
        refreshToken,
        expiresIn
    }
}

/**
 * Step2：通过Authorization Code获取Access Token
 * @param {string} code AuthorizationCode
 * @return {Promise}
 */
let getAccessTokenByAuthorizationCode = async function (code) {
    const clientId = config.oauth2.clientId
    const clientSecret = config.oauth2.clientSecret
    const redirectUri = encodeURI(config.oauth2.redirectUri)
    const state = config.oauth2.csfrState

    let res = await http({
        url: 'https://open.cnipr.com/oauth2/access_token',
        method: 'GET',
        params: {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
            code: code,
            state: state
        }
    })

    res = res.data
    debug('getAccessTokenByAuthorizationCode: %o', res)
    if (res.status) {
        debug('%s: %o', ERRORS.OAUTH2.ERR_WHEN_GET_ACCESS_TOKEN, res)
        throw new Error(`${ERRORS.OAUTH2.ERR_WHEN_GET_ACCESS_TOKEN}\n${JSON.stringify(res)}`)
    } else {
        return res
    }
}

/**
 * 使用Refresh Token 刷新 Access Token
 * 
 */
let refreshAccessToken = async function () {
    const clientId = config.oauth2.clientId
    const clientSecret = config.oauth2.clientSecret
    const redirectUri = encodeURI(config.oauth2.redirectUri)
    const refreshToken = config.oauth2.refreshToken
    const state = config.oauth2.csfrState

    let res = await http({
        url: 'https://open.cnipr.com/oauth2/access_token',
        method: 'GET',
        params: {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            state: state
        }
    })

    res = res.data
    debug('refreshAccessToken: %o', res)
    if (res.status) {
        debug('%s: %o', ERRORS.OAUTH2.ERR_WHEN_GET_ACCESS_TOKEN, res)
        throw new Error(`${ERRORS.OAUTH2.ERR_WHEN_GET_ACCESS_TOKEN}\n${JSON.stringify(res)}`)
    } else {
        return res
    }
}

/**
 * 初始化OAuth2.0,载入并校验AccessToken
 * 
 * @return {int} 0
 */
let initialize = async function () {
    let result = await OAuth2Service.getOAuth2InfoById(config.oauth2.clientId)
    if (result.length) {
        result = result[0]

        // 校验AccessToken是否过期
        const {
            access_token: accessToken,
            expires_in: expiresIn,
            last_visit_time: lastVisitTime
        } = result
        //  access_token的过期时长，单位ms,缺省24小时 
        const expires = expiresIn && !isNaN(parseInt(expiresIn)) ? parseInt(expiresIn) * 1000 : 86400 * 1000

        if (moment(lastVisitTime, 'YYYY-MM-DD HH:mm:ss').valueOf() + expires < Date.now()) {
            debug('OAuth2.0 init: access_token expired.')
        } else {
            debug('OAuth2.0 init: access_token is ready.')
            config.set({
                oauth2: {
                    accessToken: accessToken,
                    expiresIn: expiresIn,
                    lastVisitTime: lastVisitTime
                }
            })
            return 0
        }
    }

    // AccessToken过期或不存在
    result = await refreshAccessToken()

    const {
        access_token: accessToken,
        expires_in: expiresIn
    } = result
    const lastVisitTime = moment().format('YYYY-MM-DD HH:mm:ss')
    result = await OAuth2Service.saveOAuth2Info(accessToken, expiresIn, ({}))
    config.set({
        oauth2: {
            accessToken: accessToken,
            expiresIn: expiresIn,
            lastVisitTime: lastVisitTime
        }
    })

    return 0
}

/**
 * 校验AccessToken
 * 
 * @return {Object} {accessToken: accessToken}
 */
let checkAccessToken = async function () {
    const {
        access_token: accessToken,
        expires_in: expiresIn,
        lastVisitTime
    } = config.oauth2

    // 校验AccessToken是否过期
    //  access_token的过期时长，单位ms,缺省24小时 
    const expires = expiresIn && !isNaN(parseInt(expiresIn)) ? parseInt(expiresIn) * 1000 : 86400 * 1000

    if (moment(lastVisitTime, 'YYYY-MM-DD HH:mm:ss').valueOf() + expires < Date.now()) {
        debug('OAuth2.0 init: access_token expired.')
        // AccessToken过期或不存在
        let result = await refreshAccessToken()

        const {
            access_token: accessToken,
            expires_in: expiresIn
        } = result
        const lastVisitTime = moment().format('YYYY-MM-DD HH:mm:ss')
        result = await OAuth2Service.saveOAuth2Info(accessToken, expiresIn, ({}))

        config.set({
            oauth2: {
                accessToken: accessToken,
                expiresIn: expiresIn,
                lastVisitTime: lastVisitTime
            }
        })
        return ({
            accessToken: accessToken
        })
    } else {
        debug('OAuth2.0 init: access_token is ready.')
    }

    return ({
        accessToken: accessToken
    })
}

/**
 * Middleware
 */

/**
 * 
 */
let getAuthorizationCodeMiddleware = async function (ctx, next) {
    let result = await getAuthorizationCode(ctx.request)
    ctx.state.$oauth2 = result
    await next()
}

/**
 * Koa OAuth2.0 Callback 中间件
 * 基于 authorizationCallback 重新封装
 * @param {koa context} ctx koa 请求上下文
 * @return {Promise}
 */
let authorizationCallbackMiddleware = async function (ctx, next) {
    let result = await authorizationCallback(ctx.request)
    ctx.state.$oauth2 = result
    await next()
}

module.exports = {
    initialize,
    checkAccessToken,
    authorizationCallback,
    authorizationCallbackMiddleware,
    getAuthorizationCode,
    getAuthorizationCodeMiddleware,
    getAccessTokenByAuthorizationCode,
    refreshAccessToken
}

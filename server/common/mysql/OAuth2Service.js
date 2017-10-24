const debug = require('debug')('cnipr-sdk[AuthDbService]')
const mysql = require('./index')
const { ERRORS } = require('../constants')

const config = require('../../config')
const moment = require('moment')
// const uuidGenerator = require('uuid/v4')

/**
 * 保存OAuth2.0信息
 * 
 */
let saveOAuth2Info = async function (accessToken, expiresIn, userInfo) {
    const clientId = config.oauth2.clientId
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
    const userInfoString = JSON.stringify(userInfo)

    // 查重并决定是插入还是更新数据
    try {
        let res = await mysql('cOAuth2Info').count('client_id as rowCount').where({
            client_id: clientId
        })
        // 如果存在用户则更新
        if (res[0].rowCount) {
            await mysql('cOAuth2Info').update({
                access_token: accessToken,
                expires_in: expiresIn,
                last_visit_time: currentTime,
                user_info: userInfoString
            }).where({
                client_id: clientId
            })
        } else {
            await mysql('cOAuth2Info').insert({
                client_id: clientId,
                access_token: accessToken,
                expires_in: expiresIn,
                create_time: currentTime,
                last_visit_time: currentTime,
                user_info: userInfoString
            })
        }

        return 0
    } catch (e) {
        debug('%s: %O', ERRORS.DB.ERR_INVALID_FUNC_PARAM, e)
        throw new Error(`${ERRORS.DB.ERR_INVALID_FUNC_PARAM}\n${e}`)
    }
}

/**
 * 通过 client_id 获取OAuth2.0认证信息
 * @param {string} clientId Cnipr Client ID
 */
let getOAuth2InfoById = async function (clientId) {
    if (!clientId) throw new Error(ERRORS.DB.ERR_INVALID_FUNC_PARAM)

    let res = await mysql('cOAuth2Info').select('*').where({ client_id: clientId })
    debug('getOAuth2InfoById result: %o', res)

    return res
}

module.exports = {
    saveOAuth2Info,
    getOAuth2InfoById
}

const config = require('../config')()
const debug = require('debug')('cnipr-sdk[init]')

const { ERRORS } = require('./constants')

/**
 * 初始化 cnipr sdk

 * SDK 所有支持的配置项
 * @param {object} [必须] configs                    配置信息

 * @param {object} [必须] configs.rootPathname       程序运行对应的根路径

 * @param {string} [必须] configs.clientId           Cnipr Client ID
 * @param {string} [必须] configs.clientSecret       Cnipr Client Secret
 * @param {string} [必须] configs.redirectUri        Cnipr Redirect URI
 * @param {string} [必须] configs.refreshToken       Cnipr开发者帐号
 * @param {string} [必须] configs.openId             Cnipr开发者密码
 * @param {string} [必须] configs.openKey            Cnipr开发者密码
 * 
 * @param {object} [必须] configs.mysql              MySQL 配置信息
 * @param {string} [必须] configs.mysql.host         MySQL 主机名
 * @param {string} [可选] configs.mysql.port         MySQL 端口（默认3306）
 * @param {string} [必须] configs.mysql.user         MySQL 用户名
 * @param {string} [必须] configs.mysql.db           MySQL 数据库
 * @param {string} [必须] configs.mysql.pass         MySQL 密码
 * @param {string} [可选] configs.mysql.char         MySQL 编码

 */
module.exports = function init (options) {
    // 检查配置项
    if (options.oauth2) {
        const { clientId, clientSecret, redirectUri, refreshToken, openId, openKey } = options.oauth2
        if ([clientId, clientSecret, redirectUri, refreshToken, openId, openKey].some(v => v === undefined)) throw new Error(ERRORS.ERR_INIT_SDK_LOST_CONFIG)
    }

    return {
        auth: require('./auth'),
        api: require('./api')
    }
}

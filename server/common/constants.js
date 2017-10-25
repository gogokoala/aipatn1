module.exports = {
    ERRORS: {
        // 初始化错误
        ERR_WHEN_INIT_SDK: 'ERR_WHEN_INIT_SDK',
        ERR_INIT_SDK_LOST_CONFIG: 'ERR_INIT_SDK_LOST_CONFIG',
        ERR_WHEN_INIT_MYSQL: 'ERR_WHEN_INIT_MYSQL',

        // OAUTH2.0
        OAUTH2: {
            ERR_WHEN_GET_AUTH_CODE: 'ERR_WHEN_GET_AUTH_CODE',
            ERR_WHEN_GET_ACCESS_TOKEN: 'ERR_WHEN_GET_ACCESS_TOKEN',
            ERR_IN_CALLBACK: 'ERR_IN_CALLBACK'
        },

        // 数据库错误
        DB: {
            ERR_INVALID_FUNC_PARAM: 'ERR_INVALID_FUNC_PARAM',
            ERR_INSERT_FAILED: 'ERR_INSERT_FAILED'
        },

        CNIPR: {
            ERR_INVALID_PARAM: 'ERR_CNIPR_INVALID_PARAM',
            ERR_REQUEST_FAIL: 'ERR_CNIPR_REQUEST_FAIL'
        }
    }
}

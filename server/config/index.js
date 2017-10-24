const configs = require('./config.json')
const debug = require('debug')('settings')

const settings = {}

settings.set = function (properties) {
    return setProperties(settings, properties)
}

// 将给定的 properties 写入 target
function setProperties (target, properties) {
    Object.keys(properties).forEach(v => {
        const val = properties[v]
        // 如果是对象，则深拷贝
        // 此处不考虑值为 Array 的情况
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            if (!target[v]) target[v] = {}
            setProperties(target[v], val)
        } else {
            target[v] = val
        }
    })

    return target
}

module.exports = () => {
    if (!settings.isActive) {
        debug('initiate settings')
        settings.set(Object.assign({}, configs, { isActive: 1 }))
    }

    return settings
}

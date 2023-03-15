const settingController = require('../DL/setting.controller')

async function getSetting(filter) {
    const res = await settingController.read(filter)
    return res
}

module.exports = { getSetting }

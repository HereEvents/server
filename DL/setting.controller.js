const {errMessage} = require("../errController");
const settingsData = require("./setting.model");

async function create (data) {
    return await settingsData.create(data);
}

async function read (filter) {
    return await settingsData.find(filter);
}

async function readOne (filter) {
    const res = await settingsData.findOne(filter);
    if (!res) throw errMessage.SETTING_NOT_FOUND;
    return res;
}

async function update (id, newData) {
    return await settingsData.updateOne({_id: id}, newData);
}

async function updateAndReturn (id, newData) {
    let data = await settingsData.findOneAndUpdate({_id:id}, newData);
    if (!data) throw errMessage.SETTING_NOT_FOUND;
    return data;
}

async function updateAndReturnByAnyFilter (filter, newData) {
    let data = await settingsData.findOneAndUpdate (filter, newData);
    if (!data) throw errMessage.SETTING_NOT_FOUND;
    return data;
}

async function del (id) {
    return await update (id, {status:"deleted"});
}

module.exports = {create, read, readOne, update, updateAndReturn, updateAndReturnByAnyFilter, del};
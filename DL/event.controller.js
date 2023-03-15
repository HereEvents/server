const { errMessage } = require("../errController");
const eventsData = require("./event.model");

async function create(data) {
  return await eventsData.create(data);
}

async function read(filter) {
  return await eventsData.find(filter).populate('setting.settingData');
}

async function readOne(filter) {
  const res = await eventsData.findOne(filter).populate('setting.settingData');
  if (!res) throw errMessage.EVENT_NOT_FOUND;
  return res;
}

async function update(id, newData) {
  return await eventsData.updateOne({ _id: id }, newData);
}

async function updateAndReturn(id, newData) {
  let data = await eventsData.findOneAndUpdate({ _id: id }, newData, {
    new: true,
  });
  if (!data) throw errMessage.EVENT_NOT_FOUND;
  return data;
}

async function updateAndReturnByAnyFilter(filter, newData) {
  let data = await eventsData.findOneAndUpdate(filter, newData, { new: true });
  if (!data) throw errMessage.EVENT_NOT_FOUND;
  return data;
}
async function del(id) {
  return await update(id, { status: "deleted" });
}

module.exports = {
  create,
  read,
  readOne,
  update,
  updateAndReturn,
  updateAndReturnByAnyFilter,
  del,
};

const userData = require("./user.model");
const { errMessage } = require("../errController");
const bcrypt = require('bcrypt')


async function create(data) {
  return await userData.create(data);
}


async function find(user) {
  const { email } = user;
  try {
    const foundUser = await userData.findOne({ email });
    return foundUser;
  } catch (error) {
    return { error: 'לא הצליח למצוא משתמש' };
  }
}

async function update(email, newData) {
  return await userData.findOneAndUpdate({ email: email}, newData, { returnDocument: 'after' })
}


async function findEmail(email) {
  try {
    const foundUser = await userData.findOne({email});
    if (foundUser) {
      return foundUser
    } else {
      return
    }
  } catch (error) {
    throw new Error('Error finding Email');
  }
}

async function read(filter, proj){
  return await userData.find({filter}, proj);
}

async function readOne (filter, proj){
  let res= await userData.findOne(filter, proj);
  return res

}

// async function update(filter, newData){
//   return await userData.updateOne(filter, newData)

// }


module.exports = {
    create,
    find,
    update,
    findEmail,
    readOne
}
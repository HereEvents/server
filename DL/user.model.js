const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("./event.model")

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  city: {
    type: String,
  },
  phon: {
    type: String,
  },
  approval: {
    type: Boolean
  },
  userType: {
    type: String,
    enum: ['admin', 'regular'],
    default: 'regular'
  },
  // favourites:
  //   [{
  //     id: {
  //       type: mongoose.Schema.Types.ObjectId,
  //     ref: "events"}
  //       ,
  //     isFavourite: {
  //       type: Boolean,
  //     default: true}
  // }]
})

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

const users = mongoose.model("user", userSchema);

module.exports = users;
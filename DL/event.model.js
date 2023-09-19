const { trusted } = require("mongoose");
const mongoose = require("mongoose");
require("./setting.model");

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    // require: true,
  },
  summary: {
    type: String,
  },
  advertiser: {
    name: {
      type: String,
      // require: true,
    },
    tel: {
      type: String,
      // require: true,
    },
    email: {
      type: String,
      // require: true,
    },
  },
  isReapeated: { type: Boolean, default: false },
  repeatType: {
    type: String,
  },
  repeatTimes: { type: Number },
  date: [
    {
      type: Date,
    },
  ],
  deletedDate: [{ type: Date }],
  days: [],
  personalRepeat: { type: String },
  repeatSettingsPersonal: {
    type: { type: String },
    dateEnd: { type: Object },
    timesEnd: { type: Number },
  },

  beginningTime: {
    type: String,
  },
  finishTime: {
    type: String,
  },
  place: {
    type: String,
    // require: true,
  },
  accuratelocation: {
    type: String,
    // require: true,
  },
  categories: [
    {
      type: String,
      //require: true,
    },
  ],
  audiences: [
    {
      type: String,
      //require: true,
    },
  ],
  registrationPageURL: {
    type: String,
    // require: false,
  },
  cardImageURL: {
    type: String,
    // require: true,
  },
  coverImageURL: {
    type: String,
    // require: true,
  },
  payment: {
    isFree: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
    },
  },
  // gallery: [
  //   {
  //     imageURL: {
  //       type: Array,
  //       require: false,
  //     },
  //   },
  // ],
  status: {
    type: String,
    enum: ["published", "waiting-for-approval", "invalid", "deleted"],
    default: "waiting-for-approval",
  },  
  tag: {
    type: String,
    enum: ["event", "food", "attraction","noTag"],
    default: "noTag",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
    default: null,
  },
});

const events = mongoose.model("event", eventSchema);

module.exports = events;

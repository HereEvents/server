const { sendMail } = require("./BL/emailInterface");

const err = (c, m) => {
  return { code: c, message: m };
};

const errMessage = Object.freeze({
  MISSING_DATA: err(400, "missing data"),
  USER_NOT_FOUND: err(400, "user not found"),
  FORBIDDEN: err(403, "forbidden"),
  USER_NOT_AQCTIVE: err(400, "user not active"),
  USER_ALREADY_REGISTERED: err(400, "user already registered"),
  USER_NOT_REGISTERED: err(400, "user not registered"),
  SUCCESS: err(200, "success"),
  UNAUTHORIZED: err(401, "you need to login first"),
  WORNG_PASSWORD: err(400, "password is not correct"),
  PASSWORDS_ARE_NOT_EQUAL: err(400, "passwords are not equal"),
  TOKEN_DID_NOT_CREATED: err(999, "token didn't created"),
  EVENT_NOT_FOUND: err(400, "event not found"),
  SETTING_NOT_FOUND: err(400, "setting not found"),
  CAN_NOT_GET_URL: err(999, "can't get url"),
  CAN_NOT_CREATE_FOLDER: err(999, "can't create folder"),
  CAN_NOT_CHANGE_FILE_NAME: err(999, "can't change file name"),
  IMG_CAN_NOT_BE_PROCESSED: err(999, "can't process image"),
});

const sendError = (res, err, userMail = "") => {
  console.log(err);
  if (err.code !== 400 && err.code !== 401)
    sendMail(
      process.env.EROREMAIL,
      "error in server",
      `ERROR: ${err?.message || "try again later"} 
      user: ${userMail}`
    );
  res.status(err.code || 500).send(err.message || "try again later");
};
module.exports = {
  errMessage,
  sendError,
};

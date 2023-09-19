const express = require("express");
const mainRouter = express.Router();
const userRouter = require("./user.route");
const filesRouter = require("./files.route");
const linkRouter = require("./linkCheck.route");
const eventRouter = require("./event.route");
const settingRouter = require("./setting.route");

mainRouter.use("/user", userRouter);
mainRouter.use("/event", eventRouter);
mainRouter.use("/setting", settingRouter);
mainRouter.use("/files", filesRouter);
mainRouter.use("/linkcheck", linkRouter);

module.exports = mainRouter;

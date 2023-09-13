const express = require("express");
const userRouter = express.Router();
const userServices = require("../BL/user.services");
const userController = require("../DL/user.controller");
const { sendError, errMessage } = require("../errController");
const { sign } = require("jsonwebtoken");

userRouter.post("/creatUser", async (req, res) => {
  try {
    const user = await userServices.createUser(req.body);
    res.status(200).send(user);
  } catch (err) {
    return sendError(res, err);
  }
});

userRouter.put("/updateDetails",userServices.checkToken,async(req,res) =>{
try {
  const user = await userServices.updateDetails(req.body,req.user)
  res.status(200).send(user)
} catch (error) {
   sendError(res, error);

}
})

// userRouter.delete('', async (req, res) => {

// });

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userServices.findUser({ email, password });
    res.status(200).send(user);
  } catch (err) {
    sendError(res, err);
  }
});
userRouter.get("/google-login", async (req, res) => {
  try {
    const code = req.query.code;
    var userToReturn = {}
    const { id_token, access_token } = await userServices.getGoogleOAuthTokens({
      code,
    });
    const googleUser = await userServices.getGoogleUser({
      id_token,
      access_token,
    });
    if (!googleUser.res.verified_email) throw errMessage.FORBIDDEN;
    if (!await userController.readOne({ email: googleUser.res.email })) {
      userToReturn = await userController.create({
        email: googleUser.res.email,
        password: Date.now(),
        fullName: googleUser.res.name,
      })
    } else {
       userToReturn = await userController.readOne({ email: googleUser.res.email });
    }
    const token = sign(
      { email: userToReturn.email, userType: userToReturn.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1440h" }
    );
    res.redirect(
      req.query.scope.includes("https://www.googleapis.com/auth/user.phonenumbers.read")?
      `${process.env.GOOGLE_OAUTH_REDIRECT_URL_FINAL}?token=${token}`:
      `https://server-vike.vercel.app/googleRegister?token=${token}`
    );
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.post("/forgetPassword", async (req, res) => {
  try {
    const { email, code } = req.body;
    await userServices.forgetPassword(email, code);
    res.status(200).send("succses");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

userRouter.post("/resetPassword", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const passHaschanged = await userServices.changePassword(
      email,
      newPassword
    );
    if (passHaschanged) {
      res.status(200).send("password change");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

userRouter.post("/verify", async (req, res) => {
  try {
    const token = req.body.aoutherizetion;
    const verifyUser = await userServices.verifyToken(token);
    if (verifyUser) {
      res.status(200).send(verifyUser);
    } else {
      return res.status(401).send({ error: "Token not valid" });
    }
  } catch (err) {
    sendError(res, err);
  }
});

userRouter.post("/checkUserType", async (req, res) => {
  try {
    const token = req.body.aoutherizetion;
    const verifyUser = await userServices.checkUserType(token);
    if (verifyUser) {
      res.status(200).send(verifyUser);
    } else {
      return res.status(401).send({ error: "Token not valid" });
    }
  } catch (err) {
    sendError(res, err);
  }
});

// userRouter.put("/addFavou", async(req,res)=>{
//   try{
//     console.log(req.body);
//     await userServices.addFavourite(req.body.idEvent, req.body.idUser)
//     res.send ("success")
//   }
//   catch(err){
// console.log(err)
//   }
// })

// userRouter.put("/removeFavou", async(req,res)=>{
//   try{
//     console.log(req.body);
//     await userServices.removeFavourite(req.body.idEvent, req.body.idUser)
//     res.send ("success")
//   }
//   catch(err){
// console.log(err)
//   }
// })

module.exports = userRouter;

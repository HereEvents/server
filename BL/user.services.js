const userController = require("../DL/user.controller");
const bcrypt = require('bcrypt')
const eventService = require("../BL/event.services");
const mailInterface = require('./emailInterface')


const jwt = require('jsonwebtoken');
const { default: axios } = require("axios");

async function createUser(newUserData) {
      const user = await userController.findEmail(newUserData.email);
      let newUser ={}
      if (!user) {
        newUser = await userController.create(newUserData);
      }
      else {
        newUser ={ error: `האימייל ${user.email} נמצא כבר בשימוש`, email: user.email, userType:user.userType };
      }

  if (newUser) {
    try {
      const token = jwt.sign(
        { email: newUser.email, userType: newUser.userType },
        process.env.JWT_SECRET,
        { expiresIn: '1440h' });
      return { user: newUser, token };

    } catch (error) {
      console.error('Error generating Token:', error);
      return { error: 'Error generating JWT token' };
    }
  } else {
    return {email: newUserData.email}
  }
}

async function updateDetails(userForm, userToken) {
    const filteredData = {};
    for (const [key, value] of Object.entries(userForm)) {
      if (value !== '' && value!==undefined) {
        filteredData[key] = value;
      }
    }
    return user = await userController.update(userToken.email, filteredData);
}


async function findUser(user) {
  const foundUser = await userController.find(user);
  if (foundUser) {
    try {
      const isPasswordMatch = await bcrypt.compare(user.password, foundUser.password);
      if (isPasswordMatch) {
        const token = jwt.sign(
          { email: user.email, userType: foundUser.userType },
          process.env.JWT_SECRET,
          { expiresIn: '1440h' });
        return { user: foundUser, token };
      } else {
        return ('סיסמא שגויה');
      }
    } catch (err) {
      console.error('Error generating Token:', err);
      return { error: 'Error generating JWT token' };
    }
  } else {
    return ('לא הצליח למצוא משתמש');
  }
}


async function forgetPassword(email, code) {
  const subject = 'Forget Password'
  const html = `
    <div dir="RTL" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1>איפוס סיסמא</h1>
      <p>Dear ${email},</p>
      <p>קיבלנו את בקשתך לאפס את הסיסמה לחשבון שלך..</p>
      <h2>קוד איפוס הסיסמה שלך הוא:${code}</h2>
      <p>לאפס את הקוד אנא הזן קוד זה בטופס איפוס הסיסמה כדי להגדיר סיסמה חדשה.</p>
      <p>אם לא ביקשת איפוס סיסמה, אנא התעלם מאימייל זה.</p>
      <p>,תודה</p>
      <p> KorePo </p>
    </div>`
  await mailInterface.sendMail(email, subject, html)

}

async function updateUser(data) {
  const { email, newData } = data;
  return await userController.update(email, newData);
}

async function changePassword(email, newPassword) {
  try {
    const pass = bcrypt.hashSync(newPassword, 10)
    const changed = updateUser({ email: email, newData: { password: pass } })
    if (changed) {
      return pass;
    }
  } catch (error) {
    throw { message: error.message }
  }
}

async function checkToken(req,res,next){
  try {
    
    let token = req.headers.authorization.replace('Bearer ', '')
    let result = await verifyToken(token)
    req.user = result
  } catch (error) {
   console.log("waring, line 100 in user.service.js: don't send authorization in header");
  }
  next()
}


async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      const email = decoded.email;
      const verifyedUser = await userController.findEmail(email);
      return verifyedUser;
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('token not valid', err.name);
      return { error: 'token is expired' }
    } else {
      return err;
    }
  }
}


async function checkUserType(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      const email = decoded.email;
      const verifyedUser = await userController.findEmail(email);
      if (verifyedUser.userType === 'admin') {
        return verifyedUser
      };
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('token not valid', err.name);
      return { error: 'token is expired' }
    } else {
      return err;
    }
  }
}

 async function getGoogleOAuthTokens({
  code,
}){
  try {
  const url = "https://oauth2.googleapis.com/token";
  
  const values = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
    grant_type: "authorization_code",
  };

    const res = await axios.post(
      url,
      values,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return res.data;
  } catch (error) {
    console.error(error.response.data.error);
    console.log(error, "Failed to fetch Google Oauth Tokens");
    throw new Error(error.message);
  }
}

async function getGoogleUser({
  id_token,
  access_token,
}){
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    // const user = await axios.get(
    //   `https://people.googleapis.com/v1/people/me?personFields=addresses,phoneNumbers`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${access_token}`,
    //     },
    //   }
    // )
    // console.log(user.data);
    return {res:res.data};
  } catch (error) {
    console.log(error, "Error fetching Google user");
    throw new Error(error.message);
  }
}


// async function addFavourite(idEvent, idUser){
// const allFavourites= await userController.readOne({_id:idUser}, "favourites -_id")
// console.log("check", allFavourites)
// const ifFav= (allFavourites.favourites).filter((f)=>f._id==idEvent );
// console.log("isFav", ifFav)
// if(ifFav.length==0){
//   console.log("inside")
//  await userController.update({_id:idUser}, {$push: {favourites:{idEvent}}});
// }
// else{
// await userController.update({_id:idUser},{"favourites.id":idEvent},{
//   $set:{ 
//     "favourites.$.isFavourite":true
//   }
// })}
// const updateUser= await userController.readOne({_id:idUser});
// console.log(updateUser);
// return updateUser;
// }

// async function removeFavourite(idEvent, idUser){
//   await userController.update({_id:idUser},{"favourites[_id]":idEvent},{
//     $set:{
//       "favourites.$.isFavourite":false
//     }
//   })
//   console.log(userController.read())

// }


module.exports = {
  createUser,
  findUser,
  forgetPassword,
  changePassword,
  verifyToken,
  checkUserType,
  checkToken,
  getGoogleOAuthTokens,
  getGoogleUser,
  updateDetails
  // addFavourite,
  // removeFavourite
}
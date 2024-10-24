const jwt = require("jsonwebtoken");
const UserModel = require("../moduls/user");

const checkAuth = async (req, res, next) => {
  // console.log('hello auth')
  const { token } = req.cookies;
  // console.log(token)
  if (!token) {
    req.flash("error", "Unauthorised user please login");
    res.redirect("/");
  } else {
    const varifyToken = jwt.verify(token, "singh12345678sanni54321sengar67890");
    // console.log(varifyToken)
    const data = await UserModel.findOne({ _id: varifyToken.ID });
    // console.log(data)
    req.userData = data;
    next(); // next method route pr pahucha dega
  }
};

module.exports = checkAuth;

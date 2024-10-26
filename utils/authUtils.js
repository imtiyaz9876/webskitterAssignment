const passport = require("passport");

//passport middlewar
const user_auth = passport.authenticate("jwt", { session: false });

const serializeUser = (user, req) => {
  const imageUrl = user.image
    ? `${req.protocol}://${req.get("host")}/public/userImages/${user.image}`
    : null;

  return {
    _id: user._id,
    role: user.role,
    email: user.email,
    name: user.name,
    mobile: user.mobile,
    gender: user.gender,
    image: imageUrl, // Include the image URL here
  };
};

/**
 * @DESC Check Role Middleware
 */

const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json({
      success: false,
      message: `you are not allowed to access this page`,
    })
    : next();

module.exports = {
  user_auth,
  serializeUser,
  checkRole,
};

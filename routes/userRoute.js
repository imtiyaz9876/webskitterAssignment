const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const user_route = express();
const passport = require("passport");
const session = require('express-session');
const {
  
  register_user,
  
  login_user,
  
 
  update_profile,
  update_password
 

  
} = require("../controllers/auth/userController");
const auth = require("../middleware/auth");
// require("../middleware/aut")
const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");
user_route.use(bodyParser.urlencoded({ extended: true }));
user_route.use(bodyParser.json());
user_route.use(express.static("public"));
user_route.use(session({
  secret: 'my-secret-key',
  resave: true,
  saveUninitialized: true
}));
user_route.use(passport.initialize())
user_route.use(passport.session());
const path = require("path");

user_route.use(express.static("public"));
// require('../middleware/passport')(passport);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(__dirname, "../public/userImages"),
      function (error, sucess) {
        if (error) throw error;
      }
    );
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "_" + file.originalname;
    cb(null, name, function (error1, sucess1) {
      if (error1) throw error1;
    });
  },
});

const upload = multer({ storage: storage });

// register user
user_route.post("/register", upload.single("image"), (req, res) =>
  register_user(req, "user", res)
);

//login user
user_route.post("/login", (req, res) => login_user(req, "user", res));

//profile route
user_route.get("/profile", user_auth, (req, res) => {
  const serializedUser = serializeUser(req.user, req);
  res.status(200).json(serializedUser);
});

//update-profile-user
user_route.post(
  "/update-profile-user",
  upload.single("image"),
  user_auth,
  (req, res) => update_profile(req, "user", res)
);
// updatePassword 
user_route.post("/update-password", user_auth, (req, res) =>
  update_password(req, res)
);
module.exports = user_route;

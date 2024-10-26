const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const catagory_route = express();
const passport = require("passport");
const session = require('express-session');
const {
  
    createCategory,
    getAllCategory

  
} = require("../controllers/catagory/catagoryController");
// const auth = require("../middleware/auth");

// require("../middleware/aut")

const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");

catagory_route.use(bodyParser.urlencoded({ extended: true }));
catagory_route.use(bodyParser.json());
catagory_route.use(express.static("public"));

catagory_route.use(session({
  secret: 'my-secret-key',
  resave: true,
  saveUninitialized: true
}));
catagory_route.use(passport.initialize())
catagory_route.use(passport.session());

const path = require("path");

catagory_route.use(express.static("public"));
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
catagory_route.post("/catagory",  (req, res) =>
    createCategory(req, res)
);
catagory_route.get("/getAllCategory",  (req, res) =>
    getAllCategory(req, res)
);


module.exports = catagory_route;

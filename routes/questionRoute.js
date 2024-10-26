const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const question_route = express();
const passport = require("passport");
const session = require('express-session');
const {

    createQuestion,
    questionCategoryWise,
    addQuestionInBulk



} = require("../controllers/question/questionController");
// const auth = require("../middleware/auth");

// require("../middleware/aut")

const { user_auth, serializeUser, checkRole } = require("../utils/authUtils");

question_route.use(bodyParser.urlencoded({ extended: true }));
question_route.use(bodyParser.json());
question_route.use(express.static("public"));

question_route.use(session({
    secret: 'my-secret-key',
    resave: true,
    saveUninitialized: true
}));
question_route.use(passport.initialize())
question_route.use(passport.session());

const path = require("path");

question_route.use(express.static("public"));
// require('../middleware/passport')(passport);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(
            null,
            path.join(__dirname, "../public/question"),
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
question_route.post("/createQuestion", (req, res) =>
    createQuestion(req, res)
);
question_route.get("/questionCategoryWise/:category", (req, res) =>
    questionCategoryWise(req, res)
);

question_route.post("/questions/bulk", upload.single('file'), (req, res) => addQuestionInBulk(req, res)); // New route for bulk upload



module.exports = question_route;

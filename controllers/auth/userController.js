const User = require("../../models/userModel");


const bcryptjs = require("bcryptjs");
const Joi = require("joi");
const { JWT_SECRET } = require("../../config");
const jwt = require("jsonwebtoken");




// password Hash
const securePassword = async (password) => {
  try {
    const passwordHash = bcryptjs.hash(password, 10);
    return passwordHash;
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//creat token
const creat_token = async (id, role, email) => {
  try {
    const token = await jwt.sign({ _id: id, role: role, email }, JWT_SECRET);

    return token;
  } catch (error) {
    res.status(400).send(error.message);
  }
};




// Verify OTP
//register user
const register_user = async (req, role, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(1).max(30).required(),
      email: Joi.string().email().required(),
      mobile: Joi.string().length(10).pattern(/^\d{10}$/).required(),
      gender: Joi.string().required(), // Make gender required
      password: Joi.string().min(6).max(30).required() // Add password validation
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      // Handle specific validation errors
      if (error.details.some((detail) => detail.context.key === "mobile")) {
        return res.status(400).send({
          success: false,
          message: "Mobile number must be exactly 10 digits long",
        });
      }

      if (error.details.some((detail) => detail.context.key === "email")) {
        return res.status(400).send({
          success: false,
          message: "Email must be a valid email",
        });
      }
       // Add a check for password validation error
       if (error.details.some((detail) => detail.context.key === "password")) {
        return res.status(400).send({
          success: false,
          message: "Password must be between 6 to 30 characters long",
        });
      }

      if (error.details.some((detail) => detail.context.key === "name")) {
        return res.status(400).send({
          success: false,
          message: "name field is requied",
        });
      }


    

      return res.status(400).send({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    // Add password validation logic here if needed

    // Assuming securePassword and User models are correctly defined
    let spassword = ''; 

    if (req.body.password) {
      spassword = await securePassword(req.body.password);
    }
    console.log(spassword);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      gender : req.body.gender,
      password: spassword,
      image: req.file.filename, // Assuming you handle image uploads
      role,
    });

    const userData = await User.findOne({ mobile: req.body.mobile });

    if (userData) {
      res.status(400).send({ success: false, message: "This mobile is already in use" });
    } else {
      const user_data = await user.save();
      const tokenData = await creat_token(
        user_data._id,
        user_data.role,
        user_data.email
      );

      res.status(200).send({
        success: true,
        data: user_data,
        token: `Bearer ${tokenData}`,
      });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};





//login
const login_user = async (req, role, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(/^[a-zA-Z0-9@]{3,30}$/)
        .required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      if (error.details.some((detail) => detail.context.key === "email")) {
        return res.status(400).send({
          success: false,
          message: "email must be a valid email",
        });
      }

      if (error.details.some((detail) => detail.context.key === "password")) {
        return res.status(400).send({
          success: false,
          message: "please enter a valid password",
        });
      }

      return res.status(400).send({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const email = req.body.email;
    const password = req.body.password;
    console.log(email,password)

    const userData = await User.findOne({ email: email });
    console.log(userData)

    if (userData) {
     

      if (userData.role !== role) {
        return res.status(403).json({
          success: false,
          message: `you are not allowed to access this page`,
        });
      }

      const passwordMatch = await bcryptjs.compare(password, userData.password);

      if (passwordMatch) {
        const tokenData = await creat_token(
          userData._id,
          userData.role,
          userData.email
        );
        const userResult = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          mobile: userData.mobile,
          image: userData.image,
          role: userData.role,
          token: `Bearer ${tokenData}`,
        };
        const response = {
          success: true,
          message: "user details",
          data: userResult,
        };

        res.status(200).send(response);
      } else {
        res
          .status(200)
          .send({ success: false, message: "Login details are incorrect" });
      }
    } else {
      res
        .status(200)
        .send({ success: false, message: "Login details are incorrect" });
    }
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
};

//update_password
const update_password = async (req, res) => {
  try {
    const schema = Joi.object({
      newPassword: Joi.string()
        .pattern(/^[a-zA-Z0-9@]{3,30}$/)
        .required(),
      oldPassword: Joi.string()
        .pattern(/^[a-zA-Z0-9@]{3,30}$/)
        .required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {


      if (error.details.some((detail) => detail.context.key === "newPassword")) {
        return res.status(400).json({
          success: false,
          message: "please enter a valid password",
        });
      }

      if (error.details.some((detail) => detail.context.key === "oldPassword")) {
        return res.status(400).json({
          success: false,
          message: "please enter a valid password",
        });
      }


      return res.status(400).json({
        success: false,
        message: error.details.map((d) => d.message),
      });
    }

    const user_id = req.user._id;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword
    console.log(user_id, newPassword, oldPassword, "pppppppp");

    if (!user_id || !newPassword || !oldPassword) {
      return res.status(400).json({
        success: false,
        message: "Both user_id and password must be provided",
      });
    }
    const data = await User.findOne({ _id: user_id });
    console.log(data, "uuuuuuuuuuuuuuu");
    if (data) {
      const passwordMatch = await bcryptjs.compare(oldPassword, data.password);
      if (passwordMatch) {
        const newpassword = await securePassword(newPassword);

        const userData = await User.findByIdAndUpdate(
          { _id: user_id },
          {
            $set: {
              password: newpassword,
            },
          }
        );

        res.status(200).json({
          success: true,
          message: "Password Updated Successfully!",
        });
      } else {
        res.status(400).json({ success: false, message: "Your password is wrong" });
      }

    } else {
      res.status(400).json({ success: false, message: "User Id not found" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//update_profile
const update_profile = async (req, role, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      mobile: Joi.string()
        .length(10)
        .pattern(/^\d{10}$/)
        .required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      if (error.details.some((detail) => detail.context.key === "mobile")) {
        return res.status(400).json({
          success: false,
          message: "Mobile number must be exactly 10 digits long",
        });
      }

      if (error.details.some((detail) => detail.context.key === "name")) {
        return res.status(400).json({
          success: false,
          message: "please enter a valid name",
        });
      }
    }

    const user_id = req.user._id;
    // Find the user by their ID
    const userData = await User.findOne({ _id: user_id });

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User with this ID does not exist",
      });
    }

    if (userData.role !== role) {
      return res.status(403).json({
        success: false,
        message: `You are not allowed to access this page`,
      });
    }

    // Update the user's information
    userData.name = req.body.name;
    userData.mobile = req.body.mobile;
    userData.gender  = req.body.gender;
    
    // Check if a file is uploaded
    if (req.file) {
      userData.image = req.file.filename;
    }

    // Save the updated user data
    const user_data = await userData.save();

    return res.status(200).json({
      success: true,
      message: "Successfully update your profile",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//forgot_password
const forgot_password = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json("email must be provided");
    }

    const userData = await User.findOne({ email: email });

    if (userData) {
      // Generate a 6-digit OTP
      const otp = Math.floor(Math.random() * 900000) + 100000;
      const data = await User.updateOne(
        { email: email },
        { $set: { otp: otp } }
      );

      sendResetPasswordMail(userData.name, userData.email, otp);

      res.status(200).json({
        success: true,
        message: "OTP has been sent to your registered Email",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "No account associated with this email",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
 
  register_user,
  
  login_user,
  
  update_password,
  update_profile,
  forgot_password,

};

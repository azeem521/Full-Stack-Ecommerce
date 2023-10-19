const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require('../utils/sendEmail');
const crypto = require("crypto");

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is sample public id",
      url: "avatarturl",
    },
  });

  // const token = user.getJWTToken()

  // return res.status(201).json({
  //     success : true,
  //     token
  // });
  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // check if user has given email and password both
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPassMatched = await user.comparePassword(password);

  if (!isPassMatched) {
    return next(new ErrorHandler("Invalid email or password not matched", 401));
  }

  // const token = user.getJWTToken();

  // res.status(200).json({
  //     success:true,
  //     token
  // })
  sendToken(user, 200, res);
});

// logout user

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logge Out",
  });
});

// forgot password

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  // get Reset password token
  
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;
  const message = `Your password reset url is ${resetPasswordUrl}`;

  try {
    await sendEmail({
        email:user.email,
        subject:'Ecommerce password recovery',
        message
    });
    res.status(200).json({
        success:true,
        message:'Email sent to '+user.email+' successfully'
    })
  
} catch (error) {
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message,500))
}
});

// Reset password

exports.resetPassword = catchAsyncError(async (req,res,next)=>{
    // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()},
    });
    if(!user){
        return next(
            new ErrorHandler(
              "Reset Password Token is invalid or has been expired",
              400
            )
          );
        }
        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler("Password does not password", 400));
          }
          user.password=req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;

          await user.save();

          sendToken(user,200,res);
})





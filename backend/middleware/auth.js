const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");


exports.isAuthenticatedUser = catchAsyncError(async (req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to access this reesources",401))
    }

    const decodeData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodeData.id);
    
    next();
});

exports.authorizedRoles=(...roles)=>{
    return (req,res,next)=>{
        console.log(req.user.role);
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role ${req.user.role} is not allowed to access this resource`,403))
        }
        next();
    }
}
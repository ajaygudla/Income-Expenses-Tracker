const bcrypt = require("bcryptjs");
const User = require("../../model/User");
const { AppErr,appErr}=require('../../utils/appErr')
const generateToken= require('../../utils/generateToken');
//const verifyToken=require("../../utils/verifyToken");

//Register
const registerUserCtrl = async (req, res,next) => {
  const { fullname, password, email } = req.body;
  try {
    //check if email exist
    const userFound = await User.findOne({ email });
    if (userFound)
    {
      return next(new  AppErr("User Already Exist",400));

    } 

    //check if fields are empty
    
    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    console.log(user);
    res.json({
      status: "success",
      fullname: user.fullname,
      email: user.email,
      id: user._id,
    });
  } catch (error) {
    next(new AppErr(error.message,500));
  }
};

//login
const userLoginCtrl = async (req, res,next) => {
  const {email,password}=req.body;
  try {
    const userFound = await User.findOne({email});
    if(!userFound)return  next(new AppErr("Invalid credentials",400));
    const isPasswordMatch=await bcrypt.compare(password,userFound.password);
    if(!isPasswordMatch)
    return  next(new AppErr("invalid login credentials",400));
    res.json({ 
      status:"success",
      fullname: userFound.fullname,
      id:userFound._id,
      token:generateToken(userFound._id),
     });
  } catch (error) {
    next(new AppErr(error.message,500));
  }
};

//profile
const userProfileCtrl = async (req, res) => {
  console.log(req.user)
  try {
    const user= await User.findById(req.user).populate({
      path:"accounts",
      populate:{
        path:"transactions",
        model:"Transaction",
      },
    });
    res.json(user);
  } catch (error) {
    next(new AppErr(error.message,500));
  }
};

//delete
const deleteUserCtrl = async (req, res,next) => {
  try {
    await User.findByIdAndDelete(req.user);
     return res.status(200).json({
      status:'success',
      data:null
    })
    res.json({ msg: "delete route" });
  } catch (error) {
    next(new AppErr(error.message,500));
  }
};

//update
const updateUserCtrl = async (req, res,next) => {
  try {
    //check if email exists
    if(req.body.email){
      const userFound =await User.findOne({email:req.body.email});
      if(userFound)
      return next(new AppErr('Email is already taken or you already have this email',400));

    }
    
  //cheeck if user is updating the password
  if(req.body.password){
    const salt= await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(req.body.password,salt);
    //update user
    const user =await User.findByIdAndUpdate(req.user,{
      password:hashedPassword,
    },
    {
      new:true,
      runValidators:true,

    });
    //send response
    return res.status(200).json({
      status:"success",
      data:user,
    });
  }
  const user =await User.findByIdAndUpdate(req.user, req.body, {
    new: true,
    runValidators:true,
  });
  res.status(200).json({
    status:"success",
    data:user,
  });
  } catch (error) {
     next(new AppErr(error.message,500));
  }
};

module.exports = {
  registerUserCtrl,
  userLoginCtrl,
  userProfileCtrl,
  deleteUserCtrl,
  updateUserCtrl,
};

const Account= require('../../model/Account');
const User=require('../../model/User');
const {AppErr}=require('../../utils/appErr');
const createAccountCtrl=async(req,res,next)=>{
    const {name, initialBalance, accountType, notes}=req.body;
    try{
        //find the logged in user
        const userFound=await User.findById(req.user);
        if(!userFound)
        return next(new AppErr('user not found',404));
        //create the account
        const account= await Account.create({
             name, 
            initialBalance, 
            accountType, 
            notes,
            createdBy: req.user,

        })
        //push the account into users accounts field
        userFound.accounts.push(account._id)
        //resave the user
        await userFound.save();
        res.json({
            status:'success',
            data:account
        });
    }catch(error){
         next(error);
    }
}

 const getAccountsCtrl=async(req,res)=>{
    try{
        const accounts =await Account.find().populate("transactions")
        res.json(accounts);
    }catch(error){
        res.json(error);
    }
}
const getAccountCtrl=async(req,res,next)=>{
    try{
        //find the id
        const {id}=req.params;
        const account=await Account.findById(id).populate('transactions');
        res.json({status:"success",
    data:account,
});
    }catch(error){
        next(new AppErr(error.message,500));
    }
}

const deleteAccountCtrl=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const account=await Account.findByIdAndDelete(id);
        res.status(200).json({
            status: "success",
        data:null,
    });
    }catch(error){
         next(new AppErr(error.message,500));
    }
}
const updateAccountCtrl=async(req,res,next)=>{
    try{
        const {id}=req.params;
        const account=await Account.findByIdAndUpdate(id,req.body,{
            new:true,
            runValidators:true,
        });
        res.json({
            status:"success",
            data:account,
          });
    }catch(error){
        next(new AppErr(error.message,500));;
    }
}
module.exports ={
    createAccountCtrl,
    getAccountsCtrl,
    getAccountCtrl,
    deleteAccountCtrl,
    updateAccountCtrl
     
}
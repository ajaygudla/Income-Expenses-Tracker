 const User=require("../../model/User");
 const Account=require("../../model/Account");
 const Transaction=require("../../model/Transaction");
 const {AppErr}=require("../../utils/appErr");
 //create
const createTransactionCtrl = async (req, res,next) => {
  const {name, amount,notes, transactionType, account,category}=req.body;
    try {
      //1. find user
      const userFound= await User.findById(req.user);
      console.log(`request user is ${req.user}`)
      if(!userFound) return next(new AppErr("user not found", 404))
      //2. find the account
      const accountFound=await Account.findById(account)
      console.log(account)
      if(!accountFound) return next(new AppErr("account not found", 404))
      //3. create transaction
    const transaction=await Transaction.create({
      amount,
      notes,
      account,
      transactionType,
      category,
      name,
      createdBy: req.user,
    });
      //4. push the transaction to the account
      accountFound.transactions.push(transaction._id);
      //5. remove the account
      await accountFound.save();
      res.json({ status: "success",
    data: transaction});
    } catch (error) {
      next(new AppErr(error.message,500));
    }
  };
  
  //all
  const getTransactionsCtrl = async (req, res,next) => {
    try {
      const trans= await Transaction.find();
      res.status(200).json({ status: "success",
    data:trans });
    } catch (error) {
      next(new AppErr(error.message,500));
    }
  };
  
  //single
  const getTransactionCtrl = async (req, res,next) => {
    try {
      const  {id} = req.params;
      const tran= await Transaction.findById(id);
      res.json({ status: "success",
    data:tran });
    } catch (error) {
      next(new AppErr(error.message,500));
    }
  };
  
  //delete
  const deleteTransactionCtrl = async (req, res,next) => {
    try {
      const  {id} = req.params;
      await Transaction.findByIdAndDelete(id);
      res.json({ status: "success",
      data:null});
    } catch (error) {
      next(new AppErr(error.message,500));
    }
  };
  
  //update
  const updateTransactionCtrl = async (req, res,next) => {
    try {
      const  {id} = req.params;
      const tran= await Transaction.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
      });
      res.json({ status: "success",
      data:tran});
    } catch (error) {
      next(new AppErr(error.message,500));
    }
  };
  
  module.exports = {
    createTransactionCtrl,
    getTransactionsCtrl,
    getTransactionCtrl,
    deleteTransactionCtrl,
    updateTransactionCtrl,
  };
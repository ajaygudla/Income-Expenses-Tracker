const express=require("express");
const cors= require('cors');
require('./config/dbConnect')
const usersRoute=require('./routes/users/usersRoute');
const transactionsRoute = require('./routes/transactions/transactionsRoute');
const accountsRoute = require('./routes/accounts/accountsRoute');
const globalErrHandler=require('./middlewares/globalErrHandler');
const app=express();
//routes
app.use(express.json());
app.use(cors())
app.use('/api/v1/users',usersRoute);
app.use('/api/v1/transactions',transactionsRoute) 
app.use('/api/v1/accounts',accountsRoute);
//error handlers
app.use(globalErrHandler)
const port= process.env.port|| 3022;
app.listen(port,()=>{console.log(`server started and running on port ${port}`)});
const mongoose=require("mongoose");
const dbConnect=async()=>{
    try{
        await mongoose.connect('mongodb+srv://ajaygudla9413:XqyWYevtZPl0zfe0@mernpojject.hlykmkh.mongodb.net/income-expenses-tracker?retryWrites=true&w=majority&appName=mernpojject');
        console.log("db connected successfully");
    }
    catch(error){
        console.log(error.message);
        process.exit(1);


    }
}
dbConnect();
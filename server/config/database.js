const mongoose= require("mongoose");

require("dotenv").config();
const connectDB=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("database connected successfully"))
    .catch((error)=>{
        console.log("db facing connection issues");
        console.log(error);
        process.exit(1);
    })
};
module.exports = connectDB;
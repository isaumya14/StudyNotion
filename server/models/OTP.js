const { type } = require("express/lib/response");
const mongoose = require("mongoose");
const emailTemplate = require("../mails/templates/emailVerificationTemplate");
const mailSender = require("../utils/mailsender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required:true,
  },
  otp: {
    type: String,
    required:true,
   
  },
  createdAT: {
    type: Date,
    default:Date.now(), 
    expires: 5*60,
  },
});

async function sendVerificationEmail(email,otp){
    try{
      const mailResponse = await mailSender(
        email,
        "Verification Email",
        emailTemplate(otp)
      );
      console.log("Email sent successfully: ", mailResponse.response);

    }catch(error){
        console.log("error occured while sending mails: ",error);
        throw error;
    }
}

otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})
module.exports=mongoose.model("OTP",otpSchema);
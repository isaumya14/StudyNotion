const {contactUsEmail} = require("../mails/templates/contactFormRes")
const mailSender= require ("../utils/mailsender")

exports.contactUsController = async (req,res)=>{
    const {email,firstname,lastname,message,phoneNo,countrycode}=req.body
    console.log("all data of req.body are: ",req.body)
    try{
        const emailRes= await mailSender(
           email,
           "Your Data send successfully",
           contactUsEmail(email,firstname,lastname,message,phoneNo,countrycode) 
        )
        console.log("Email Res",emailRes);
        return res.json({
            success:true,
            message:"Email send succesfully",
        })
    }catch(error){
        console.log("Error", error)
        console.log("Error message :", error.message)
        return res.json({
          success: false,
          message: "Something went wrong...",
        })
    }
}
const User= require("../models/users");
const OTP= require("../models/OTP");
const Profile= require("../models/profile")
const otpGenerator= require("otp-generator");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const mailSender = require("../utils/mailsender");
require("dotenv").config();

//send OTP
exports.sendOtp= async (req,res) =>{
    try{
        const {email}=req.body;
        const checkUserPresent= await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'user already registered!!'
            });
        }

        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })
        console.log("otp ", otp);

        const result = await OTP.findOne({otp:otp});

        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            }) 
            result = await OTP.findOne({otp:otp});
        }
        const otpPayload= {email,otp};

        // create an entry in DB for otp

        const otpBody= await OTP.create(otpPayload);

        res.status(200).json({
            success:true,
            message:'OTP sent successfully',
            otp,
        })
    }catch(error){

    }
      
}
exports.signUp= async (req,res) =>{
    try{
        const{ firstname, lastname, email,password,accountType,otp,contactNumber,confirmPswd}=req.body;
        if(!firstname || !lastname || !email || !password|| !confirmPswd || !otp){
           return res.status(403).json({
            success:false,
            message:"all fields are required"
           }) 

        }
        if(password !== confirmPswd){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password do not match. Please try again.",
               }) 
        }
        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists. Please sign in to continue."
               });
        }

        const recentOTP= await OTP.find({email}).sort({createdAt: -1}).limit(1);
        if(recentOTP.length === 0){
            return res.status(400).json({
                success:false,
                message:"otp not found,"
               }) 
        }else if(otp !== recentOTP[0].otp){
            return res.status(400).json({
                success:false,
                message:"invalid otp"
               }) 
        }
        let approved = ""
        approved === "Instructor" ? (approved = false) : (approved = true)

        const profileDetails= await Profile.create({
            gender:null,
            dob:null,
            about:null,
            contactNumber:null,
        })
        const hashedPswd = await bcrypt.hash(password, 10);
        const user= await User.create({
            firstname,lastname,email,contactNumber,password:hashedPswd,
            accountType,additionalDetails:profileDetails._id,
            approved: approved,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastname}`,


        });

        return res.status(200).json({
            success:true,
            user,
            message:"user is registered successfully",
           }) 
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"user not registered",
           }) 
    }
}

exports.login= async (req,res) =>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"all fields are required",
               }) 

        }
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered ",
               }) 
        }
        if(await bcrypt.compare(password, user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            console.log(" JWT_SECRET used for sign:", process.env.JWT_SECRET);
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            });

            user.token=token;
            user.password=undefined;

            const options={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:'logged in successfully'
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"password is incorrect",
               }) 
        }
    }catch(error){
        console.log("login failed error is",error);
        return res.status(500).json({
           
            success:false,
            message:"Login failure",
           }) 
    }
}

exports.changePassword= async(res,req) =>{
    try{
        const userDetails= await User.findById(req.user.id);

        const {oldPassword,newPassword}= req.body;

        const isPasswordMatch= await bcrypt.compare(
            oldPassword,userDetails.password
        )
        if(!isPasswordMatch){
            return res.status(401).json({
                success:false,
                message:"The password is incorrect"
            })
        }
        const encryptedPassword= await bcrypt.hash(newPassword,10)
        const updatedUserDetails= await User.findByIdAndUpdate(
            req.user.id,
            {password: encryptedPassword},
            {new:true}
        )

        try{
            const emailResponse= await mailSender(
                updatedUserDetails.email,
                "Password for your account has been updated",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Password updated successfully for ${updatedUserDetails.firstname} ${updatedUserDetails.lastname}`
                )
            )
            console.log("email sent successfully",emailResponse.response)

        }catch(error){
            console.error("error occured while sending mail",error);
            return res.status(500).json({
                success:false,
                message:"error occured while sending email",
                error:error.message,
            })
        }
        return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })

    }catch(error){
        console.error("Error occurred while updating password:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while updating password",
          error: error.message,
        })
    }
}


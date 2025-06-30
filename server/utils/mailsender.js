const nodemailer=require("nodemailer");

const mailSender= async(email,title,body) =>{
    try{

        let transporter=nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        });

        // send mail
        let info= await transporter.sendMail({
            from: 'StudyNotion - by Saumya',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            

        })
        console.log("jara dekhna info mein kya pada hai" ,info);
        return info;

    }catch(error){

    }
}
module.exports=mailSender;
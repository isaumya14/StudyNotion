const { instance } = require("../config/razorpay");
const Course = require("../models/course");
const User = require("../models/users");

const mailSender = require("../utils/mailsender");
const {
  courseEnrollmentEmail,
} = require("../mails/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const { paymentSuccessEmail } = require("../mails/templates/paymentSuccessEmail");
const CourseProgress = require("../models/courseProgress");


exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (courses.length === 0) {
    return res.json({
      success: false,
      message: "please provide course ID",
    });
  }
  let totalAmount = 0;
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(200).json({
          success: false,
          message: "Could not find the course",
        });
      }

      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentEnrolled.includes(uid)) {
        return res.status(200).json({
          success: false,
          message: "Student is already enrolled",
        });
      }
      totalAmount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };
    try {
      const paymentResponse = await instance.orders.create(options);
      res.json({
        success: true,
        message: paymentResponse,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "could not initiate order",
      });
    }
  }
};

//verify the payment
exports.verifySignature = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({
      success: false,
      message: "Payment failed",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
  .createHmac("sha256", process.env.REACT_APP_RAZORPAY_SECRET)
  .update(body.toString())
  .digest("hex");

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);

    return res.status(200).json({
      success: true,
      message: "payment verified",
    });
  }
  return res.status(200).json({
    success: false,
    message: "Payment failed",
  });
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "please provide data for courses or userId",
    });
  }

  for (const courseId of courses) {
    try{
         //find the course and enroll the students in it
    const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: courseId },
        { $push: { studentEnrolled: userId } },
        { new: true }
      );
      if(!enrolledCourse){
          return res.status(500).json({
              success:false,
              message:"course not found"
          })
      }
      const courseProgress= await CourseProgress.create({
        courseID:courseId,
        userId:userId,
        completedVideos:[],
      })
      //find the student and add the course to their list of enrolledCourses
      const enrolledStudent= await User.findByIdAndUpdate(userId,
          {$push:{
            courses:courseId,
            courseProgress:courseProgress._id
          }},{new:true}
      )
      const emailResponse=await mailSender(
          enrolledStudent.email,`Successfully Enrolled into ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(enrolledCourse.courseName,`${enrolledStudent.firstname}`)
      )
      console.log("email sent successfully",emailResponse);
    }catch(error){
        console.log(error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
    }
   
  }
};

exports.sendPaymentSuccessEmail= async(req,res)=>{
    const {orderId,paymentId,amount}= req.body;
    const userId=req.user.id;

    if(!orderId || !paymentId||!amount ||!userId){
        return res.status(400).json({
            success:false,
            message:"Please Provide all the fields"
        });
    }
    try{
        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Received`,
            paymentSuccessEmail(`${enrolledStudent.firstname}`,
                amount/100,orderId,paymentId
            )
        )
    }
    catch(error){
        console.log("error in sending mail",error)
        return res.status(500).json({
            success: false,
            message: "could not send email",
          });


    }
}

// exports.capturePayment = async (req,res) =>{
//     const {course_id}=req.body;
//     const userId= req.user.id;

//     if(!course_id ){
//         return res.json({
//             success:false,
//             message:"please provide valid course ID",
//         })
//     }
// let course;
// try{
//     course= await Course.findById(course_id);
//     if(!course){
//         return res.json({
//             success:false,
//             message:"could not find the course",
//         });
//     }

//     //check if user already paid for the course
//     // userid is in string form so we have to convert it in objectid from ,because we have stored userid in course in objectid form
//     const uid=new mongoose.Types.ObjectId(userId);
//     if(Course.studentEnrolled.include(uid)){
//         return res.status(200).json({
//             success:false,
//             message:"student is already enrolled",
//         });
//     }

// }catch(error){
//     console.log(error);
//     return res.status(500).json({
//         success:false,
//         message:error.message,
//     });
// }
//  //order create
// const amount= Course.price;
// const currency= "INR";

// const options ={
//     amount:amount*100,
//     currency,
//     receipt : Math.random(Date.now()).toString(),
//     notes:{
//         courseId: course_id,
//         userId,
//     }
// };

// try{
//     //initiate the payment using razorpay
//     const paymentResponse= await instance.orders.create(options);
//     console.log(paymentResponse);

//     return res.status(200).json({
//         success:true,
//         courseName:Course.courseName,
//         courseDescription:Course.courseDescription,
//         thumbnail:Course.thumbnail,
//         orderId:paymentResponse.id,
//         currency:paymentResponse.currency,
//         amount:paymentResponse.amount

//     });
// }catch(error){c
//     console.log(error);
//     return res.status(500).json({
//         success:false,
//         message:"could not initiate order",
//     });
// }

// }

// //verify signature of Razorpay
// exports.verifySignature =async (req,res) =>{
//     //server secret
//     const webhookSecret="123456789";

//     //razorpay secret
//     const signature=req.headers("x-razorpay-signature");
//     const shasum=crypto.createHmac("sha256",webhookSecret);

//     shasum.update(JSON.stringify(req.body));
//     const digest=shasum.digest("hex");

//     if(signature===digest){
//         console.log("payment is authorised");
//         const {courseId,userId}=req.body.payload.payment.entity.notes;

//         try{
//             //fulfil the action

//             //find the course and enroll the student init
//             const enrolledCourse =await Course.findOneAndUpdate(
//                 {_id:courseId},
//                 {$push:{studentEnrolled:userId}},{new:true},
//             );

//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:"course not found"
//                 })
//             }

//             //find the student and add the course to their list of enrolled courses
//             const enrolledStudent= await User.findOneAndUpdate(
//                 {_id:userId},
//                 {$push:{courses:courseId}},
//                 {new:true},
//             )
//             console.log(enrolledStudent)

//             //mail confirmation send
//             const emailResponse = await mailSender(
//                 enrolledStudent.email,"Congratulations from StudyNotion", "congratulations,you are onboarded into new StudyNotion course",
//             )
//             console.log(emailResponse);
//             return res.status(200).json({
//                 success:true,
//                 message:"course added and signature verified"
//             })

//         }catch(error){
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message:error.message,
//             });
//         }
//     }
//     else{

//         return res.status(400).json({
//             success:false,
//             message:"could not match the signature",
//         });
//     }

// };

const RatingAndReview = require("../models/ratingandreview");
const Course = require("../models/course");
const { default: mongoose } = require("mongoose");


// create rating
exports.createRating = async (req, res) => {
  try {
    //get userid
    const userId = req.user.id;
    //get data
    const { rating, review, courseId } = req.body;

    //check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "student is not enrolled in the course",
      });
    }

    //check if user is already reviewed
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "cou",
      });
    }
    // create rating and review
    const ratingReview = await RatingAndReview.create({
      rating,
      review,
      course: courseId,
      user: userId,
    });

    //update course
    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingsANDreviews: ratingReview._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Rating and Review Created Successfully",
      ratingReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAvgRating = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    if(result.length >0){
        
    return res.status(200).json({
        success: true,
        averageRating:result[0].averageRating,
       
      });
    }


    return res.status(200).json({
        success: false,
        averageRating:0,
        message: "average rating is 0, no rating given till now",
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllRating= async(req,res)=>{
    try{
        const allReviews = await RatingAndReview.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select:"firstName lastName image email",

        }).populate({
            path:"course",
            select:"courseName",
        }).exec();
   
        return res.status(200).json({
            success: true,
            message: "all reviews fetched successfully",
            data:allReviews,
          });
    }catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}

const Section = require("../models/section");
const Course = require("../models/course");
const SubSection= require("../models/subsection")


exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "missing properties",
      });
    }

    const newSection = await Section.create({ sectionName });
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true } )
        .populate({
          path: "courseContent",
          populate: {
            path: "SubSection",
          },
        })
        .exec()
   
    return res.status(200).json({
      success: true,
      message: "section created successfully",
      updatedCourseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong, unable to create section",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId,courseId} = req.body;
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "missing properties",
      });
    }

    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );
    const course = await Course.findById(courseId)
		.populate({
			path:"courseContent",
			populate:{
				path:"SubSection",
			},
		})
		.exec();

    return res.status(200).json({
      success: true,
      data:course,
      message: "section updatedd successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wronggggg, unable to update section",
      error: error.message,
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId }  = req.body;
		await Course.findByIdAndUpdate(courseId, {
			$pull: {
				courseContent: sectionId,
			}
		})
   const section= await Section.findByIdAndDelete(sectionId);
   console.log(sectionId, courseId);
   if(!section) {
    return res.status(404).json({
      success:false,
      message:"Section not Found",
    })
  }

  //delete sub section
  await SubSection.deleteMany({_id: {$in: section.subSection}});

  await Section.findByIdAndDelete(sectionId);

  //find the updated course and return 
  const course = await Course.findById(courseId).populate({
    path:"courseContent",
    populate: {
      path: "SubSection"
    }
  })
  .exec();
    return res.status(200).json({
      success: true,
      message: "section deleted  successfully",
      data:course
     
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong, unable to delete section",
      error: error.message,
    });
  }
};

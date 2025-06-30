const SubSection = require("../models/subsection");
const Section = require("../models/section");
const { uploadImageToCloudinary } = require("../utils/imageuploader");

exports.createSubsection = async (req, res) => {
  try {
    const { sectionId, title, description } = req.body;
    const video = req.files.VideoFile;
    if (!sectionId || !title  || !description ||!video) {
      return res.status(400).json({
        success: false,
        message: " All fields are Required",
      });
    }

    const uploadVideoDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    const subSectionDetails = await SubSection.create({
      title: title,
      timeDuration:`${uploadVideoDetails.duration}`,
      description: description,
      videoURL: uploadVideoDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          SubSection: subSectionDetails._id,
        },
      },
      { new: true }
    ).populate("SubSection");

    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      data:updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong, unable to create subsection",
      error: error.message,
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) subSection.title = title;
    if (description !== undefined) subSection.description = description;

    if (req.files && req.files.VideoFile !== undefined) {
      const video = req.files.VideoFile;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoURL = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate("SubSection");

    console.log("updated section", updatedSection);

    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong, unable to update section",
      error: error.message,
    });
  }
};


exports.deleteSubSection = async (req, res) => {
  try {
    const { subsectionId, sectionId } = req.body;

    if (!subsectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "subsectionId and sectionId are required",
      });
    }
    await SubSection.findByIdAndDelete(subsectionId);
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: {
          SubSection: subsectionId,
        },
      },
      { new: true }
    ).populate("SubSection");

    return res.status(200).json({
      success: true,
      data: updatedSection,
      message: "subsection deleted  successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong, unable to delete subsection",
      error: error.message,
    });
  }
};

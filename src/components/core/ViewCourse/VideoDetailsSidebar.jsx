import React, { useState,useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/Iconbtn";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [videobarActive, setVideoBarActive] = useState("");
  const navigate = useNavigate();
  const { sectionId, subSectionId } = useParams();
  const location = useLocation();

  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    const setActiveFlags = () => {
      if (!courseSectionData.length) return;
      const currentSectionIndex = courseSectionData.findIndex(
        (data) => data._id === sectionId
      );
      const currentSubSectionIndex = courseSectionData?.[
        currentSectionIndex
      ]?.SubSection.findIndex((data) => data._id === subSectionId);
      const activeSubSectionId =
        courseSectionData[currentSectionIndex]?.SubSection?.[
          currentSubSectionIndex
        ]?._id;
      //SET CURRENT SECTION HERE
      setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
      //SET CURRENT SUBSECTION HERE
      setVideoBarActive(activeSubSectionId);
    };
    setActiveFlags();
  }, [courseSectionData, courseEntireData, location.pathname]);

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
        {/* for button and headings */}
        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          {/* buttons */}
          <div className="flex w-full items-center justify-between ">
            <div
              onClick={() => {
                navigate("/dashboard/enrolled-courses");
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>
            <div>
              <IconBtn
                text="Add Review"
                customClasses="ml-auto"
                onclick={() => setReviewModal(true)}
              />
            </div>
          </div>
          {/* headings */}
          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length}/{totalNoOfLectures}
            </p>
          </div>

          {/* section and subsections */}
          <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
            {courseSectionData.map((course, index) => (
              <div
                className="mt-2 cursor-pointer text-sm text-richblack-5"
                onClick={() => setActiveStatus(course?._id)}
                key={index}
              >
                {/* section */}
                <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                  <div className="w-[70%] font-semibold">
                    {course?.sectionName}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`${
                        activeStatus === course?.sectionName
                          ? "rotate-0"
                          : "rotate-180"
                      } transition-all duration-500`}
                    >
                      <BsChevronDown />
                    </span>
                  </div>
                </div>
                {/* //subsection */}
                <div>
                  {activeStatus === course?._id && (
                    <div>
                      {course.SubSection.map((topic, index) => (
                        <div
                          className={`flex gap-x-5 p-5 ${
                            videobarActive === topic._id
                              ? "bg-yellow-200 text-richblack-900"
                              : "bg-richblack-900 text-white"
                          }`}
                          key={index}
                          onClick={()=>{
                            navigate(`/view-course/${courseEntireData?._id}/section/${course?._id} /
                                sub-section/${topic?._id}`)
                                setVideoBarActive(topic?._id)
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={completedLectures.includes(topic._id)}
                            onChange={() => {}}
                          />
                          <span>{topic.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default VideoDetailsSidebar;

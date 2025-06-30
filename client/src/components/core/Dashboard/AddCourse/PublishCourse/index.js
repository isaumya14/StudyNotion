import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import IconBtn from "../../../../common/Iconbtn";
import { resetCourseState, setStep } from "../../../../../slices/courseSlice";
import { COURSE_STATUS } from "../../../../../utils/constants";
import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI";

const PublishCourse = () => {
  const { register, handleSubmit, setValue, getValues } = useForm();
  const { course } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, []);

const goToCourses =() =>{
    dispatch(resetCourseState());
}

  const handleCoursePublish = async () => {
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      //no updation in form
      //no need to make api call
      goToCourses();
      return;
    }
    //if form is updated
    const formData=new FormData();
    formData.append("courseId",course._id);
    const courseStatus =getValues("public") ? COURSE_STATUS.PUBLISHED:COURSE_STATUS.DRAFT;
    formData.append("status",courseStatus);

    setLoading(true);
    const result = await editCourseDetails(formData,token);
    if(result){
        goToCourses();
    }
    setLoading(false);
  };
  const onSubmit = () => {
    handleCoursePublish();
  };
  const goBack = () => {
    dispatch(setStep(2));
  };
  return (
    <div className="rounded-md border-[1px] bg-richblack-900 p-6 border-richblack-700 text-richblack-5">
      <p>Publish Course</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="public">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="rounded h-4 w-4"
            />
            <span className="ml-3">Make this Course as Public</span>
          </label>
        </div>
        <div className="flex justify-end gap-x-5">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex item-center rounded-md bg-richblack-400 p-4"
          >
            Back
          </button>
          <IconBtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  );
};
export default PublishCourse;

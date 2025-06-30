import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import HighlightText from "../components/core/homepage/HighlightText";
import Banner from "../assets/Images/banner.mp4";
import CTAbutton from "../components/core/homepage/Button";
import CodeBlocks from "../components/core/homepage/CodeBlocks";
import TimelineSection from "../components/core/homepage/TimelineSection";
import LearningLanguageSection from "../components/core/homepage/LearningLanguageSection";
import InstructorSection from "../components/core/homepage/InstructorSection";
import ExploreMore from "../components/core/homepage/ExploreMore";
import Footer from "../components/common/Footer";
import ReviewSlider from "../components/common/ReviewSlider";

const Home = () => {
  return (
    <div>
      {/* SECTION-1 */}
      <div className="relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between">
        <Link to={"/signup"}>
          <div
            className="group mt-14 p-2 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
          transition-all duration-200 hover:scale-95 w-fit"
          >
            <div
              className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px]  transition-all duration-200
            group-hover:bg-richblack-900"
            >
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>
        <div className="text-center text-4xl font-semibold mt-7">
          Empower Your Future with <HighlightText text={"Coding Skills"} />
        </div>
        <div className="mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        <div className="flex flex-row gap-7 mt-8">
          <CTAbutton active={true} linkto={"/signup"}>
            Learn More
          </CTAbutton>

          <CTAbutton active={false} linkto={"/login"}>
            Book a Demo
          </CTAbutton>
        </div>

        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video>
        </div>

        {/* CODESECTION-1 */}
        <div>
          <div>
            <CodeBlocks
              position={"lg:flex-row"}
              heading={
                <div className="text-4xl font-semibold">
                  Unlock Your <HighlightText text={"coding potential"} />
                  with our online courses.
                </div>
              }
              subheading={
                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              }
              ctabtn1={{
                btnText: "Try it yourself ",
                linkto: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                linkto: "/signup",
                active: true,
              }}
              codeColor={"text-pink-200"}
              codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
              backgroundGradient={<div className="codeblock1 absolute"></div>}
            />
          </div>
        </div>

        {/* CODESECTION-2 */}

        <div>
          <div>
            <CodeBlocks
              position={"lg:flex-row-reverse"}
              heading={
                <div className="text-4xl font-semibold">
                  Unlock Your <HighlightText text={" coding potential "} />
                  with our online courses.
                </div>
              }
              subheading={
                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              }
              ctabtn1={{
                btnText: "Try it yourself ",
                linkto: "/signup",
                active: true,
              }}
              ctabtn2={{
                btnText: "Learn More",
                linkto: "/signup",
                active: true,
              }}
              codeColor={"text-blue-25"}
              codeblock={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
              backgroundGradient={<div className="codeblock2 absolute"></div>}
            />
          </div>
        </div>
        <ExploreMore />
      </div>

      {/* SECTION-2 */}
      <div className="bg-pure-greys-5 text-richblack-700">

        <div className="homepage_bg h-[310px]">
          <div className="w-11/12 max-w-max gap-5 mx-auto flex flex-col">
            <div className="h-[200px]"></div>
            <div className="flex flex-row gap-7 text-white">
              <CTAbutton active={true} linkto={"/signup"}>
                <div className="flex flex-row items-center gap-2 ">
                  Explore Full Catalog <FaArrowRight />
                </div>
              </CTAbutton>
              <CTAbutton active={false} linkto={"/signup"}>
                Learn More
              </CTAbutton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
        
        <div className='mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0'>
            <div className='text-4xl font-semibold lg: w-[45%]'>
                Get the Skills you need for a <HighlightText text={"Job that is in demand!"}/>
            </div>

            <div className='flex flex-col gap-10 lg:w-[40%] items-start'>
                <div className='text-[16px]'>
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
                </div>
                <CTAbutton active={true} linkto={"/signup"}><div>Learn More</div></CTAbutton>
            </div>
        </div>
        <TimelineSection />
        <LearningLanguageSection />
        </div>

             
       
      </div>

      {/* SECTION-3 */}
      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        {/* Become a instructor section */}
        <InstructorSection />

        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
        <ReviewSlider />
      </div>
      {/* SECTION-4(FOOTER) */}
      <Footer/>
    </div>
  );
};

export default Home;

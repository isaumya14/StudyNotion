import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/common/NavBar";
import Signup from "./pages/SignUp";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OpenRoute from "./components/core/Auth/OpenRoute";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import MyProfile from "./components/core/Dashboard/MyProfile";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Errors from "./pages/Errors";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/cart";
import { ACCOUNT_TYPE } from "./utils/constants";
import AddCourse from "./components/core/Dashboard/AddCourse";
import MyCourses from "./components/core/Dashboard/MyCourses";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/InstructorDashboard/Instructor";
import Contact from "./pages/Contact";
import Settings from "./components/core/Dashboard/Settings";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "./services/operations/profileAPI";


function App() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
const dispatch = useDispatch();

useEffect(() => {
  if (token) {
    dispatch(getUserDetails(token));
  }
}, [token, dispatch]);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* ⬅️ Add this line */}
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="catalog/:catalogName" element={<Catalog />} />
        <Route path="courses/:courseId" element={<CourseDetails />} />
        <Route
          path="signup"
          element={
            <OpenRoute>
              {" "}
              <Signup />{" "}
            </OpenRoute>
          }
        />
        <Route
          path="login"
          element={
            <OpenRoute>
              {" "}
              <Login />{" "}
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              {" "}
              <ForgotPassword />{" "}
            </OpenRoute>
          }
        />
        <Route
          path="update-password/:id"
          element={
            <OpenRoute>
              {" "}
              <UpdatePassword />{" "}
            </OpenRoute>
          }
        />
        <Route
          path="verify-email"
          element={
            <OpenRoute>
              {" "}
              <VerifyEmail />{" "}
            </OpenRoute>
          }
        />
        <Route
          path="about"
          element={
            
              <About />
          }
        />
        <Route path="/contact" element={<Contact />}/>
        <Route
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
         <Route path="dashboard/Settings" element={<Settings />} />
          <Route path="dashboard/my-profile" element={<MyProfile />} />{" "}
          {user?.accountType === ACCOUNT_TYPE.STUDENT && (
            <>
              <Route
                path="dashboard/enrolled-courses"
                element={<EnrolledCourses />}
              />
              <Route path="dashboard/cart" element={<Cart />} />
            </>
          )}

{user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
            <>
             <Route path="dashboard/instructor" element={<Instructor />}/>
              <Route
                path="dashboard/add-course"
                element={<AddCourse />}
              />
               <Route
                path="dashboard/my-courses"
                element={<MyCourses />}
              />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
              
            </>
          )}
        </Route>
        <Route element={<PrivateRoute>
          <ViewCourse />
        </PrivateRoute>}>
        {
          user?.accountType=== ACCOUNT_TYPE.STUDENT && (
            <>
            <Route
            path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
            element={<VideoDetails />}
              >

            </Route>
            </>
          )
        }
           
        </Route>
        <Route path="*" element={<Errors />} />
      </Routes>
    </div>
  );
}

export default App;

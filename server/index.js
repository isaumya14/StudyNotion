const express = require("express");
const app = express();
const path = require("path"); // ✅ to serve frontend

// ⛓️ Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

// 🔗 Connect DB
const connectDB = require("./config/database");
connectDB();

// 🧩 Middlewares
const cookieParser = require("cookie-parser");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup for both local + production
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// ☁️ Cloudinary Connect
cloudinaryConnect();

// 🔀 API Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
console.log("🛣️  /api/v1/course routes registered");

app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// 🌐 Serving React Frontend (build)
// app.use(express.static(path.join(__dirname, "../src/build"))); // ✅ Adjusted to point to React build folder

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../src/build/index.html")); // ✅ Handles React routing
// });

// 🟢 Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running 🚀",
  });
});

// 🚀 Server listen
app.listen(PORT, () => {
  console.log(`🎉 Your app is running at port ${PORT}`);
});

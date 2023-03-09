import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();

app.use(express.json()); //for sending data to DB
app.use(cookieParser()); //cookie-parser

//handle single file upload
// const upload = multer({ dest: "./uploads/" });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/upload"); //store the image in the frontend folder
  },
  filename: function (req, file, cb) {
    //create unique file name
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
  //file is the input file name
  const file = req.file; //uploaded file
  res.status(200).json(file.filename); //send back the file url
});

//routes
app.use("/api/posts", postRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.listen(8800, () => {
  console.log("Connected");
});

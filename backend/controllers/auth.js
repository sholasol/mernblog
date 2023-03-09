import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  //validation
  const { firstname, lastname, username, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.status(400);
    // throw new Error("Kindly fill all required fields");
    return res.json("Kindly fill all required fields");
  }

  //check if user exists
  const q = "SELECT * FROM users WHERE email=? OR username=?";

  db.query(q, [email, username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists");

    //hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt); //hash the password

    //insert user
    const que =
      "INSERT INTO users(`firstname`, `lastname`, `username`, `email`, `password`) VALUES(?)";
    const values = [firstname, lastname, username, email, hash];

    db.query(que, [values], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json("User created successfully");
    });
  });
};

//User login

export const login = (req, res) => {
  //return res.json("Login Page");

  const { email, password } = req.body;
  //validation
  if (!email || !password) {
    res.status(400);
    // throw new Error("Kindly fill all required fields");
    return res.json("Email and Password are required!");
  }

  //check user exist
  const q = "SELECT * FROM users WHERE email = ?";

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.json(err);
    //If no user record
    if (data.length === 0) {
      return res.status(404).json("User not found!");
    }

    //check user password //data[0] is the first element of the array which is user
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect) {
      return res.status(404).json("Invalid User credential");
    }

    const token = jwt.sign({ id: data[0].id }, "jwtkey");

    const { password, ...other } = data[0]; //remove password from user information

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other); //token and user data
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("access_token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out!");
};

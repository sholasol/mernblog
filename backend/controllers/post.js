import { db } from "../db.js"; //import the database connection file
import jwt from "jsonwebtoken";

//all posts
export const getPosts = (req, res) => {
  //if category, get posts by category else select all posts
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data);
  });
  // res.json("From post controller");
};

//single post
export const getPost = (req, res) => {
  const q =
    "SELECT p.id, `username`, `title`, `description`, p.img, u.img AS userImg, `cat`, `date` FROM users u JOIN posts p ON u.id=p.uid WHERE p.id =?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]); //fetch post and return first item
  });
};

export const addPost = (req, res) => {
  //check user token
  const token = req.cookies.access_token;
  if (!token)
    return res.status(401).json("You are not permitted to write a post");

  //verify token
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User token not valid");

    const q =
      "INSERT INTO posts(`title`, `description`, `img`, `cat`, `uid`, `date`) VALUES(?) ";
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      userInfo.id,
      req.body.date,
    ];
    db.query(q, [values], (err, data) => {
      if (err)
        return res
          .status(403)
          .json("Oops error occurs while creating your post");

      return res.json("Post has been created successfully");
    });
  });
};

export const deletePost = (req, res) => {
  //check user token
  const token = req.cookies.access_token;
  if (!token)
    return res.status(401).json("You are not permitted to delete this post");

  //verify token
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User token not valid");

    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` =? AND `uid`=? ";
    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can only delete your post");

      return res.json("The post has been deleted successfully");
    });
  });
};

export const updatePost = (req, res) => {
  //check user token
  const token = req.cookies.access_token;
  if (!token)
    return res.status(401).json("You are not permitted to update this post");

  const postId = req.params.id;

  //verify token
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("User token not valid");

    const q =
      "UPDATE posts SET `title`=?, `description`=?,`img`=?, `cat`=? WHERE `id`=? AND `uid`=? ";
    const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];
    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err)
        return res
          .status(403)
          .json("Oops error occurs while updating your post");

      return res.json("Post has been updated successfully");
    });
  });
};

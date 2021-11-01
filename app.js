//Run Project and Listering Port with Express
const express = require("express");
const app = express();
//To Access environment Variables require dotenv
require("dotenv").config();

// middleWare for datamodification and binding
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(process.env.PORT, () =>
  console.log(
    `Example app listening on http://localhose:${process.env.PORT} port!`
  )
);

//Function for verifying  JWT
const verifyToken = async (req, res, next) => {
  const token = req.query.token;
  if (!token) return res.status(401).json({ message: "access denied" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "invalid token" });
  }
};

//Function for making Slug
const slugMaker = async (data) => {
  let slug = data.toLowerCase();
  slug = slug.replace(/[^a-zA-Z ]/g, "");
  slug = slug.replace(/[ ]/g, "-");
  return slug.toString();
};

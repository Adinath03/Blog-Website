const port = process.env.PORT || 3000;
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const { forEach } = require("lodash");

const app = express();
require("dotenv").config();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeStartingContent =
  "Welcome to my blog! Here you will find a collection of my thoughts and experiences in the world of technology. I love building and creating applications, and I'm always looking for ways to solve problems and improve user experiences. Whether you're interested in android development, web development, or machine learning, there's something for everyone here. So come on in and explore!";
const aboutContent =
  "Hi! I'm Adinath Mahandule, a final year BE student from Ramrao Adik Institute of Technology majoring in computer science. I've always been fascinated by technology since I was a child. Building and creating applications tap into my creative edge, and I enjoy solving the problems I encounter along the way. I have developed numerous projects during my engineering curriculum in domains like android development, web development, and machine learning. My preferred programming language is C++. I have recently also done some project work in Python. I like to think positively & work well with teams, and I'm always eager to learn new things. In my free time, I enjoy going for a walk or a hike in nature. I also love to read mystery and mythological books.";
const contactContent =
  "If you have any questions or suggestions, please feel free to reach out to me using the contact form below. I'm always happy to hear from my readers and to help out in any way that I can. You can also follow me on social media to stay up to date with my latest projects and adventures. Thank you for visiting my blog, and I look forward to hearing from you!";

//connecting with mongoose atlas
mongoose.connect(`mongodb+srv://${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}@cluster0.sdwodvq.mongodb.net/todolistDB?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB Atlas: ', err);
  });

//schema for our posts
const postSchema = {
  title: String,
  content: String
};

//creating database using postSchema
const Post = mongoose.model("Post", postSchema);

app.get("/", async function (req, res) {
  try {
    const posts = await Post.find({});
    //console.log(posts);
    res.render("home", { startingContent: homeStartingContent, posts: posts });
  } catch (error) {
    console.log(err);
    res.redirect("/");
  }
});

app.get("/posts/:title", async (req, res) => {
  try {
    const postTitle = _.lowerCase(req.params.title);
    const posts = await Post.find({});
    posts.forEach(function (post) {
      const currentTitle = _.lowerCase(post.title);
      if (currentTitle == postTitle) {
        res.render("post", { title: post.title, content: post.content });
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", async function (req, res) {
  const title = req.body.postTitle;
  const content = req.body.postContent;

  const newPost = new Post({
    title: title,
    content: content
  });
  await newPost.save();
  res.redirect("/");
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
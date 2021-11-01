//Mongodb connect
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECT, () => {
  console.log("connected to db");
});

//Model Schema
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const bookSchema = new Schema(
  {
    name: String,
    publishYear: Number,
    author: String,
    publisher: {
      type: Schema.Types.ObjectId,
      ref: "Publisher",
      required: true,
    },
  },
  { timestamps: true }
);

//model Schema2
module.exports = mongoose.model("Book", bookSchema);

const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const publisherSchema = new Schema(
  {
    name: String,
    location: String,
  },
  { timestamps: true }
);

publisherSchema.virtual("booksPublished", {
  ref: "Book", //The Model to use
  localField: "_id", //Find in Model, where localField
  foreignField: "publisher", // is equal to foreignField
});

// Set Object and Json property to true. Default is set to false
publisherSchema.set("toObject", { virtuals: true });
publisherSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Publisher", publisherSchema);

//One to many relation with physical field
const Book = require("./models/Book");
app.post("/addBook", async (req, res) => {
  try {
    //validate data as required

    const book = new Book(req.query);
    // book.publisher = publisher._id; <=== Assign user id from signed in publisher to publisher key
    await book.save();
    const publisher = await Publisher.findById({ _id: book.publisher });
    publisher.publishedBooks.push(book);
    await publisher.save();

    //return new book object, after saving it to Publisher
    res.status(200).json({ success: true, data: book });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.get("/all", async (req, res) => {
  const publisher = await Publisher.find().populate("publishedBooks").exec();
  res.json(publisher);
});

//One to many relation with vertual field
//one to many relationship
app.get("/publishers", async (req, res) => {
  try {
    const data = await Publisher.find().populate({
      path: "booksPublished",
      select: "name publishYear author",
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

//filtering single conditon on populate
app.get("/publishersnew", async (req, res) => {
  try {
    const data = await Publisher.find().populate({
      path: "booksPublished",
      match: [{ name: { $eq: "nextjs" } }],
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

//filtering multiple conditon on populate
app.get("/publishersnew2", async (req, res) => {
  try {
    const data = await Publisher.find().populate({
      path: "booksPublished",
      match: {
        $and: [{ name: { $eq: "nextjs" } }, { publishYear: { $lt: 2022 } }],
      },
    });
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

//mongodb create
const Post = require("../models/Posts");

router.post("/add", async function (req, res) {
  const { title, body, email } = req.query;
  const user = await User.findOne({ email: email });
  const post = new Post({
    title: title,
    body: body,
    userId: user._id,
  });

  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

module.exports = router;

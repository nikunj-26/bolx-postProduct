const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/olxDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = new mongoose.Schema({
  //   sellerName: String,
  title: String,
  description: String,
  //   price: String,
  //   email: String,
  city: String,
  image: Array,
  city: String,
  state: String,
  phone: String,
  date: String,
});

const Product = mongoose.model("Product", productSchema);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post(
  "/uploadmultiplefile",
  upload.array("attachments", 12),
  async (req, res, next) => {
    console.log(req.body);
    // const reqFiles = [];
    // const url = req.protocol + "://" + req.get("host");
    // for (var i = 0; i < req.files.length; i++) {
    //   reqFiles.push(url + "/public/" + req.files[i].filename);
    // }

    // console.log(reqFiles);

    const file = req.files;
    // const fileName = file.originalname;
    const title = req.body.title;
    //const email= req.body.email;
    //const featured = req.body.featured;
    const description = req.body.description;
    // const price = req.body.price;
    const city = req.body.city;
    const state = req.body.state;
    const phone = req.body.phone;
    const image = [];

    if (!file) {
      const error = new Error("Please upload files");
      error.httpStatusCode = 400;
      return next(error);
    }

    var fs = require("fs");
    var id = req.params.id;

    for (var i = 0; i < req.files.length; i++) {
      fs.rename(
        "./images/" + file[i].originalname,
        "./images/" + (title + " " + i + ".jpg"),
        function (err) {
          if (err) throw err;
        }
      );
      image.push(title + " " + i + ".jpg");
    }

    ////////////////DONT see
    const newProduct = new Product({
      title: title,
      description: description,
      //   price: price,
      city: city,
      image: image,
      state: state,
      phone: phone,
      date: new Date().toLocaleString().split(",")[0],
    });

    await newProduct.save();

    const createSuccess = {
      status: "Success",
      message: "Post created Succedfully",
    };
    res.send(JSON.stringify(createSuccess));
  }
);

app.listen(5000, () => {
  console.log("Server is running");
});

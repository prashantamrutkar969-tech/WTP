const mongoose = require("mongoose");
var payUMoney = require("payumoney_nodejs");
payUMoney.setProdKeys("6PqKSK15", "sAOVPuJG2X");
payUMoney.isProdMode(true);
mongoose
  .connect("mongodb://127.0.0.1:27017/cdac2025")
  .then(() => console.log("Connected!"));

const Schema = mongoose.Schema;
const BlogPost = new Schema({
  name: String,
  email: String,
  password: Number,
});

const MyModel = mongoose.model("users", BlogPost);

const express = require("express");
const app = express();
app.use(express.urlencoded());
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/users", async (req, res) => {
  try {
    const result = await MyModel.find();
    res.render("users.ejs", { data: result });
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});

app.post("/registeraction", async (req, res) => {
  try {
    let record = new MyModel(req.body);
    await record.save();
    res.redirect("/users");
  } catch (err) {
    console.log(err);
    res.send("Error occurred");
  }
});

app.post("/payment", (req, res) => {
  req.body.txnid = Math.round(Math.random() * 1000000);
  req.body.surl = "http://localhost:3000/success";
  req.body.furl = "http://localhost:3000/failure";

  payUMoney.pay(req.body, function (error, response) {
    if (error) {
      // Some error console.log(response);
    } else {
      res.redirect(response);
    }
  });
});
app.post("/success", (req, res) => {
  res.send("Payment Successfull");
});

app.post("/failure", (req, res) => {
  res.send("Payment Failed");
});

app.listen(3500);

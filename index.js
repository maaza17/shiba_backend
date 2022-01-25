const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const env = require("dotenv");
env.config();
const users = require("./routes/api/users");
const categories = require("./routes/api/categories");
const places = require("./routes/api/places");
const reviews = require("./routes/api/review");
const admin = require("./routes/admin/admin");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});


const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log(err));

app.use(passport.initialize());

require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/categories", categories);
app.use("/api/places", places);
app.use("/api/reviews", reviews);
app.use("/admin", admin);

const port = process.env.PORT;

app.listen(port, () => console.log("Server is live on port " + port + "!"));

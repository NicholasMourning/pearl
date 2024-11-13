//Require modules
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo");

//create app
const app = express();

//configure app
let port = 3000;
let host = "localhost";
app.set("view engine", "ejs");
const mongoUrl =
  "mongodb+srv://admin:admin123@cluster0.iqbpg.mongodb.net/project4?retryWrites=true&w=majority&appName=Cluster0";

//Connect to database
mongoose
  .connect(mongoUrl)
  .then(() => {
    //start the server
    app.listen(port, host, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => console.log(err.message));

//mount middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "pearl",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: mongoUrl }),
    cookie: { maxAge: 60 * 60 * 1000 },
  })
);

//set up routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/items", itemRoutes);
app.use("/users", userRoutes);

//Set up errors
app.use((req, res, next) => {
  let err = new Error("The server cannot locate " + req.url);
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  if (!err.status) {
    err.status = 500;
    err.message = "Internal Server Error";
  }

  res.status(err.status);
  res.render("error", { error: err });
});

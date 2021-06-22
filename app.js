//Comentário criado apenas para fazer o PR na branch Main
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var catalogRouter = require("./routes/catalog"); //Import routes for "catalog" area of site

var app = express();

// Set up mongoose connection
var dev_db_url =
  "mongodb+srv://dba:s2OuCobCglTtech6@cluster0.uiv1l.mongodb.net/local_library_dev?retryWrites=true";

if (process.env.MONGODB_URI) {
  !process.env.MONGODB_URI.startsWith("mongodb")
    ? (mongoDB = "mongodb" + process.env.MONGODB_URI)
    : (mongoDB = process.env.MONGODB_URI);
} else mongoDB = dev_db_url;

console.log(`======== mongoDB String: "${mongoDB}" ===========`);

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

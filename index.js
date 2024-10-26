const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const http = require("http");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const CustomError = require("./utils/CustomError");
const globalErrorHandler = require("./controllers/errorController");
const { APP_PORT, DB_URL } = require("./config");
const connectDatabase = require("./connection/db");
const upload = multer({ dest: "uploads/" }); // Middleware for handling file uploads

const server = http.createServer(app);

// Database connection
connectDatabase();

// Error handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception occurred! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection occurred! Shutting down...");
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Middleware
app.use(cors());
app.use("/public", express.static("public"));
app.use(express.json());
app.use(morgan("dev"));
app.use(limiter);
app.use(passport.initialize());
app.use(cors());




require("./middleware/passport")(passport);

// Routes
const user_routes = require("./routes/userRoute");
const category_route = require("./routes/catagoryRoute");
const question_route = require("./routes/questionRoute");

app.use("/api", user_routes);
app.use("/api", category_route);
app.use("/api", question_route);

// Undefined routes handler
app.all("*", (req, res, next) => {
  next(new CustomError(`Can't find ${req.originalUrl} on the server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

// Start server
server.listen(APP_PORT || 5010, () => {
  console.log(`Server started on port ${APP_PORT || 5010}`);
});

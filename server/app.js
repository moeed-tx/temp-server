const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
app.use(
  cors({
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.options("*", cors());

app.use(require("body-parser").json());

app.get("/test", (req, res) => {
  res.status(200).json({ message: "Server Running" });
});

app.use("*", (req, res, next) => {
  try {
    return res.status(404).json({
      error: "Not Found",
      message: "Invalid Endpoint",
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  return res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong",
  });
});
// Optional fallthrough error handler

app.listen(process.env.PORT, () => {
  console.log("Server Listening On PORT =>", process.env.PORT);
});
module.exports = app;

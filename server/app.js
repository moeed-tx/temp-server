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
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server Running" });
});
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server Running" });
});

app.get("/app", (req, res) => {
  const eventID = req.query.eventID;
  const role = req.query.role;

  const appLink = `snapfetti://app/12356/temp`;
  const appStoreLink =
    "https://play.google.com/store/apps/details?id=com.snapfetti"; // Android app link

  // Serve HTML with JavaScript for redirection
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Redirecting...</title>
    </head>
    <body>
      <p>Redirecting to the app...</p>
      <script type="text/javascript">
        // Attempt to open the app link
        window.location.href = "${appLink}";
        
        // Fallback to the app store after a delay if app link fails
        setTimeout(() => {
          window.location.href = "${appStoreLink}";
        }, 2000);
      </script>
    </body>
    </html>
  `);
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

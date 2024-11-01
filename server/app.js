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
  // res.status(200).json({ message: "Server Running" });
  // res.status(304).json({ message: "Server Running" });
  res.redirect("/app");
});
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server Running" });
});

app.get("/app", (req, res) => {
  const eventID = req.query.eventID;
  const role = req.query.role;

  const appLink = `snapfetti://app?eventID=${eventID}&role=${role}`;
  const playStoreLink =
    "https://play.google.com/store/apps/details?id=com.snapfetti"; // Android app link
  const appStoreLink = "https://apps.apple.com/us/app/snapfetti/id6478379770"; // Replace with your App Store link

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
        // Function to detect if the user is on iOS or Android
        function getMobileOperatingSystem() {
          const userAgent = navigator.userAgent || navigator.vendor || window.opera;
          if (/android/i.test(userAgent)) {
            return "android";
          } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "ios";
          }
          return "other";
        }

        // Redirect to app
        const os = getMobileOperatingSystem();
        setTimeout(function() {
          window.location.href = "${appLink}";
        }, 100);

        // Fallback based on device OS
        setTimeout(function() {
          if (os === "android") {
            window.location.href = "${playStoreLink}";
          } else if (os === "ios") {
            window.location.href = "${appStoreLink}";
          } else {
            window.location.href = "https://example.com"; // A fallback URL for other devices
          }
        }, 10000); // Adjust delay as needed
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

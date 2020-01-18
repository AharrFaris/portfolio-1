const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();
const path = require("path");

require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ origin: 'http://localhost:3000' /* your in production cline tURL */, credentials: true }));

app.all("/", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get("/api", (req, res) => {
  res.send("API server: running");
});

app.post("/api/form", async (req, res) => {

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: process.env.NODEMAILER_ADDRESS,
      pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: req.body.name,
    to: process.env.NODEMAILER_ADDRESS,
    replyTo: req.body.email,
    subject: `${req.body.name}, from my Portfolio Site`,
    text: req.body.message
  };

  await transporter.sendMail(mailOptions, function(err, data) {
    if (err) {
      console.log("Error: ", err);
    } else {
      console.log("Email sent successfully");
    }
  });

  await res.status(200).json({ msg: 'eMAil_sEnT' })

});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

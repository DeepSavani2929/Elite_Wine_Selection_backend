require("dotenv").config();
require("./config/dbConnect.js");

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;

const router = require("./routes/index.js");
const webHookForPayment = require("./controllers/webHookController.js");

// 1️⃣ Stripe Webhook MUST be FIRST and RAW
app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  webHookForPayment
);

// 2️⃣ Parse JSON normally for all other routes
app.use(express.json());

// 3️⃣ CORS AFTER express.json() to avoid interfering with webhook
app.use(cors());

// Static + API routes
app.use("/images", express.static("public/images"));
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

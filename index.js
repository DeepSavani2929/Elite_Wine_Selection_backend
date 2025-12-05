require("dotenv").config();
require("./config/dbConnect.js");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
const router = require("./routes/index.js");
const webHookForPayment = require("./controllers/webHookController.js");

app.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  webHookForPayment
);

app.use(express.json());
app.use(cors());
app.use("/images", express.static("public/images"));
app.use("/api", router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

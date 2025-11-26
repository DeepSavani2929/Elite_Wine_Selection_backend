require('dotenv').config()
require('./config/dbConnect.js')
const express = require("express");
const app = express();
const port = process.env.PORT || 4000
const router = require("./routes/index.js")

app.use(express.json())
app.use("/api", router)

app.listen(port, () => {
    console.log(`Server started at ${port}`)
})
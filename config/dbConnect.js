const mongoose = require("mongoose")

const {MONGO_URL} = process.env;
mongoose.connect(MONGO_URL).then(() => {
    console.log('Connected to Database!')
}).catch((error) => {
    console.log(error)
})
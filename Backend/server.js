require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

// console.log("Loaded MONGO_URI:", process.env.MONGO_URI);
connectToDB()


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})
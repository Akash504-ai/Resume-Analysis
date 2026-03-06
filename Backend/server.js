import "dotenv/config";
import app from "./src/app.js";
import connectToDB from "./src/config/database.js";

connectToDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
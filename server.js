const mongoose = require("mongoose");
const app = require("./app");

const dbpath = process.env.MONGO_SECRET;
const port = process.env.PORT;

if (!dbpath) {
  console.error("No db secret...");
}

mongoose
  .connect(dbpath)
  .then(() => app.listen(port), console.log("Database connection successful"))
  .catch(() => {
    console.log("Connection error");
    process.exit(1);
  });

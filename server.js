const mongoose = require("mongoose");
const app = require("./app");
const {
  createFolderIfNotExist,
  UPLOAD_DIRECTORY,
  AVATAR_DIRECTORY,
} = require("./common/upload");

const dbpath = process.env.MONGO_SECRET;
const port = process.env.PORT;

if (!dbpath) {
  console.error("No db secret...");
}

mongoose
  .connect(dbpath)
  .then(() => {
    app.listen(port, () => {
      createFolderIfNotExist(AVATAR_DIRECTORY);
      createFolderIfNotExist(UPLOAD_DIRECTORY);
      console.log("Database connection successful");
    });
  })
  .catch(() => {
    console.log("Connection error");
    process.exit(1);
  });

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_DB_CONNECTION_STRING;
    await mongoose
      .connect(mongoURI)
      .then(() => console.log("MongoDB Atlas connected succesfully"));
  } catch (err) {
    console.error("Mongo Atlas connection error: ", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

module.exports = {
  JWT_SECRET,
  MONGODB_URI,
  PORT,
};

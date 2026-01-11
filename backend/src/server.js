require("dotenv").config();
require("./config/env"); // validate/load env once

const express = require("express");
const connectDB = require("./config/db");
const env = require("./config/env");
const admin = require("./config/firebaseAdmin"); // <- require commonjs export

connectDB();

const app = express();
app.use(express.json());
app.use("/api/ai", require("./routes/ai.route"));

admin
  .auth()
  .listUsers(1)
  .then(() => console.log("Firebase Admin OK"))
  .catch(console.error);

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

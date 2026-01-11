require("dotenv").config();
require("./config/env"); // validate/load env once

const express = require("express");
const connectDB = require("./config/db");
const env = require("./config/env");

connectDB();

const app = express();
app.use(express.json());
app.use("/api/ai", require("./routes/ai.route"));

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});

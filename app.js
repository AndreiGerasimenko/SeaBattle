const express = require("express");
const config = require("config");
const mongoose = require("mongoose");

const app = express();
const expressWs = require('express-ws')(app);

app.use(express.json());
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/game", require("./routes/gameWs.routes"));
app.use("/api/globalWs", require("./routes/globalWs.routes"));
app.use(
  "/api/statistic", 
  require("./middleware/auth.middleware"),
  require("./routes/stitistic.routes"));

const PORT = config.get("port") || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => {
      console.log(`Server has been started on port ${PORT}...`);
    });
  } catch (error) {
    console.log("Server error", error.message);
    process.exit(1);
  }
}

start();


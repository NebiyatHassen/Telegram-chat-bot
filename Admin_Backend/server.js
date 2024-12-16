const express = require("express");

const mongoose = require("mongoose");

const url = "mongodb://0.0.0.0:27017/Dereja";
const app = express();
mongoose
  .connect(url, {})
  .then((_result) => console.log("database connected"))
  .catch((err) => console.log(err));

const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const campaignRoutes = require("./routes/campaignRoutes");
const trainingRoutes = require("./routes/training");
const jobfairRoutes = require("./routes/jobfairRoutes");
const userRoutes = require("./routes/auth");

app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/campaign", campaignRoutes);
app.use("/api/jobfair", jobfairRoutes);
app.use("/api/admin", userRoutes);
app.use("/api/training", trainingRoutes);

app.listen(3001, () => {
  console.log("Node API App is running on port 3001 ");
});

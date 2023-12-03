const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const urlsRoute = require("./routes/urlsRoute");
const authRoute = require("./routes/authRoute");
const { visitLink } = require("./controllers/urlsController");

// Cors
app.use(cors());

// Parse JSON
app.use(express.json());

// Middlewares
app.use(helmet());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/urls", urlsRoute);
app.get("/:identifer", visitLink);

// Connect To MongoDB
require("./config/db");

// Run Server
const PORT = process.env.PORT || 8000;

app.listen(PORT, (error) => {
  if (error) throw error;

  console.log(`App is running on port ${PORT}`);
});

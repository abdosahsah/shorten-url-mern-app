const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })

  .then(() => console.log("MongoDB Connected!"))

  .catch((error) => {
    console.log("Unable to connect to MongoDB");
    console.log(error);
  });

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();


// middleware
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello Students...!");
});

app.listen(port, () => {
  console.log(`Summer is running on port ${port}`);
});

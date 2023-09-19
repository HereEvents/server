require("dotenv").config();
require("./DL/db").connect();
const mainRouter = require("./Routes");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const fs = require("fs");


app.use(express.json());
app.use(cors());
app.use("/upload", express.static("./upload"));

app.use("/api", mainRouter);

// app.get("/k",(req,res)=>{
// res.send("hello world")
// });
app.listen(PORT, () => {
  if (!fs.existsSync("./upload")) fs.mkdirSync("./upload");
  console.log("Server is running : listening to port " + PORT);
});

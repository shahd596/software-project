const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./route/user");
const adminRoute = require("./route/admins");
const authRoute = require("./route/auth");
const productRoute = require("./route/product");
const orderRoute = require("./route/order");
const cors = require("cors");
const morgan = require("morgan");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });


app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use('/', express.static('frontend'));

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running!");
});


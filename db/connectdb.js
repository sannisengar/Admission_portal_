const mongoose = require("mongoose");
const Local_Url = "mongodb://127.0.0.1:27017/admission_portal";
const Live_url =
  "mongodb+srv://sannisingh432:ram123@cluster0.gcmhm.mongodb.net/admission_portal?retryWrites=true&w=majority&appName=Cluster0";

const connectDb = () => {
  return mongoose
    .connect(Live_url)
    .then(() => {
      console.log("Connect Success");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectDb;

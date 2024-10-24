const UserModel = require("../../moduls/user");
const cloudinary = require("cloudinary").v2;
const courseModel = require("../../moduls/course");
const nodemailer = require("nodemailer");

cloudinary.config({
  cloud_name: "dfn3cwjzd",
  api_key: "159522275348279",
  api_secret: "VREtUZQ9mfY07EKCY-jGMBPfnVY", // Click 'View API Keys' above to copy your API secret
});

class AdminController {

  static deshboard = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("admin/deshboard", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static display = async (req, res) => {
    try {
      const { name, image, id } = req.userData;
      const data = await UserModel.find({ role: "user" });
      const data1 = await courseModel.findOne({ user_id: id });
      // console.log(data1);
      // console.log(data)
      res.render("admin/display", { d: data, n: name, i: image, d1: data1 });
    } catch (error) {
      console.log(error);
    }
  };
  static Adduser = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("admin/adduser", { n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static viewUser = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const id = req.params.id;
      //console.log(id)
      const data = await UserModel.findById(id);
      //console.log(data)
      res.render("admin/viewUser", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static EditUser = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const id = req.params.id;
      //console.log(id)
      const data = await UserModel.findById(id);
      //console.log(data)
      res.render("admin/EditUser", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static UpdateUser = async (req, res) => {
    try {
      const id = req.params.id;
      const { n, e, p } = req.body;
      // console.log(id)
      const data = await UserModel.findByIdAndUpdate(id, {
        name: n,
        email: e,
        password: p,
      });
      // console.log(data)
      res.redirect("/admin/studentDiasplay");
    } catch (error) {
      console.log(error);
    }
  };
  static deleteUser = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      const data = await UserModel.findByIdAndDelete(id);
      res.redirect("/admin/studentDiasplay");
    } catch (error) {
      console.log(error);
    }
  };
  static userInsert = async (req, res) => {
    try {
      // console.log(req.body)
      const file = req.files.image;
      // console.log(file)
      const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profile",
      });
      // console.log(imageUpload)
      const { n, e, p, cp } = req.body;
      const result = new UserModel({
        name: n,
        email: e,
        password: p,
        confirmpassword: cp,
        image: {
          public_id: imageUpload.public_id,
          url: imageUpload.secure_url,
        },
      });
      await result.save();
      res.redirect("/admin/studentDiasplay"); // redirect me hamesa rout ka url dete h
    } catch (error) {
      console.log(error);
    }
  };
  static courseDiasplay = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const data = await courseModel.find();
      // console.log(data)
      res.render("admin/course/Display", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseView = async (req, res) => {
    try {
      const { name, image } = req.userData;
      const id = req.params.id;
      // console.log(id)
      const data = await courseModel.findById(id);
      // console.log(data)
      res.render("admin/course/View", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseDelete = async (req, res) => {
    try {
      const id = req.params.id;
      // console.log(id)
      const data = await courseModel.findByIdAndDelete(id);
      res.redirect("/admin/courseDiasplay");
    } catch (error) {
      console.log(error);
    }
  };
  static statusUpdate = async (req, res) => {
    try {
      const { name, email, status, comment } = req.body;
      const id = req.params.id;
      await courseModel.findByIdAndUpdate(id, {
        status: status,
        Comment: comment,
      });
      // console.log(data)
      this.sendEmail(name, email, status, comment);
      res.redirect("/admin/courseDiasplay");
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name, email, status, comment) => {
    // console.log(name, email, status, comment);
    //  connect with the smtp server
    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "sannisingh432@gmail.com",
        pass: "cepfmpqxabfxrknj",
      },
    });
    let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receiver
      subject: `Status ${status}`, // Subject line
      text: "hello", // plain text body
      html: `<b>${name}</b>  Course <b> ${status}</b>  successful !<br>
      <b> Comment from Admin</b> ${comment}`, // html body
    });
  };
}
module.exports = AdminController;

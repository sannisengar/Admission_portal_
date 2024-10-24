
const courseModel = require("../moduls/course");
const UserModel = require("../moduls/user");
const nodemailer = require("nodemailer");

class courseController {

  static courseInsert = async (req, res) => {
    try {
      const { id } = req.userData;
      const {
        name,
        email,
        phone,
        dob,
        address,
        gender,
        Qualification,
        course,
      } = req.body;
      const result = new courseModel({
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        address: address,
        gender: gender,
        Qualification: Qualification,
        course: course,
        user_id: id,
      });
      await result.save();
      this.sendEmail(name, email, course);
      res.redirect("/courseDisplay");
    } catch (error) {
      console.log(error);
    }
  };
  static courseDisplay = async (req, res) => {
    try {
      const { id, name, image } = req.userData;
      const data = await courseModel.find({ user_id: id });
      // console.log(data)
      res.render("course/Display", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseView = async (req, res) => {
    try {
      const { email, name, image } = req.userData;
      const id = req.params.id;
      const data = await courseModel.findById(id);
      // console.log(data)
      res.render("course/View", { d: data, e: email, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseEdit = async (req, res) => {
    try {
      const { name, image } = req.userData;
      // console.log(id)
      const id = req.params.id;
      const data = await courseModel.findById(id);
      // console.log(data)
      res.render("course/edit", { d: data, n: name, i: image });
    } catch (error) {
      console.log(error);
    }
  };
  static courseUpdate = async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        dob,
        address,
        gender,
        Qualification,
        course,
      } = req.body;
      const id = req.params.id;
      const update = await courseModel.findByIdAndUpdate(id, {
        name: name,
        email: email,
        phone: phone,
        dob: dob,
        address: address,
        gender: gender,
        Qualification: Qualification,
        course: course,
      });
      res.redirect("/courseDisplay");
    } catch (error) {
      console.log(error);
    }
  };
  static sendEmail = async (name, email, course) => {
    // console.log(name, email, course )
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
      subject: `Course ${course}`, // Subject line
      text: "hello", // plain text body
      html: `<b>${name}</b>  Course <b> ${course}</b> insert successful !<br>`, // html body
    });
    };
    
}
module.exports = courseController;

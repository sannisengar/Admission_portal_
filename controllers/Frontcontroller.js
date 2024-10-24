const UserModel = require("../moduls/user");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const courseModel = require("../moduls/course");

cloudinary.config({
  cloud_name: "dfn3cwjzd",
  api_key: "159522275348279",
  api_secret: "VREtUZQ9mfY07EKCY-jGMBPfnVY", // Click 'View API Keys' above to copy your API secret
});

class Frontcontroller {
  static home = async (req, res) => {
    try {
      const { name, image, email, id, role } = req.userData;
      const btech = await courseModel.findOne({ user_id: id, course: "btech" });
      const bca = await courseModel.findOne({ user_id: id, course: "bca" });
      const mca = await courseModel.findOne({ user_id: id, course: "mca" });
      res.render("home", {
        n: name,
        i: image,
        e: email,
        btech: btech,
        bca: bca,
        mca: mca,
        r: role,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static about = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("about", {
        n: name,
        i: image,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static login = async (req, res) => {
    try {
      res.render("login", {
        msg: req.flash("Success"),
        msg1: req.flash("error"),
      });
    } catch (error) {
      console.log(error);
    }
  };
  static verifylogin = async (req, res) => {
    try {
      // console.log(req.body)
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user != null) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          if (user.role == "admin") {
            //token create
            var token = jwt.sign(
              { ID: user._id },
              "singh12345678sanni54321sengar67890"
            );
            // console.log(token)
            res.cookie("token", token);
            res.redirect("/admin/deshboard");
          }
          if (user.role == "user") {
            //token create
            var token = jwt.sign(
              { ID: user._id },
              "singh12345678sanni54321sengar67890"
            );
            // console.log(token)
            res.cookie("token", token);
            res.redirect("/home");
          }
        } else {
          req.flash("error", "Email or password is not valid.");
          res.redirect("/");
        }
      } else {
        req.flash("error", "you are not a register user.");
        res.redirect("/");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static register = async (req, res) => {
    try {
      res.render("register", { message: req.flash("error") });
    } catch (error) {
      console.log(error);
    }
  };
  static contact = async (req, res) => {
    try {
      const { name, image } = req.userData;
      res.render("contact", {
        n: name,
        i: image,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static userInsert = async (req, res) => {
    try {
      // console.log(req.body)
      // console.log(req.files)

      const { n, e, p, cp } = req.body;
      const user = await UserModel.findOne({ email: e });
      if (user) {
        req.flash("error", "email allready exgist");
        res.redirect("/register");
      } else {
        if (n && e && p && cp) {
          if (p == cp) {
            const hashPassword = await bcrypt.hash(p, 10);
            const file = req.files.image;
            //console.log(file)
            const imageUpload = await cloudinary.uploader.upload(
              file.tempFilePath,
              {
                folder: "profile",
              }
            );
            // console.log(imageUpload)
            const result = new UserModel({
              name: n,
              email: e,
              password: hashPassword,
              image: {
                public_id: imageUpload.public_id,
                url: imageUpload.secure_url,
              },
            });
            await result.save();
            req.flash("Success", "Register Successfull");
            res.redirect("/"); // redirect me hamesa rout ka url dete h
          } else {
            req.flash("error", "password & confirmpassword must be same.");
            res.redirect("/register");
          }
        } else {
          req.flash("error", " all fields are required");
          res.redirect("/register");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  static logout = (req, res) => {
    try {
      // res.send("contact page")
      res.clearCookie("token");
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };
  static profile = (req, res) => {
    try {
      const { name, image, email } = req.userData;
      res.render("profile", {
        n: name,
        i: image,
        e: email,
      });
    } catch (error) {
      console.log(error);
    }
  };
  static changePassword = async (req, res) => {
    try {
      const { id } = req.userData;
      // console.log(req.body)
      const { op, np, cp } = req.body;
      if (op && np && cp) {
        const user = await UserModel.findById(id);
        const isMatched = await bcrypt.compare(op, user.password);
        // console.log(isMatched)
        if (!isMatched) {
          req.flash("error", "Current password is incorrect");
          res.redirect("/profile");
        } else {
          if (np != cp) {
            req.flash("error", "newpassword or confirmpassword does not match");
            res.redirect("/profile");
          } else {
            const newHashPasswoed = await bcrypt.hash(np, 10);
            await UserModel.findByIdAndUpdate(id, {
              password: newHashPasswoed,
            });
            req.flash("success", "Password Updated successfully");
            res.redirect("/");
          }
        }
      } else {
        req.flash("error", "all fields are required");
        res.redirect("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  static updateProfile = async (req, res) => {
    try {
      const { id } = req.userData;
      const { name, email } = req.body;
      if (req.files) {
        const user = await UserModel.findById(id);
        const imageId = user.image.public_id;
        // console.log(imageId)
        // delete image from cloudinary
        await cloudinary.uploader.destroy(imageId);
        // new image update
        const imagefile = req.files.image;
        const imageUpload = await cloudinary.uploader.upload(
          imagefile.tempFilePath,
          {
            folder: "userprofile",
          }
        );
        var data = {
          name: name,
          email: email,
          image: {
            public_id: imageUpload.public_id,
            url: imageUpload.secure_url,
          },
        };
      } else {
        var data = {
          name: name,
          email: email,
        };
      }
      await UserModel.findByIdAndUpdate(id, data);
      req.flash("success", "update profile successfully");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = Frontcontroller;

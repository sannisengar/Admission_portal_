const express = require("express");
const Frontcontroller = require("../controllers/Frontcontroller");
const AdminController = require("../controllers/admin/AdminController");
const checkAuth = require("../middleware/checkAuth");
const courseController = require("../controllers/coursecontroller");
const authRoles = require("../middleware/adminrole");
const isLogin = require("../middleware/islogin");

const route = express.Router();

//front controller
route.get("/home", checkAuth, Frontcontroller.home);
route.get("/about", checkAuth, Frontcontroller.about);
route.get("/", Frontcontroller.login);
route.get("/register", Frontcontroller.register);
route.get("/contact", checkAuth, Frontcontroller.contact);
//profile
route.get("/profile", checkAuth, Frontcontroller.profile);
route.post("/changePassword", checkAuth, Frontcontroller.changePassword);
route.post("/updateProfile", checkAuth, Frontcontroller.updateProfile);
//data insert
route.post("/userInsert", Frontcontroller.userInsert);
route.post("/verifylogin", Frontcontroller.verifylogin);
route.get("/logout", Frontcontroller.logout);

//admin controller
route.get("/admin/deshboard", checkAuth, AdminController.deshboard);
route.get("/admin/studentDiasplay", checkAuth, AdminController.display);
route.get("/admin/adduser", checkAuth, AdminController.Adduser);
route.get("/admin/viewUser/:id", checkAuth, AdminController.viewUser);
route.get("/admin/EditUser/:id", checkAuth, AdminController.EditUser);
route.post("/admin/UpdateUser/:id", checkAuth, AdminController.UpdateUser);
route.get("/admin/deleteUser/:id", AdminController.deleteUser);
route.post("/admin/userInsert", AdminController.userInsert);
// admin course controller
route.get("/admin/courseDiasplay", checkAuth, AdminController.courseDiasplay);
route.get("/admin/courseView/:id", checkAuth, AdminController.courseView);
route.get("/admin/courseDelete/:id", AdminController.courseDelete);
//status update
route.post("/admin/statusUpdate/:id", checkAuth, AdminController.statusUpdate);

//courseController
route.post("/courseInsert", checkAuth, courseController.courseInsert);
route.get("/courseDisplay", checkAuth, courseController.courseDisplay);
route.get("/courseView/:id", checkAuth, courseController.courseView);
route.get("/courseEdit/:id", checkAuth, courseController.courseEdit);
// route.get('/courseDelete/:id',courseController.courseDelete)
route.post("/courseUpdate/:id", checkAuth, courseController.courseUpdate);

module.exports = route;

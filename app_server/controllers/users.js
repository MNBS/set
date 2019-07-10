const request = require("request");
const { apiOptions } = require("../../config/apiOptions");

const { getForm } = require("./forms");
const { getSession } = require("./session");

const APIUsers = require('../../app_api/controllers/users')

const renderUserList = (req, res, responseBody) => {
  res.render("userAdmin", {
    users: responseBody
  });
};

const renderUserForm = (req, res, responseBody) => {
  getSession(req, res).then((sessionProfile) => {
    getForm(req, res).then((formsData) => {
      responseBody.form = formsData.userForm;
      res.render("userForm", {
        user: responseBody,
        sessionProfile: sessionProfile
      });
    })
  })
};

// Get list of users
const userList = (req, res) => {
  paramString = req.param("userFilter");
  APIUsers.listUsers(req, res, paramString).then((body) => {
    renderUserList(req, res, body);
  })
};

// Get 'Add User' form
const addUser = (req, res) => {
  res.render("userForm");
};

// Submit new user
const addUserSubmit = (req, res) => {
  APIUsers.userCreate(req, res).then(() => {
    userList(req, res);
  })
};

// Prepopulate user edit form
const getUser = (req, res) => {
  paramString = req.params.userId;
  APIUsers.getUser(req, res, paramString).then((body) => {
    renderUserForm(req, res, body);
  })
};

// Submit user edits
const editUser = (req, res) => {
  let role = "";
  if (req.body.role === undefined) {
    role = "User";
  }
  paramString = {
    userId: req.params.userId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: role || req.body.role,
    status: req.body.status
  };
  APIUsers.editUser(req, res, paramString).then(() => {
    res.redirect("/users");
  });
};

module.exports = {
  userList,
  addUser,
  addUserSubmit,
  getUser,
  editUser
};

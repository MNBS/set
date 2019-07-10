const mydb = require("../models/db");

const listUsers = (req, res, paramString) => {
  return new Promise((resolve, reject) => {
    mydb.listUsers(paramString, res).then((body) => {
      resolve(body);
    })
  })
};

const userCreate = (req, res) => {
  return new Promise((resolve, reject) => {
    const newUser = {};
    newUser["firstName"] = req.body.firstName;
    newUser["lastName"] = req.body.lastName;
    newUser["email"] = req.body.email.toLowerCase();
    newUser["role"] = req.body.role;
    newUser["status"] = req.body.status;
    newUser["mediaCount"] = 0;
    newUser["media"] = [];
    mydb.userCreate(newUser).then((body) => {
      resolve(body);
    });
  })
};

const getUser = (req, res, userString) => {
  return new Promise((resolve, reject) => {
    mydb.getUser(userString).then(data => {
      resolve(data);
    });
  }) 
};

const editUser = (req, res, paramString) => {
  return new Promise((resolve, reject) => {
    mydb.editUser(req, res, paramString).then(data => {
      resolve(data);
    });
  });
 };

module.exports = {
  listUsers,
  userCreate,
  getUser,
  editUser
};

const mydb = require("../models/db");

const getAPIForm = (req, res) => {
  return new Promise((resolve, reject) => {
    mydb.listForm(req, res).then((body) => {
      resolve(body);
    })
  })
};

const addFormOption = (req, res) => {
  let prom = mydb.addFormOption(req, res); //get the response from db for when it   
  prom.then((success) => {
    console.log("success");
    return res.sendStatus(200);
  },
    (reject) => {
      console.log("reject.");
      console.log(reject);
      return res.sendStatus(500);
  })
}

module.exports = {
  getAPIForm,
  addFormOption
};

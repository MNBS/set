const request = require('request');
const {apiOptions} = require('../../config/apiOptions')

const { getAPIForm } = require('../../app_api/controllers/forms')

// Get the data to populate form
const getForm = (req, res) => {
  return new Promise((resolve, reject) => {
    getAPIForm(req, res).then((data) => {
      formsData = {}
      data.forEach((form) => {
        if (form.formType == "Media") {
          formsData.mediaForm = form
        } else if (form.formType == "User") {
          formsData.userForm = form
        }
      })
      resolve(formsData);
    })
  })
}


// Edit the form data
const editForm = (req, res) => {
  const path = '/api/forms';
  const requestOptions = {
    url: `${apiOptions.server}${path}`,
    method: 'GET',
    json: {}
  };
  request(requestOptions, (err, response, body) => {

  })
}

module.exports = {
    getForm,
    editForm
}

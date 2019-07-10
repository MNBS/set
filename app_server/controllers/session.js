const request = require('request');
const {apiOptions} = require('../../config/apiOptions')

const APIUsers = require('../../app_api/controllers/users')

// Get the profile for W3ID email
const getSession = (req, res) => {
  return new Promise((resolve, reject) => {
    sessionProfile = {
      sessionId: req.session.APPID_AUTH_CONTEXT.identityTokenPayload.email.toLowerCase()
    }
    APIUsers.listUsers(req, res).then((body) => {
      body.forEach((user) => {
        if (sessionProfile.sessionId == user.email) {
          sessionProfile.role = user.role;
        }
      })
      resolve(sessionProfile);
    })
  })
}

module.exports = {
    getSession
}
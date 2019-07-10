const mydb = require("../models/db");

function user(userId) {
  return mydb.getUser(userId);
}

const listMedia = (paramString, req, res) => {
  return new Promise((resolve, reject) => {
    queryString = paramString;
    mydb.listMedia(queryString, res).then((body) => {
      resolve(body);
    });
  });
};

const mediaCreate = (req, res) => {
  return new Promise((resolve, reject) => {
    mydb.createMedia(req, res).then((body) => {
      resolve(body);
    });
  })
};

const getMedia = (req, res, paramString) => {
  return new Promise((resolve, reject) => {
    userString = paramString.user
    mediaString = paramString.media
    user(userString).then(function(data, err) {
      data.media.forEach(element => {
        if (element._mediaId == mediaString) {
          // editMedia requires userId
          element.user = userString;
          resolve(element);
        }
      });
    })
  });
};

 const editMedia = (paramString, req, res) => {
  return new Promise((resolve, request) => {
    userString = paramString.user;
    mediaString = paramString.media;
 
    user(userString).then(data => {
      // filter and replace based on mediaId
      let index = data["media"].findIndex(
        entry => entry._mediaId == mediaString
      );
      if (index != -1) {
        data["media"][index] = mydb.mediaObject(req.body);
        mydb
          .put(data)
          .then(response => {
            console.log("Successfully updated.");
            resolve({ status: "success", msg: "" });
            // res.status(200).send();
          })
          .catch(err => {
            console.log(err);
            resolve({ status: "failure", msg: "Unable to update server." });
            // res.status(500).send("Unable to update server.");
          });
      } else {
        console.warn("media that was edited is not found in db.");
        resolve({ status: "failure", msg: "Unable to update server." });
        // res.status(500).send("Unable to update server");
      }
    });
  });
 };
 
 const deleteMedia = (paramString, req, res) => {
  return new Promise((resolve, reject) => {
    userString = paramString.user;
    mediaString = paramString.media;
    user(userString).then(data => {
      let index = data["media"].findIndex(
        entry => entry._mediaId == mediaString
      );
      if (index != -1) {
        data["media"].splice(index, 1);
        mydb
          .put(data)
          .then(response => {
            console.log("Successfully deleted.");
            resolve({ status: "success", msg: "" });
            // res.status(200).send();
          })
          .catch(err => {
            console.log(err);
            // res.status(500).send("unable to delete media.");
            resolve({ status: "failure", msg: "Unable to delete media" });
          });
      } else {
        console.warn("cannot find media.");
      }
    });
  });
 };

module.exports = {
  listMedia,
  mediaCreate,
  getMedia,
  editMedia,
  deleteMedia
};

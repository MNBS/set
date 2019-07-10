module.exports = function(express) {
  const router = express.Router();
  const ctrlMedia = require("../controllers/media");
  const ctrlUsers = require("../controllers/users");
  const ctrlForm = require("../controllers/forms");
  
  // Media
  // router
  //   .route("/media")
  //   .get(ctrlMedia.listMedia)
  //   .post(ctrlMedia.mediaCreate);

  // router
  //   .route("/media/:mediaId")
  //   .get(ctrlMedia.getMedia)
  //   .post(ctrlMedia.editMedia)
  //   .delete(ctrlMedia.deleteMedia);

  // Users
  // router
  //   .route("/users")
  //   .get(ctrlUsers.listUsers)
  //   .post(ctrlUsers.userCreate);

  // router
  //   .route("/users/:userId")
  //   .get(ctrlUsers.getUser)
  //   .post(ctrlUsers.editUser)

  // // Form data
  // router
  //   .route("/forms")
  //   .get(ctrlForm.getForm)
  //   .post(ctrlForm.addFormOption)

  return router;
}
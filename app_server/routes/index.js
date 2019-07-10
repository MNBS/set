const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;

//console.log(req.session.APPID_AUTH_CONTEXT.identityTokenPayload.email);

module.exports = function(app, express, passport) {
  const router = express.Router();
  const ctrlMedia = require("../controllers/media");
  const ctrlUsers = require("../controllers/users");

  /* Media pages */
  router.get("/", (req, res) => {
    res.redirect("/auth/W3ID")
  })
  router.get("/home", isLoggedIn, ctrlMedia.homeList);
  router.get("/media/new", isLoggedIn, ctrlMedia.addMedia);
  router.post("/media/new/submit", isLoggedIn, ctrlMedia.addMediaSubmit);
  router.get(
    "/user/:userId/media/:mediaId/edit",
    isLoggedIn,
    ctrlMedia.getMedia
  );
  router.post(
    "/user/:userId/media/:mediaId/edit/submit",
    isLoggedIn,
    ctrlMedia.editMedia
  );
  router.get(
    "/user/:userId/media/:mediaId/delete",
    isLoggedIn,
    ctrlMedia.deleteMedia
  );

  /* User pages */
  router.get("/users", isLoggedIn, ctrlUsers.userList);
  router.get("/user/new", isLoggedIn, ctrlUsers.addUser);
  router.post("/user/new/submit", isLoggedIn, ctrlUsers.addUserSubmit);
  router.get("/user/:userId/edit", isLoggedIn, ctrlUsers.getUser);
  router.post("/user/:userId/edit/submit", isLoggedIn, ctrlUsers.editUser);

  /* Download CSV route */
  router.get("/csv", isLoggedIn, ctrlMedia.getCsv);

  router.get(
    "/auth/W3ID",
    passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
      successRedirect: "/home",
      forceLogin: true
    })
  );

  router.get(
    "/ibm/bluemix/appid/callback",
    passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
      successRedirect: "/home"
    })
  );

  return router;
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/W3ID");
}

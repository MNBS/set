// Specify the strategy for passport to use
const WebAppStrategy = require("ibmcloud-appid").WebAppStrategy;

// load the auth variables
const configAuth = require("./auth");

module.exports = function(passport) {
  // Sessions
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    done(null, id);
  });

  passport.use(
    new WebAppStrategy({
      clientId: configAuth.W3ID.clientId,
      tenantId: configAuth.W3ID.tenantId,
      secret: configAuth.W3ID.secret,
      name: configAuth.W3ID.name,
      oAuthServerUrl: configAuth.W3ID.oAuthServerUrl,
      profilesUrl: configAuth.W3ID.profilesUrl,
      discoveryEndpoint: configAuth.W3ID.discoveryEndpoint,
      redirectUri: configAuth.W3ID.redirectUri
    })
  );
};

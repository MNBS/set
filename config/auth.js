const { apiOptions } = require('./apiOptions');

let CALLBACK_URL = "/ibm/bluemix/appid/callback";

module.exports = {

    W3ID : {
        clientId: "053bc3bf-0807-43ef-ae66-635cf9713160",
        tenantId: "16f67837-6f1b-435b-9128-bd45bd1f19d3",
        secret: "M2Q0NWZkOTYtOTMxNy00OWEwLWFjYTItOWM1YTFjYjFlMjgz",
        name: "SETA",
        oAuthServerUrl: "https://jp-tok.appid.cloud.ibm.com/oauth/v4/16f67837-6f1b-435b-9128-bd45bd1f19d3",
        profilesUrl: "https://jp-tok.appid.cloud.ibm.com",
        discoveryEndpoint: "https://jp-tok.appid.cloud.ibm.com/oauth/v4/16f67837-6f1b-435b-9128-bd45bd1f19d3/.well-known/openid-configuration",
        redirectUri: apiOptions.server + CALLBACK_URL
    }

};
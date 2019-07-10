const { apiOptions } = require("../../config/apiOptions");
const APIMedia = require("../../app_api/controllers/media");

const { getForm } = require("./forms");
const { getSession } = require("./session");
// Page render functions
const renderHomepage = (req, res, responseBody) => {
  sessionProfile = {
    sessionId: req.session.APPID_AUTH_CONTEXT.identityTokenPayload.email.toLowerCase()
  };
  responseBody.forEach(user => {
    if (sessionProfile.sessionId == user.email) {
      sessionProfile.role = user.role;
    }
  });
  getForm(req, res).then((formsData) => {
    responseBody.form = formsData.mediaForm;
    res.render("index", {
      users: responseBody,
      sessionProfile: sessionProfile
    });
  })
};

const renderResults = (req, res, responseBody) => {
  getForm(req, res).then((formsData) => {
    responseBody.users.form = formsData.mediaForm;
    res.render("index", {
      result: responseBody.result,
      users: responseBody.users,
    });
  })
};

const renderMediaForm = (req, res, responseBody) => {
  getForm(req, res).then((formsData) => {
    responseBody.form = formsData.mediaForm;
    res.render("addMedia", {
      media: responseBody
    });
  })
};

// return to main page after edit or delete.
const returnToHomeList = (req, res, result) => {
  paramString = req.param("filter");
  APIMedia.listMedia(paramString, req, res).then(body => {
    console.log(body);
    let temp = { users: body, result: result };
    renderResults(req, res, temp);
  });
};

// Get list for main page
const homeList = (req, res) => {
  paramString = req.param("filter");
  APIMedia.listMedia(paramString, req, res).then(body => {
    renderHomepage(req, res, body);
  });
};

// Get 'Add media' page
const addMedia = (req, res) => {
  paramString = req.param("filter");
  getSession(req, res).then((sessionProfile) => {
    APIMedia.listMedia(paramString, req, res).then(body => {
      let mediaPostCount = 0;
      console.log(body);
      body.forEach(data => {
        if (data.email === sessionProfile.sessionId) {
          mediaPostCount = data.mediaCount + 1;
        }
      });
      body.mediaPostCount = mediaPostCount;
      renderMediaForm(req, res, body);
    });
  }) 
};

const addMediaSubmit = (req, res) => {
  APIMedia.mediaCreate(req, res).then((body) => {
    res.redirect("/home")
  })
}

// Prepopulate edit form
const getMedia = (req, res) => {
  paramString = {
    user: req.params.userId,
    media: req.params.mediaId
  };
  APIMedia.getMedia(req, res, paramString).then((body) => {
    renderMediaForm(req, res, body);
  });
};

const editMedia = (req, res) => {
  paramString = {
    user: req.params.userId,
    media: req.params.mediaId
  };
  APIMedia.editMedia(paramString, req, res).then(body => {
    if (body) {
      if (body.status == "success") {
        result = "success";
      } else {
        result = "failure";
        console.log("Something went wrong.");
      }
    }
    returnToHomeList(req, res, result);
  });
 };
 
 const deleteMedia = (req, res) => {
  paramString = {
    user: req.params.userId,
    media: req.params.mediaId
  };
  APIMedia.deleteMedia(paramString, req, res).then(body => {
    var result = "error";
    if (body) {
      if (body.status == "success") {
        result = "success";
      } else {
        result = "failure";
        console.log("Something went wrong.");
      }
    }
    returnToHomeList(req, res, result);
  });
 };

const getCsv = (req, res) => {
  APIMedia.listMedia(paramString, req, res).then(body => {
    const fields = [];
    body.forEach(document => {
      document.media.forEach(singleMedia => {
        const getDocument = {
          "First Name": document.firstName,
          "Last Name": document.lastName,
          Email: document.email,
          Role: document.role,
          Market: singleMedia.market,
          "Business Unit": singleMedia.businessUnit,
          Title: singleMedia.title,
          "External Link": singleMedia.externalLink,
          "Social Eminence Type": singleMedia.socialEminenceType,
          "Media Status": singleMedia.status,
          Country: singleMedia.city,
          Date: singleMedia.date,
          Contributors: singleMedia.contributors
        };
        fields.push(getDocument);
      });
    });
    res.xls("data.xlsx", fields);
  });
};
module.exports = {
  homeList,
  addMedia,
  addMediaSubmit,
  getMedia,
  editMedia,
  deleteMedia,
  getCsv
};

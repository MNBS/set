require("dotenv").config();
var Cloudant = require("@cloudant/cloudant");

const db_data = JSON.parse(process.env.db_data);
let cloudant = Cloudant({
    account: db_data.username,
    password: db_data.password
  }),
  db = cloudant.db.use("seta_users"),
  formDb = cloudant.db.use("seta_forms"),
  mydb = {};

mydb.createMedia = (req, res) => {
  return new Promise((resolve, reject) => {
    db.list({ include_docs: true }).then(body => {
      body.rows.forEach(doc => {
        if (doc.doc.email === req.user.email.toLowerCase()) {
          const newMedia = mydb.mediaObject(req.body);
          doc.doc.media.push(newMedia);
          const user = doc.doc;
          user["mediaCount"] += 1;
          db.insert(user, (err, body) => {
            resolve(body); //TODO: Fix the UI/UX for this. this directly redirects to the home page.
          });
        }
      });
    });
  })
};

mydb.listMedia = (queryString, res) => {
  return new Promise((resolve, reject) => {
    const mediaList = [];
    if (queryString === undefined || queryString === "Default") {
      db.list({ include_docs: true }).then(body => {
        body.rows.forEach(doc => {
          mediaList.push(doc.doc);
        });
        resolve(mediaList);
      });
      return;
    }
    const market = [];
    const businessUnit = [];
    const country = [];
    const socialEminence = [];
    const name = [];
    db.list({ include_docs: true })
      .then(body => {
        body.rows.forEach(document => {
          if (name.indexOf(document.doc.firstName) <= -1) {
            name.push(document.doc.firstName);
          }
          document.doc.media.forEach(media => {
            if (market.indexOf(media.market) <= -1) {
              market.push(media.market);
            }
          });
          document.doc.media.forEach(bu => {
            if (businessUnit.indexOf(bu.businessUnit) <= -1) {
              businessUnit.push(bu.businessUnit);
            }
          });
          document.doc.media.forEach(coun => {
            if (country.indexOf(coun.city) <= -1) {
              country.push(coun.city);
            }
          });
          document.doc.media.forEach(seta => {
            if (socialEminence.indexOf(seta.socialEminenceType)) {
              socialEminence.push(seta.socialEminenceType);
            }
          });
        });
      })
      .then(data => {
        if (market.includes(queryString)) {
          const q = {
            selector: {
              media: { $elemMatch: { market: queryString } }
            },
            limit: 50
          };
          db.find(q).then(doc => {
            const returnFilter = [];
            doc.docs.forEach(filtered => {
              returnFilter.push(filtered);
            });
            resolve(returnFilter);
          });
          return;
        } else if (businessUnit.includes(queryString)) {
          const q = {
            selector: {
              media: { $elemMatch: { businessUnit: queryString } }
            },
            limit: 50
          };
          db.find(q).then(doc => {
            const returnFilter = [];
            const newMedia = [];
            doc.docs.forEach(filtered => {
              if (filtered.media.length > 1) {
                filtered.media.forEach(data => {
                  if (data.businessUnit === queryString) {
                    newMedia.push(data);
                  }
                  filtered.media = newMedia;
                });
              }
              returnFilter.push(filtered);
            });
            resolve(returnFilter);
          });
          return;
        } else if (country.includes(queryString)) {
          const q = {
            selector: {
              media: { $elemMatch: { city: queryString } }
            },
            limit: 50
          };
          db.find(q).then(doc => {
            const returnFilter = [];
            const newMedia = [];
            doc.docs.forEach(filtered => {
              if (filtered.media.length > 1) {
                filtered.media.forEach(data => {
                  if (data.city === queryString) {
                    newMedia.push(data);
                  }
                  filtered.media = newMedia;
                });
              }
              returnFilter.push(filtered);
            });
            resolve(returnFilter);
          });
          return;
        } else if (socialEminence.includes(queryString)) {
          const q = {
            selector: {
              media: { $elemMatch: { socialEminenceType: queryString } }
            },
            limit: 50
          };
          db.find(q).then(doc => {
            const returnFilter = [];
            const newMedia = [];
            doc.docs.forEach(filtered => {
              if (filtered.media.length > 1) {
                filtered.media.forEach(data => {
                  if (data.socialEminenceType === queryString) {
                    newMedia.push(data);
                  }
                  filtered.media = newMedia;
                });
              }
              returnFilter.push(filtered);
            });
            resolve(returnFilter);
          });
          return;
        } else if (name.includes(queryString)) {
          const q = {
            selector: {
              firstName: queryString
            },
            limit: 50
          };
          db.find(q).then(doc => {
            const returnFilter = [];
            const newMedia = [];
            doc.docs.forEach(filtered => {
              returnFilter.push(filtered);
            });
            resolve(returnFilter);
          });
          return;
        } else {
          resolve([]);
          return;
        }
      });
  });
};

mydb.listUsers = (queryString, res) => {
  return new Promise((resolve, reject) => {
    console.log(queryString)
    // let capitalizeQueryString = queryString.toLowerCase();
  // console.log(capitalizeQueryString);
    if (queryString == undefined) {
      const userList = [];
      db.list({ include_docs: true }).then(body => {
        body.rows.forEach(doc => {
          userList.push(doc.doc);
        });
        resolve(userList);
      });
      return;
    }
    convertQueryString = queryString.split(" ");
    let newConvertString = [];
    convertQueryString.forEach(data => {
      newConvertString.push(
        data
          .toLowerCase()
          .charAt(0)
          .toUpperCase() + data.slice(1)
      );
    });
    convertQueryString = newConvertString.join(" ");
    trimmedstr = convertQueryString.replace(/\s+$/, "");
    const q = {
      selector: {
        firstName: {
          $regex: trimmedstr
        }
      },
      limit: 50
    };
    const lastNameQuery = {
      selector: {
        lastName: {
          $regex: trimmedstr
        }
      },
      limit: 50
    };
    lowerCaseConvertQueryString = trimmedstr.toLowerCase();
    const emailQuery = {
      selector: {
        email: {
          $regex: lowerCaseConvertQueryString
        }
      },
      limit: 50
    };

    db.find(q).then(doc => {
      console.log(doc.docs.length);
      if (doc.docs.length === 0) {
        db.find(emailQuery).then(email => {
          if (email.docs.length === 0) {
            db.find(lastNameQuery).then(lastName => {
              resolve(lastName.docs);
            });
            return;
          }
          resolve(email.docs);
        });
        return;
      }
      resolve(doc.docs);
    });
    return;
  })
};

//read = get
mydb.get = (docName, callback) => {
  db.get(docName, callback);
};

//create/update = put
mydb.put = (data, callback) => {
  return db.insert(data, callback);
};

mydb.delete = (req, res) => {};

mydb.getUser = userId => {
  return new Promise(function(resolve, reject) {
    db.get(userId).then((body) => {
      resolve(body);
    })
  });
};

mydb.mediaObject = function(body) {
  const media = {};
  media["market"] = body.market;
  media["title"] = body.title;
  media["socialEminenceType"] = body.socialEminenceType;
  media["city"] = body.city;
  media["contributors"] = body.contributors;
  media["businessUnit"] = body.businessUnit;
  media["externalLink"] = body.externalLink;
  media["status"] = body.status;
  media["date"] = body.date;
  media["_mediaId"] = body.mediaCount;
  return media;
};

// Form database
mydb.listForm = (req, res) => {
  return new Promise((resolve, reject) => {
    formList = [];
    formDb.list({ include_docs: true }).then(body => {
      body.rows.forEach(doc => {
        formList.push(doc.doc);
      });
      resolve(formList);
    });
  })
};
mydb.addFormOption = (req, res) => {
  const media_id = "8806a08fb3d65f418080304070f19f1b";
  return new Promise((resolve, reject) => {
    formDb.get(media_id, { include_docs: true }, (err, data) => {
      if (err) {
        console.error("Unable to get form db's media document.");
        reject(err);
      }
      let category = req.body.hidden_category;
      let newOption = req.body.option;
      console.log(data); //body of document. to be edited.
      //if found match...
      if (
        data[category].findIndex(str => {
          return str.toLowerCase() === newOption.toLowerCase();
        }) != -1
      ) {
        reject(newOption + " already exist in db.");
      } else {
        if (category == "market") newOption = newOption.toUpperCase();
        data[category].push(newOption);
        formDb.insert(data, media_id, () => {
          resolve("success");
        });
      }
    });
  });
};

mydb.userCreate = (userString) => {
  return new Promise((resolve, reject) => {
    db.insert(userString, (body) => {
      resolve(body);
    })
  })
}

mydb.editUser = (req, res, paramString) => {
  return new Promise((resolve, reject) => {
    db.get(paramString.userId).then(data => {
      data.firstName = paramString.firstName;
      data.lastName = paramString.lastName;
      data.email = paramString.email;
      data.role = paramString.role;
      data.status = paramString.status;
      db.insert(data, (err, body) => {
        resolve(body);
      });
    });
  });
 };


// Get everything from db
// mydb.list().then((body) => {
//     body.rows.forEach((doc) => {
//         console.log(doc);
//     });
// });

// mydb.list({ include_docs: true }).then(body => {
//   body.rows.forEach(doc => {
//     // output each document's body
//     console.log(doc.doc);
//   });
// });

// Get document by ID
// mydb.get('6339a6e9f67c4580242e3e78a5e66792', function(err, data) {
//     console.log(data);
// });

// Insert document
// mydb.insert({ object: object }).then((body) => {
//     console.log(body);
// });

/* Update Document Example */
// mydb.list({ include_docs: true }).then(body => {
//   body.rows.forEach(doc => {
//     // console.log(doc.doc);
//     if (doc.doc.email === "ongkw@ibm.com") {
//       doc.doc.status = "Disabled";
//       let user = doc.doc;

//       mydb.insert(user, (err, body) => {
//         console.log(body);
//       });
//     }
//   });
// });

// Destroy document
// mydb.destroy('rabbit', 'rev-id').then((body) => {
//     console.log(body);
// });

// Find
// const q = {
//     selector: {
//         email: { "$eq": "kai.shin.aw@ibm.com"},
//         //age : { "$gt": 25 }
//     },
//     fields: [ "email", "role", "status" ],
//     limit:50
// };
// mydb.find(q).then((doc) => {
//     console.log(doc);
// });

module.exports = mydb;

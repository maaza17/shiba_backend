const express = require("express");
const router = express.Router();

const userModel = require("../../models/User");
const placeModel = require("../../models/Place");
const reviewModel = require("../../models/Review");

//--------------------------------------    USERS   --------------------------------------
// Delete user
router.post("/deleteuser", (req, res) => {
  const email = req.body.email;
  userModel.findOneAndUpdate(
    { email: email, is_deleted: false },
    { is_deleted: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: err.message,
        });
      } else {
        // return res.status(200).json({
        //     error: false,
        //     message: 'Soft delete successful!'
        // })
        reviewModel.updateMany(
          { author: doc._id },
          { is_deleted: true },
          (err, reviews) => {
            if (err) {
              return res.status(400).json({
                error: true,
                message: err.message,
              });
            } else {
              return res.status(200).json({
                error: false,
                message: "Soft delete successful!",
              });
            }
          }
        );
      }
    }
  );
});

// Edit user points
router.post("/editpoints", (req, res) => {
  const email = req.body.email;
  const rewardPoints = req.body.rewardPoints;
  userModel.findOneAndUpdate(
    { email: email, is_deleted: false },
    { rewardPoints: rewardPoints },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: err.message,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "User Reward Points Updated",
        });
      }
    }
  );
});

// Restore user
router.post("/restoreuser", (req, res) => {
  const email = req.body.email;
  userModel.findOneAndUpdate(
    { email: email, is_deleted: true },
    { is_deleted: false },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: err.message,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "User restoration successful!",
        });
      }
    }
  );
});

// Get all users
router.get("/usersall", (req, res) => {
  userModel.find({ is_deleted: false }, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    } else if (docs.length == 0) {
      return res.status(200).json({
        error: false,
        message: "No users found!",
      });
    } else {
      return res.status(200).json({
        error: false,
        message: "Found registered users!",
        data: docs,
      });
    }
  });
});

// Get deleted users
router.get("/getdeletedusers", (req, res) => {
  userModel.find({ is_deleted: true }, (err, docs) => {
    if (err) {
      res.status(400).json({
        error: true,
        message: err.message,
      });
    } else {
      res.status(200).json({
        error: false,
        message: "Found deleted users!",
        data: docs,
      });
    }
  });
});

//--------------------------------------    PLACES   --------------------------------------
// get all places
router.get("/getallplaces", (req, res) => {
  placeModel.find({}, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    } else {
      return res.status(200).json({
        error: false,
        message: "Places found!",
        data: docs,
      });
    }
  });
});

// get pending not deleted places
router.get("/getpendingnotdeletedplaces", (req, res) => {
  placeModel.find({ is_deleted: false, is_approved: false }, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    } else {
      return res.status(200).json({
        error: false,
        message: "Places found!",
        data: docs,
      });
    }
  });
});

// get pending deleted places
router.get("/getpendingdeletedplaces", (req, res) => {
  placeModel.find({ is_deleted: true, is_approved: false }, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    } else {
      return res.status(200).json({
        error: false,
        message: "Places found!",
        data: docs,
      });
    }
  });
});

// get approved not deleted places
router.get("/getapprovednotdeletedplaces", (req, res) => {
  placeModel.find({ is_deleted: false, is_approved: true }, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    } else {
      return res.status(200).json({
        error: false,
        message: "Places found!",
        data: docs,
      });
    }
  });
});

// get approved deleted places
router.get("/getapproveddeletedplaces", (req, res) => {
  placeModel.find({ is_deleted: true, is_approved: true }, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    } else {
      return res.status(200).json({
        error: false,
        message: "Places found!",
        data: docs,
      });
    }
  });
});

// Delete place
router.post("/deleteplace", (req, res) => {
  const _id = req.body._id;

  placeModel.findOneAndUpdate(
    { _id: _id, is_deleted: false },
    { is_deleted: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: err.message,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "Soft delete successful!",
        });
      }
    }
  );
});

// Restore place
router.post("/restoreplace", (req, res) => {
  const _id = req.body._id;
  placeModel.findOneAndUpdate(
    { _id: _id, is_deleted: true },
    { is_deleted: false },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: err.message,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "Place restore successful!",
        });
      }
    }
  );
});

// Approve place
router.post("/approveplace", (req, res) => {
  const placeid = req.body._id;

  placeModel.findOne({ _id: placeid }, (err, doc) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    } else if (doc) {
      const temp = doc;
      temp.is_approved = true;
      temp.save((error, place) => {
        if (error) {
          return res.status(400).json({
            error: true,
            message: error.message,
          });
        } else if (place) {
          const userid = place.createdBy;
          userModel.findOne({ _id: userid }, (error2, user) => {
            if (error2) {
              return res.status(400).json({
                error: true,
                message: error2.message,
              });
            } else if (user) {
              user.rewardPoints += 20;
              user.save((error3, updatedUser) => {
                if (error3) {
                  return res.status(400).json({
                    error: true,
                    message: error3.message,
                  });
                } else if (updatedUser) {
                  return res.status(200).json({
                    error: false,
                    message:
                      "Successuflly updated place and awarded points to author.",
                  });
                } else {
                  return res.status(200).json({
                    error: false,
                    message:
                      "Successuflly updated place but an error occured in rewarding points.",
                  });
                }
              });
            } else {
              return res.status(200).json({
                error: false,
                message: "Successuflly updated place but no author found.",
              });
            }
          });
        } else {
          return res.status(200).json({
            error: false,
            message: "Could not save changes. Please try again later..",
          });
        }
      });
    } else {
      return res.status(200).json({
        error: false,
        message: "Unfortunately, No such place found..",
      });
    }
  });
});


// Approve place
router.post("/disapproveplace", (req, res) => {
  const placeid = req.body._id;
  placeModel.findOne({ _id: placeid }, (err, doc) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    } else if (doc) {
      const temp = doc;
      temp.is_approved = false;
      temp.save((error, place) => {
        if (error) {
          return res.status(400).json({
            error: true,
            message: error.message,
          });
        } else if (place) {
          const userid = place.createdBy;
          userModel.findOne({ _id: userid }, (error2, user) => {
            if (error2) {
              return res.status(400).json({
                error: true,
                message: error2.message,
              });
            } else if (user) {
              user.rewardPoints = user.rewardPoints - 20;
              user.save((error3, updatedUser) => {
                if (error3) {
                  return res.status(400).json({
                    error: true,
                    message: error3.message,
                  });
                } else if (updatedUser) {
                  return res.status(200).json({
                    error: false,
                    message:
                      "Successuflly updated place and deducted points from author.",
                  });
                } else {
                  return res.status(200).json({
                    error: false,
                    message:
                      "Successuflly updated place but an error occured in deducting points.",
                  });
                }
              });
            } else {
              return res.status(200).json({
                error: false,
                message: "Successuflly updated place but no author found.",
              });
            }
          });
        } else {
          return res.status(200).json({
            error: false,
            message: "Could not save changes. Please try again later..",
          });
        }
      });
    } else {
      return res.status(200).json({
        error: false,
        message: "Unfortunately, No such place found..",
      });
    }
  });
});

//--------------------------------------    REVIEWS   --------------------------------------

module.exports = router;

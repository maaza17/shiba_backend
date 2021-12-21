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

// Delete user
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

// Delete place
router.post("/deleteplace", (req, res) => {
  const _id = req.body._id;

  placeModel.findOneAndUpdate(
    { _id: _id, is_deleted: false },
    { is_deleted: true, is_approved: false },
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
  placeModel.findOneAndUpdate(
    { _id: _id, is_deleted: true },
    { is_deleted: false, is_approved: false },
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

//--------------------------------------    REVIEWS   --------------------------------------

module.exports = router;

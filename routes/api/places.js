const express = require("express");
const router = express.Router();

const placeModel = require("../../models/Place");
const userModel = require("../../models/User");
const transport = require('../../config/nodemailer')

// Add place
router.post("/addplace", (req, res) => {
  userModel.findOne({ email: req.body.createdByEmail }, (error, user) => {
    if (error) {
      return res.status(200).json({
        error: true,
        message: error.message,
      });
    } else if (user) {
      let webtext = "";
      if (req.body.website === "") {
        webtext = "Not Available";
      } else {
        webtext = req.body.website;
      }
      let desctext = "";
      if (req.body.desc === "") {
        desctext = "Not Available";
      } else {
        desctext = req.body.desc;
      }
      const newPlace = new placeModel({
        place_name: req.body.place_name,
        lng: req.body.lng,
        lat: req.body.lat,
        category: req.body.category,
        images: req.body.images,
        desc: desctext,
        website: webtext,
        createdBy: user._id,
      });
      newPlace.save((err, place) => {
        if (err) {
          return res.status(200).json({
            error: true,
            message: err.message,
          });
        } else {
          // Send Mail to admin for new added request.
          var mailOptions = {
            from: '"Shib Finder Server" <shibaccepted@gmail.com>',
            to: 'shibfinder@gmail.com',
            subject: 'ShibFinder.com: Add New Place',
            html: '<body><h2>Hello Admin</h2><p> A request for place has been put up and is pending your approval. Please follow the link below:</p><a href="http://www.shibfinder.com">www.shibfinder.com</a></body>'
          };

          transport.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error)
              return res.status(200).json({
                error: true,
                message: error.message,
              });
            }
            console.log('Message sent: %s', info.messageId);
            return res.status(200).json({
              error: false,
              message: "Place added! Pending approval",
              data: place,
            });
          });
        }
      });
    }
  });
});

// Get approved places
router.get("/getapprovedplaces", (req, res) => {
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

// Get approved places for one user
router.post("/getapprovedplacesforoneuser", (req, res) => {
  userModel.findOne({ email: req.body.createdByEmail }, (error, user) => {
    if (error) {
      return res.status(200).json({
        error: true,
        message: error.message,
      });
    } else if (user) {
        placeModel.find({ createdBy: user._id , is_approved: true }, (err, docs) => {
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
    }
  });
});

// Get nearby places within a 10km radius
router.post("/getnearby", (req, res) => {
  const { lng, lat } = req.body;

  placeModel
    .find({ is_deleted: false, is_approved: true })
    .and([
      {
        $and: [
          { lat: { $gte: Number(lat) - 0.05009 } },
          { lat: { $lte: Number(lat) + 0.05009 } },
        ],
      },
      {
        $and: [
          { lng: { $gte: Number(lng) - 0.05009 } },
          { lng: { $lte: Number(lng) + 0.05009 } },
        ],
      },
    ])
    .exec((err, docs) => {
      if (err) {
        return res.status(400).json({
          error: true,
          message: err.message,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "Places within 10km found!",
          data: docs,
        });
      }
    });
});

module.exports = router;

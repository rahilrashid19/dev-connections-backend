const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { User } = require("../models/userModel");
const { ConnectionRequestModel } = require("../models/connectionRequestModel");

const requestRouter = express.Router();

// send request -> like or pass
requestRouter.post(
  "/v1/sendRequest/:toUserId/:status",
  authMiddleware,
  async (req, res) => {
    try {
      let loggedInUser = req.user;
      let sender = loggedInUser._id;
      let reciever = req.params.toUserId;
      let status = req.params.status;
      let allowedStatus = ["like", "pass"];

      //   required fileds verification
      if (!sender || !reciever || !status) {
        return res.status(400).json({
          message: "All fields are mandatory",
        });
      }

      //   Valid status verification
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Not a valid status , please check again",
        });
      }

      //   sender and reciever should not be same verification
      if (sender.toString() === reciever.toString()) {
        return res.status(400).json({
          message: "Can not send a request to your own profile",
        });
      }

      //   user exists in the DB verification , can not send request to any random id

      let userExists = await User.findById(reciever);
      if (!userExists) {
        return res.status(400).json({
          message: "User does not exist on our platform",
        });
      }

      //   duplicate request verification

      let requestAlreadyExists = await ConnectionRequestModel.findOne({
        $or: [
          { sender, reciever },
          { sender: reciever, reciever: sender },
        ],
      });

      if (requestAlreadyExists) {
        return res.status(400).json({
          message:
            "Connection request already exists , wait for the reciever to accept or reject",
        });
      }

      let connectionRequest = new ConnectionRequestModel({
        sender,
        reciever,
        status,
      });

      await connectionRequest.save();

      res.status(201).json({
        message: "Connection Request Sent Successfully",
        data: {
          sender: loggedInUser.firstName,
          reciever: userExists.firstName,
          status,
        },
      });
    } catch (error) {
      console.log(`Send request error => ${error}`);
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  },
);

// review request -> accept or rejcet
requestRouter.post(
  "/v1/reviewRequest/:requestId/:status",
  authMiddleware,
  async (req, res) => {
    try {
      let requestId = req.params.requestId;
      let loggedInUser = req.user;
      let status = req.params.status;
      const allowdStatus = ["accept", "reject"];

      // valid status verification
      if (!allowdStatus.includes(status)) {
        return res.status(400).json({
          message: "Not a valid status , please check again",
        });
      }

      // if connection request exisits in the DB
      let requestExists = await ConnectionRequestModel.findOne({
        _id: requestId,
        status: "like",
        reciever: loggedInUser._id,
      });

      if (!requestExists) {
        return res.status(400).json({
          message: "Request does not exist , please check again",
        });
      }

      requestExists.status = status;
      await requestExists.save();
      res.status(200).json({
        message: `Connection request ${status}ed successfully`,
      });
    } catch (error) {
      console.log(`Review request error ${error}`);
      res.status(400).json({
        message: "Something went wrong",
      });
    }
  },
);

module.exports = { requestRouter };

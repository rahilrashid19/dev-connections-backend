const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionRequestSchema = new Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  reciever: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["accepted", "rejected", "like", "pass"],
      message: `{VALUE} is not a valid status`,
    },
  },
});

connectionRequestSchema.index({ sender: 1, reciever: 1 });

const ConnectionRequestModel = mongoose.model(
  "ConnectionRequestModel",
  connectionRequestSchema,
);
module.exports = { ConnectionRequestModel };

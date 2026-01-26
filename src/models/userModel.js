const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 2,
      maxLength: 25,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      trim: true,
      default: "Employee at Dunder Mufflin , Scrantton pennsylvania",
    },
    profilePic: {
      type: String,
      default:
        "https://helios-i.mashable.com/imagery/longforms/00r6t6ywZjLVZaBr0YGLPmu/images-1.fit_lim.size_1400x.v1697208027.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Please enter a valid URL!");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["Male", "Female"].includes(value)) {
          throw new Error("Not a valid Gender");
        }
      },
    },
    interests: {
      type: [String],
      validate: {
        validator: function (value) {
          if (!Array.isArray(value)) return false;
          return value.length <= 5;
        },
        message: "You can add a maximum of 5 interests",
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
module.exports = { User };

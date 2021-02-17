const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  message: { type: String, required: true, trim: true },
  sender: { type: Types.ObjectId, ref: "User", required: true },
  recipient: { type: Types.ObjectId, ref: "User", required: true },
  time: { type: Date, default: Date.now() },
});

module.exports = model("Message", schema);
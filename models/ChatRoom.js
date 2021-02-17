const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  participants: [ { type: Types.ObjectId, ref: "User"} ],
  conversationHistory: [ { type: Types.ObjectId, ref: "Message" } ]
});

module.exports = model("ChatRoom", schema);
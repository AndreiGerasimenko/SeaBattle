const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  players: [ { type: Types.ObjectId, ref: "User"} ],
  winner: { type: Types.ObjectId, ref: "User", require: true },
  durationTurns: { type: Number, require: true, min: 1 },
  time: { type: Date, require: true }
});

module.exports = model("Game", schema);
const { Schema, model } = require("mongoose");

const schema = new Schema({
  nickname: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = model("User", schema);

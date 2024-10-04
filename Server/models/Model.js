var db = require("./db");

var userSchema = new db.mongoose.Schema(
  {
    userID: { type: String, require: true },
    nameAccount: { type: String, require: true },
    namePassword: { type: String, require: true },
    idShift: { type: String, require: true },
    role: { type: Number, require: true, default: 1 },
    nftCount: { type: Number, default: 0 },
  },
  {
    collection: "User",
  }
);
let UserModel = db.mongoose.model("UserModel", userSchema);

module.exports = { UserModel };

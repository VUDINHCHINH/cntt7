var Model = require("../models/Model");

async function createDefaultData() {
  const adminExists = await Model.UserModel.findOne({ "role": 2 });
  if (!adminExists) {
    const defaultAdmin = new Model.UserModel({
      nameAccount: 'hzdev@gmail.com',
      namePassword: 'admin',
      idShift:1,
      'role': 2
    });
    await defaultAdmin.save();
    console.log("Admin_Data_Create");
  } else {
    console.log("Admin_No_Create");
  }
  const userExists = await Model.UserModel.findOne({ "role": 1 });
  if (!userExists) {
    const defaultUser = new Model.UserModel({
      nameAccount: 'abc@gmail.com',
      namePassword: 'abc',
      idShift:2,
      'role': 1
    });
    await defaultUser.save();
    console.log("User_Data_Create");
  } else {
    console.log("User_No_Create");
  }
  console.log("Finished_Create");
}

createDefaultData().catch(error => {
  console.error("Error:", error);
});





exports.yeu_cau_dang_nhap = (req, res, next) => {
  if (req.session.userLogin) {
    console.log("Đã Đăng Nhập")
    next();
  } else {
    console.log("Chưa Đủ Quyền Hạn");
    res.redirect("/auth/signin");
  }
};

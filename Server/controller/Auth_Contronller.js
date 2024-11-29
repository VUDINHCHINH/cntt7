var Model = require("../models/Model");
const axios = require('axios');
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI1MDAxN2ViMC01NWNmLTQzZTItODA4Yy03NTBjN2Q0NjRjZDAiLCJzdWIiOiIzODZmMDcxOS04YzE1LTQ5YzctYTk5Zi01MzFjNmJhNDUxMzkiLCJpYXQiOjE3MzIyNjU1Njh9.zS11U7BBCTjF0QA2lcF07LKdhDeEkn9Bvt3ra0WHgMM";


exports.Register = async(req, res, next) => {
    let msg = "";
    try {
        const { nameAccount, namePassword, confirmPassword, referenceId, externalWalletAddress } = req.body;

        if (!nameAccount || !namePassword || !referenceId || !externalWalletAddress) {
            msg = "Vui lòng không để trống trường nào";
            return res.render("auth/register.ejs", { msg: msg }); // Nếu thiếu thông tin, render lại form đăng ký
        }

        const userExists = await Model.UserModel.findOne({ nameAccount: nameAccount });
        if (userExists) {
            msg = "Email đã được sử dụng";
            return res.render("auth/register.ejs", { msg: msg }); // Nếu email đã tồn tại, render lại form đăng ký
        }

        if (namePassword !== confirmPassword) {
            msg = "Password và Confirm Password không khớp";
            return res.render("auth/register.ejs", { msg: msg }); // Nếu mật khẩu không khớp, render lại form đăng ký
        }

        try {
            const response = await axios.post('https://api.gameshift.dev/nx/users', {
                referenceId: referenceId,
                email: nameAccount,
                externalWalletAddress: externalWalletAddress
            }, {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'x-api-key': apiKey
                }
            });

            if ((response.data.referenceId && response.data.email) || response.status === 201) {
                const user = new Model.UserModel({
                    userID: response.data.referenceId,
                    nameAccount: nameAccount,
                    namePassword: namePassword,
                    idShift: referenceId,
                    role: 1
                });

                const savedUser = await user.save();

                return res.redirect("/auth/signin");
            } else {
                msg = "Đăng ký thất bại. Thông tin trả về không hợp lệ.";
                return res.render("auth/register.ejs", { msg: msg });
            }
        } catch (apiError) {
            console.error(apiError);
            msg = (apiError.response && apiError.response.data && apiError.response.data.message) || "Đăng ký thất bại";
            return res.render("auth/register.ejs", { msg: msg });
        }
    } catch (error) {
        console.error(error);
        msg = error.message;
        return res.render("auth/register.ejs", { msg: msg });
    }
};






exports.SignIn = async(req, res, next) => {
    let user;
    let msg = "";
    if (req.method == "POST") {
        try {
            let objU = await Model.UserModel.findOne({
                nameAccount: req.body.nameAccount,
            });

            if (objU != null) {
                if (objU.namePassword === req.body.namePassword) {
                    // Lưu thông tin người dùng vào session
                    req.session.userLogin = {
                        id: objU._id,
                        name: objU.nameAccount,
                        referenceId: objU.idShift,
                        role: objU.role
                    };
                    console.log("==== Start login ====");
                    console.log(objU.fullName);
                    console.log("==== End login ====");
                    msg = "SignIn Success!";
                    if (objU.role === 2) {
                        return res.redirect("/admin/home");
                    } else {
                        return res.redirect("/comics");
                    }
                } else {
                    msg = "Sai mật khẩu!";
                }
            } else {
                msg = "Không tồn tại user " + req.body.nameAccount;
            }
        } catch (error) {
            msg = error.message;
        }
    }
    res.render("auth/sign_in.ejs", { msg: msg, user: user });
};


exports.SignOut = async(req, res, next) => {
    try {
        // Kiểm tra session
        if (req.session && Object.keys(req.session).length !== 0) {
            console.log("Account_session_SignOut");
            console.log(req.session.user);

            // Hủy session
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Complete_Data_session");
                }
            });
        } else {
            console.log("Session_Empty_And_Null");
        }
        res.redirect("/auth/signin");
    } catch (error) {
        console.error(error);
        res.redirect("/auth/signin");
    }
};
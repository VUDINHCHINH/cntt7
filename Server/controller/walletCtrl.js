const walletModel = require('../models/walletModels');
const axios = require("axios");

const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI1MDAxN2ViMC01NWNmLTQzZTItODA4Yy03NTBjN2Q0NjRjZDAiLCJzdWIiOiIzODZmMDcxOS04YzE1LTQ5YzctYTk5Zi01MzFjNmJhNDUxMzkiLCJpYXQiOjE3MzIyNjU1Njh9.zS11U7BBCTjF0QA2lcF07LKdhDeEkn9Bvt3ra0WHgMM';

exports.getUserItems = async (req, res, next) => {
  let msg = "";
  let userItems = [];
  try {
    const referenceId = req.params.referenceId;

    if (!referenceId) {
      msg = "Không tìm thấy referenceId";
      return res.render("Profile/profile", { msg: msg, userItems: userItems });
    }
    try {
      const response = await axios.get(`https://api.gameshift.dev/nx/users/${referenceId}/items?page=1&perPage=6`, {
        headers: {
          'accept': 'application/json',
          'x-api-key': apiKey
        }
      });
      if (response.data && response.data.data) {
        userItems = response.data.data;
        msg = "Lấy danh sách tài sản thành công!";
      } else {
        msg = "Không tìm thấy tài sản.";
      }
    } catch (apiError) {
      console.error(apiError);
      msg = apiError.response?.data?.message || "Lỗi khi lấy danh sách tài sản";
    }
  } catch (error) {
    console.error(error);
    msg = error.message;
  }
  res.render("Profile/profile", { msg: msg, userItems: userItems,userLogin: req.session.userLogin });
};

const Model = require('../models/Model');
exports.Rank = async (req, res, next) => {
  try {
    updateNFTCounts();
    const users = await Model.UserModel.find({})
      .sort({ nftCount: -1 })
      .exec();
    let rank = 1;
    const rankedUsers = users.map(user => ({
      ...user.toObject(),
      rank: rank++
    }));
    res.render('Profile/ranking', { users: rankedUsers,userLogin: req.session.userLogin });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng:", error);
    res.status(500).send("Lỗi khi lấy dữ liệu người dùng.");
  }
};

async function updateNFTCounts() {
  try {
    const users = await Model.UserModel.find({}, 'idShift nftCount').exec();
    for (const user of users) {
      try {
        const { idShift } = user;
        const collectionId = "fb82d2f9-469e-43dc-a254-5a769e68b18f";
        const response = await axios.get(`https://api.gameshift.dev/nx/users/${idShift}/items?page=1&perPage=100&collectionId=${collectionId}`, {
          headers: {
            'accept': 'application/json',
            'x-api-key': apiKey
          }
        });

        if (response.data && response.data.data) {
          const uniqueAssets = response.data.data.filter(item => 
            item.type === 'UniqueAsset' && item.item.collection && item.item.collection.id === collectionId
          );
          const nftCount = uniqueAssets.length;
          user.nftCount = nftCount;
          await user.save();
          console.log(`User with idShift ${idShift} has ${nftCount} NFTs.`);
        } else {
          console.log(`Không tìm thấy tài sản cho user với idShift ${idShift}.`);
        }
      } catch (apiError) {
        console.error(`Lỗi khi gọi API cho user với idShift ${user.idShift}:`, apiError);
      }
    }

    console.log("Cập nhật số lượng NFT cho tất cả người dùng hoàn tất.");
  } catch (error) {
    console.error("Lỗi khi lấy người dùng từ MongoDB:", error);
  }
}

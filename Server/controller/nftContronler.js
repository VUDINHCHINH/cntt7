const axios = require("axios");

exports.createNFT = async (req, res) => {
  const PK =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI1MDAxN2ViMC01NWNmLTQzZTItODA4Yy03NTBjN2Q0NjRjZDAiLCJzdWIiOiIzODZmMDcxOS04YzE1LTQ5YzctYTk5Zi01MzFjNmJhNDUxMzkiLCJpYXQiOjE3MzIyNjU1Njh9.zS11U7BBCTjF0QA2lcF07LKdhDeEkn9Bvt3ra0WHgMM";

    if (req.method === "GET") {
      return res.render("NFT/create_NFT", { error: null });
    }
  if (!PK) {
      console.error('PK is not defined');
      return res.status(500).send('Internal server error: PK is not defined');
  }

  const { collectionId, description, imageUrl, name, attributes } = req.body;
  if (!collectionId || !description || !imageUrl || !name || !attributes) {
    return res.render("NFT/create_NFT", { message: "Thiếu Thông Tin" });
  }

  const config = {
    headers: {
      "x-api-key": PK,
      "Content-Type": "application/json",
    },
  };

  const payload = {
    details: {
      collectionId: req.body.collectionId,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      name: req.body.name,
      attributes: req.body.attributes,
    },
    destinationUserReferenceId: "1",
  };

  var requestOptions = {
    method: "POST",
    headers: config,
    body: payload,
    redirect: "follow",
  };

  console.log("Payload:", payload);
  try {
    const response = await axios.post(
      "https://api.gameshift.dev/nx/unique-assets",
      requestOptions
    );
    console.log(response);
    res.json({ message: "NFT created successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.response ? error.response.data : error.message });
  }
};

exports.createUniqueAsset = async (req, res) => {
  const {
    name,
    description,
    imageUrl,
    collectionId,
    traitType,
    value,
  } = req.body;
  if (req.method === "GET") {
    return res.render("NFT/create_NFT",{userLogin: req.session.userLogin});
  }

  if (req.method === "POST") {
    if (!collectionId) {
      msg = "COLLECTIONID Không được để trống!";
    }
    if (!description) {
      msg = "DESCRIPTION Không được để trống!";
    }
    if (!imageUrl) {
      msg = "IMG_URL Không được để trống!";
    }
    if (!name) {
      msg = "NAME Không được để trống!";
    }
    if (!traitType) {
      msg = "TRAITTYPER Không được để trống!";
    }
  }
  const options = {
    method: "POST",
    url: "https://api.gameshift.dev/nx/unique-assets",
    headers: {
      accept: "application/json",
      "x-api-key":
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI1MDAxN2ViMC01NWNmLTQzZTItODA4Yy03NTBjN2Q0NjRjZDAiLCJzdWIiOiIzODZmMDcxOS04YzE1LTQ5YzctYTk5Zi01MzFjNmJhNDUxMzkiLCJpYXQiOjE3MzIyNjU1Njh9.zS11U7BBCTjF0QA2lcF07LKdhDeEkn9Bvt3ra0WHgMM",
      "content-type": "application/json",
    },
    data: {
      details: {
        attributes: [{ traitType, value }],
        collectionId: collectionId,
        description: description,
        imageUrl: imageUrl,
        name: name,
      },
      destinationUserReferenceId: "1",
    },
  };

  try {
    const response = await axios.request(options);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

let storedItemIds = [];
exports.fetchAndStoreItemIds = async (req, res) => {
  const { collectionId } = req.params;
  const PK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI1MDAxN2ViMC01NWNmLTQzZTItODA4Yy03NTBjN2Q0NjRjZDAiLCJzdWIiOiIzODZmMDcxOS04YzE1LTQ5YzctYTk5Zi01MzFjNmJhNDUxMzkiLCJpYXQiOjE3MzIyNjU1Njh9.zS11U7BBCTjF0QA2lcF07LKdhDeEkn9Bvt3ra0WHgMM";
  const apiUrl = `https://api.gameshift.dev/nx/asset-collections/${collectionId}/assets`;

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        accept: 'application/json',
        'x-api-key': PK,
      },
    });
    const items = response.data.data;
    storedItemIds = items.map(item => item.item.id);
    console.log("Stored Item IDs:", storedItemIds);
    res.status(200).json({ message: "Item IDs fetched and stored successfully.", itemIds: storedItemIds, userLogin: req.session.userLogin });
  } catch (error) {
    console.error('Error fetching item IDs:', error.message);
    res.status(500).json({ error: error.message });
  }
};



const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI1MDAxN2ViMC01NWNmLTQzZTItODA4Yy03NTBjN2Q0NjRjZDAiLCJzdWIiOiIzODZmMDcxOS04YzE1LTQ5YzctYTk5Zi01MzFjNmJhNDUxMzkiLCJpYXQiOjE3MzIyNjU1Njh9.zS11U7BBCTjF0QA2lcF07LKdhDeEkn9Bvt3ra0WHgMM';
exports.getItemNFT = async (req, res, next) => {
  try {
    const referenceId = 1;
    const collectionId="0d32ac27-6ba6-4739-ac4f-156817929dc3";
    try {
      const response = await axios.get(`https://api.gameshift.dev/nx/users/${referenceId}/items?page=1&perPage=6&collectionId=${collectionId}`, {
        headers: {
          'accept': 'application/json',
          'x-api-key': apiKey
        }
      });
      if (response.data && response.data.data) {
        updateNFTCounts();
        const userItemIds = response.data.data.map(item => item.item.id);
        const msg = "Lấy danh sách tài sản thành công!";
        req.session.userItemIds = userItemIds; 
        console.log(userItemIds);
      }else {
        msg = "Không tìm thấy tài sản.";
      }
    } catch (apiError) {
      console.error(apiError);
    }
  } catch (error) {
    console.error(error);
    msg = error.message;
  }
};


exports.handleItemTransfer = async (req, res) => {
  let userItemIds = [];

  try {
    const referenceId = req.session.userLogin?.referenceId;
    if (!referenceId) {
      return res.status(400).json({ message: "DESTINATION_USER_REFERENCE_ID không được lấy từ session!" });
    }

    const reference = 1; 
    const collectionId = "0d32ac27-6ba6-4739-ac4f-156817929dc3";

    try {
      const response = await axios.get(`https://api.gameshift.dev/nx/users/${reference}/items?page=1&perPage=6&collectionId=${collectionId}`, {
        headers: {
          'accept': 'application/json',
          'x-api-key': apiKey
        }
      });

      if (response.data && response.data.data) {
        updateNFTCounts();
        userItemIds = response.data.data.map(item => item.item.id);
      } else {
        return res.status(404).json({ message: "Không tìm thấy tài sản." });
      }
    } catch (apiError) {
      return res.status(500).json({ message: "Lỗi khi gọi API lấy tài sản." });
    }

    if (userItemIds.length === 0) {
      return res.status(400).json({ message: "Không có item để chuyển!" });
    }

    const id_item = userItemIds[Math.floor(Math.random() * userItemIds.length)];

    const options = {
      method: "POST",
      url: `https://api.gameshift.dev/nx/users/${reference}/items/${id_item}/transfer`,
      headers: {
        accept: "application/json",
        "x-api-key": apiKey,
        "content-type": "application/json",
      },
      data: {
        quantity: "1",
        destinationUserReferenceId: referenceId,
      },
  
    };
   
    try {
      const transferResponse = await axios(options);
      const { transactionId, consentUrl } = transferResponse.data;

      if (transactionId && consentUrl) {
        updateNFTCounts();
        res.render('NFT/transfer_NFT', { 
          transactionId, 
          consentUrl,
          message: 'Vui lòng Xác nhận!',
          userLogin: req.session.userLogin
        });
      } else {
        res.status(500).render('transactionResult', {
          message: 'Dữ liệu phản hồi không hợp lệ',
          transactionId: null,
          consentUrl: null
        });
      }
    } catch (transferError) {
      console.error("Lỗi khi gọi API chuyển tài sản:", transferError.response?.data || transferError.message);
      res.status(500).render('NFT/transfer_NFT', {
        message: 'Lỗi khi thực hiện chuyển nhượng tài sản',
        transactionId: null,
        consentUrl: null
      });
    }
  } catch (error) {
    res.status(500).render('NFT/transfer_NFT', {
      message: error.message
    });
  }
};




const Model = require('../models/Model');
async function updateNFTCounts() {
  try {
    const users = await Model.UserModel.find({}, 'idShift nftCount').exec();
    for (const user of users) {
      try {
        const { idShift } = user;
        const collectionId = "0d32ac27-6ba6-4739-ac4f-156817929dc3";
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
updateNFTCounts();

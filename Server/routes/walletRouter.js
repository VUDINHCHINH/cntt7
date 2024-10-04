const express = require('express');
const router = express.Router();
const walletController = require('../controller/walletCtrl');
const nftController = require('../controller/nftContronler');
// Định nghĩa tuyến đường để lấy thông tin ví
// router.get('/:address', walletController.getWalletInfo);
// router.get('/',walletController.connectWallet);
// router.get('/profile/:id',walletController.connectWallet);


function requireAdmin(req, res, next) {
    if (!req.session.userLogin) {
      return res.redirect("/auth/signin");
    }
    if (req.session.userLogin.role === 1) {
      return next();
    }
    if (req.session.userLogin.role === 2) {
      return next();
    }
    return res.redirect("/comics");
}



router.get('/profile/:referenceId',requireAdmin,walletController.getUserItems);
router.get('/rankings',requireAdmin,walletController.Rank);

module.exports = router;

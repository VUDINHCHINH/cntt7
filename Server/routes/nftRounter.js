const express = require('express');
const router = express.Router();
const nftController = require('../controller/nftContronler');


function requireAdmin(req, res, next) {
    if (!req.session.userLogin) {
      return res.redirect('/auth/signin');
    }
    if (req.session.userLogin['role'] === 1) {
      res.redirect('/comics');
      return next();
    } else if (req.session.userLogin['role'] === 2) {
      return next();
    } else {
      return res.send('Bạn không đủ quyền hạn');
    }
}

function requireTranf(req, res, next) {
  if (!req.session.userLogin) {
    return res.redirect('/auth/signin');
  }
  if (req.session.userLogin['role'] === 1 || req.session.userLogin['role'] === 2) {
    return next();
  }
}

router.get('/create',requireAdmin, nftController.createUniqueAsset);
router.post('/create',requireAdmin, nftController.createUniqueAsset);



router.get('/items/:collectionId',requireAdmin,nftController.fetchAndStoreItemIds);

router.post('/getnft',requireTranf, nftController.getItemNFT);
router.get('/getnft',requireTranf, nftController.getItemNFT);

router.post('/transfer',requireTranf, nftController.handleItemTransfer);
router.get('/transfer',requireTranf, nftController.handleItemTransfer);

module.exports = router; 

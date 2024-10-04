const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin_Contronler');

function requireAdmin(req, res, next) {
    // Check Login
    if (!req.session.userLogin) {
      return res.redirect('/auth/signin');
    }
    // Check Admin
    if (req.session.userLogin['role'] === 1) {
      res.redirect('/home');
      return next();
    } else if (req.session.userLogin['role'] === 2) {
      return next();
    } else {
      return res.send('Bạn không đủ quyền hạn');
    }
}

router.get('/home',requireAdmin, adminController.getAssetCollections);
router.get('/collection/:collectionId',requireAdmin, adminController.getCollectionAssets);



module.exports = router;

const express = require('express');
const router = express.Router();
const comicController = require('../controller/comicController');

function requireAdmin(req, res, next) {
    if (!req.session.userLogin) {
        return res.redirect('/auth/signin');
    }
    if (req.session.userLogin.role === 1) {
        return next();
    }
    if (req.session.userLogin.role === 2) {
        return next();
    }
    console.log('Bạn không đủ quyền hạn');

    return res.redirect('/comics');
}

router.get('/', requireAdmin, comicController.getComics);

router.get('/search', requireAdmin, comicController.searchComics);

router.get(
    '/readcomics/:idComics',
    requireAdmin,
    comicController.getReadComics
);

router.get(
    '/detailcomics/:slug',
    requireAdmin,
    comicController.getDetailComics
);
// Route để gửi đánh giá truyện (POST)
router.post('/submitReview', requireAdmin, comicController.submitReview);

// Route thêm vào danh sách yêu thích (POST)
router.post('/addToFavorites', requireAdmin, comicController.addToFavorites);
router.get('/stats', requireAdmin, comicController.getStats);
module.exports = router;

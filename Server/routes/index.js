var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
const items = Array.from({ length: 22293 }, (_, i) => `Item ${i + 1}`);

router.get('/testPage', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const itemsPerPage = 24; // Số lượng mục trên mỗi trang
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;

  const paginatedItems = items.slice(startIndex, endIndex);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  // Tính toán phạm vi trang cần hiển thị
  const maxPagesToShow = 5;
  let startPage = Math.max(page - Math.floor(maxPagesToShow / 2), 1);
  let endPage = startPage + maxPagesToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(endPage - maxPagesToShow + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  res.render('testPage', {
    items: paginatedItems,
    currentPage: page,
    totalPages: totalPages,
    pages: pages
  });
});

module.exports = router;

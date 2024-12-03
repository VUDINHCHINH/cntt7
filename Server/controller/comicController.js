// controllers/comicController.js
const axios = require('axios');

exports.getComics = async (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let status = req.query.status || 'truyen-moi'; // Default status
        let api = `https://otruyenapi.com/v1/api/danh-sach/${status}?page=${page}`;

        const response = await axios.get(api);
        const data = response.data;

        if (!data || !data.data || !data.data.items) {
            throw new Error('Invalid data from API');
        }

        const itemsPerPage = data.data.params.pagination.totalItemsPerPage;
        const totalPages = Math.ceil(
            data.data.params.pagination.totalItems / itemsPerPage
        );

        // Calculate pagination
        const maxPagesToShow = data.data.params.pagination.pageRanges;
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

        res.render('Home/Home', {
            title: `Danh sách truyện`,
            comics: data.data.items,
            currentPage: page,
            totalPages: totalPages,
            pages: pages,
            userLogin: req.session.userLogin,
            status: status,
        });
    } catch (error) {
        console.error('Error fetching comics:', error);
        res.status(500).json({ error: 'Error fetching comics' });
    }
};

exports.searchComics = async (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let keyword = req.query.keyword;
        const api =
            'https://otruyenapi.com/v1/api/tim-kiem?keyword=' +
            keyword +
            '&page=' +
            page;
        console.log(api);
        const response = await axios.get(api);
        const data = response.data;
        const itemsPerPage = data.data.params.pagination.totalItemsPerPage; // Số lượng mục trên mỗi trang

        const totalPages = Math.ceil(
            data.data.params.pagination.totalItems / itemsPerPage
        );

        // Tính toán phạm vi trang cần hiển thị
        const maxPagesToShow = data.data.params.pagination.pageRanges;
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

        // console.log(data.data.params.pagination.totalItems);

        // Kiểm tra dữ liệu
        if (!data || !data.data || !data.data.items) {
            throw new Error('Invalid data from API');
        }

        // Render view với dữ liệu truyện tranh
        res.render('Home/Home', {
            title: 'Danh sách truyện tranh',
            comics: data.data.items,
            currentPage: page,
            totalPages: totalPages,
            keyword: keyword,
            pages: pages,
            userLogin: req.session.userLogin,
            status: null, // Add this line to define 'status'
        });
    } catch (error) {
        console.error('Error fetching comics:', error);
        res.status(500).json({ error: 'Error fetching comics' });
    }
};

exports.getReadComics = async (req, res, next) => {
    try {
        let idComics = req.params.idComics;
        const api = 'https://sv1.otruyencdn.com/v1/api/chapter/' + idComics;
        const response = await axios.get(api);
        const data = response.data.data;

        res.render('Comics/ReadComic', {
            data,
            userLogin: req.session.userLogin,
        });
        console.log(api);
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra');
    }
};

exports.getDetailComics = async (req, res, next) => {
    console.log('getDetailComics');

    try {
        let slug = req.params.slug;
        console.log('slug', slug);

        let title, breadcrumb;

        const api = 'https://otruyenapi.com/v1/api/truyen-tranh/' + slug;
        const response = await axios.get(api);
        const data = response.data.data;

        res.render('Comics/DetailComic', {
            title: data.seoOnPage.titleHead,
            comic: data.item,
            breadcrumb: data.breadCrumb,
            userLogin: req.session.userLogin,
        });
        console.log(api);
        console.log(title, breadcrumb);
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra');
    }
};

//
exports.getDetailComics = async (req, res, next) => {
    try {
        let slug = req.params.slug;
        let title, breadcrumb;

        const api = 'https://otruyenapi.com/v1/api/truyen-tranh/' + slug;
        const response = await axios.get(api);
        const data = response.data.data;

        // Lấy danh sách đánh giá từ cơ sở dữ liệu (giả sử đã có một bảng đánh giá)
        const reviews = await Review.find({ comicId: data.item.id });

        res.render('Comics/DetailComic', {
            title: data.seoOnPage.titleHead,
            comic: data.item,
            breadcrumb: data.breadCrumb,
            userLogin: req.session.userLogin,
            reviews: reviews,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra');
    }
};
// Route để thêm truyện vào danh sách yêu thích
exports.addToFavorites = async (req, res, next) => {
    try {
        const { comicId } = req.body;
        const userId = req.session.userLogin._id;

        // Kiểm tra xem truyện đã có trong danh sách yêu thích chưa
        const user = await User.findById(userId);
        if (!user.favorites.includes(comicId)) {
            user.favorites.push(comicId);
            await user.save();
        }

        res.redirect('/favorites'); // Chuyển tới trang danh sách yêu thích
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra khi thêm vào yêu thích');
    }
};

// Route hiển thị danh sách yêu thích của người dùng
exports.getFavorites = async (req, res, next) => {
    try {
        const userId = req.session.userLogin._id;
        const user = await User.findById(userId).populate('favorites');
        
        res.render('User/Favorites', {
            title: 'Danh sách yêu thích',
            comics: user.favorites,
            userLogin: req.session.userLogin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra khi lấy danh sách yêu thích');
    }
};
exports.getStats = async (req, res, next) => {
    try {
        const totalComics = await Comic.countDocuments();
        const totalFavorites = await Favorite.countDocuments();
        const totalReviews = await Review.countDocuments();

        res.render('Admin/Stats', {
            title: 'Thống kê',
            totalComics,
            totalFavorites,
            totalReviews,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi xảy ra khi lấy thống kê');
    }
};


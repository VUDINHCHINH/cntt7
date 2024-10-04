// controllers/comicController.js
const axios = require('axios');

exports.getComics = async (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 1;
        const api = 'https://otruyenapi.com/v1/api/danh-sach/truyen-moi?page=' + page;
        console.log(api);
        const response = await axios.get(api);
        const data = response.data;
        const itemsPerPage = data.data.params.pagination.totalItemsPerPage; // Số lượng mục trên mỗi trang
        

        const totalPages = Math.ceil(data.data.params.pagination.totalItems / itemsPerPage);

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
        if (!data || !data.data || !data.data.items) {
            throw new Error('Invalid data from API');
        }
        res.render('Home/Home', { 
            title: 'Danh sách truyện tranh', 
            comics: data.data.items,
            currentPage: page,
            totalPages: totalPages,
            pages: pages,
            userLogin: req.session.userLogin });
        console.log(req.session.userLogin);
    } catch (error) {
        console.error('Error fetching comics:', error);
        res.status(500).json({ error: 'Error fetching comics' });
    }
};

exports.searchComics = async (req, res, next) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let keyword = req.query.keyword;
        const api = 'https://otruyenapi.com/v1/api/tim-kiem?keyword='+keyword+'&page='+page;
        console.log(api);
        const response = await axios.get(api);
        const data = response.data;
        const itemsPerPage = data.data.params.pagination.totalItemsPerPage; // Số lượng mục trên mỗi trang


        const totalPages = Math.ceil(data.data.params.pagination.totalItems / itemsPerPage);

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
            userLogin: req.session.userLogin
        });
    } catch (error) {
        console.error('Error fetching comics:', error);
        res.status(500).json({ error: 'Error fetching comics' });
    }
};

exports.getReadComics = async (req, res, next) => {
    try {
        let idComics = req.params.idComics
            const api = "https://sv1.otruyencdn.com/v1/api/chapter/"+idComics
            const response = await axios.get(api);
            const data = response.data.data;
           
    
            res.render('Comics/ReadComic', { data , userLogin: req.session.userLogin});
            console.log(api);
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra');
        }
};

exports.getDetailComics = async (req, res, next) => {
    try {
        let slug = req.params.slug;
        let title,breadcrumb;

            const api = 'https://otruyenapi.com/v1/api/truyen-tranh/'+ slug
            const response = await axios.get(api);
            const data = response.data.data;
    
            res.render('Comics/DetailComic', { 
                title: data.seoOnPage.titleHead, 
                comic: data.item,
                breadcrumb: data.breadCrumb,
                userLogin: req.session.userLogin
              });
              console.log(api);
              console.log(title,breadcrumb)
        } catch (error) {
            console.error(error);
            res.status(500).send('Có lỗi xảy ra');
        }
};


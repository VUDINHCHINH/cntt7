const axios = require('axios');
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiI1MDAxN2ViMC01NWNmLTQzZTItODA4Yy03NTBjN2Q0NjRjZDAiLCJzdWIiOiIzODZmMDcxOS04YzE1LTQ5YzctYTk5Zi01MzFjNmJhNDUxMzkiLCJpYXQiOjE3MzIyNjU1Njh9.zS11U7BBCTjF0QA2lcF07LKdhDeEkn9Bvt3ra0WHgMM';

exports.getAssetCollections = async (req, res) => {
    const apiUrl = 'https://api.gameshift.dev/nx/asset-collections?page=1&perPage=5';
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          accept: 'application/json',
          'x-api-key': apiKey,
        },
      });
      const collections = response.data.data;
      res.render('Admin/Home', { collections, userLogin: req.session.userLogin });
    } catch (error) {
      console.error('Error fetching asset collections:', error.message);
      res.status(500).send('Internal Server Error');
    }
  };
  

exports.getCollectionAssets = async (req, res) => {
    const { collectionId } = req.params;
    const apiUrl = `https://api.gameshift.dev/nx/asset-collections/${collectionId}/assets?page=1&perPage=10`;
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          accept: 'application/json',
          'x-api-key': apiKey,
        },
      });
  
      const assets = response.data.data;
      res.render('Admin/DetailCollect', { assets,userLogin: req.session.userLogin });
    } catch (error) {
      console.error('Error fetching assets:', error.message);
      res.status(500).send('Internal Server Error');
    }
  };
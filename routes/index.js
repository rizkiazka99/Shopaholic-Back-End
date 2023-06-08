const route = require('express').Router();
const sellersRoutes = require('./sellersRoutes.js');
const productsRoutes = require('./productsRoutes');
const categoriesRoutes = require('./categoriesRoutes.js');
const productGalleriesRoutes = require('./productGalleriesRoutes.js');

route.get('/api', (request, response) => {
    response.status(200).json({
        message: 'Shopaholic API'
    });
});

route.use('/api/sellers', sellersRoutes);
route.use('/api/products', productsRoutes);
route.use('/api/categories', categoriesRoutes);
route.use('/api/product_galleries', productGalleriesRoutes);

module.exports = route;